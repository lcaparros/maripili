// This module is disabled due to time necessary for generating voices in FakeYou is insane except if yoy pay for a sub

import * as crypto from 'crypto'
import { sleepMs } from './utils.js'

const fakeApiUrl = 'https://api.fakeyou.com'

export async function getVoices() {
  const res = await fetch(`${fakeApiUrl}/tts/list`)
  const body = await res.json()
  return body.models
}

export async function getVoicesByLanguage(lang) {
  const voices = await getVoices()
  return voices.filter((voice) => voice.ietf_primary_language_subtag == lang)
}

export async function getVoicesByTitle(title) {
  const voices = await getVoices()
  return voices.filter((voice) => voice.title == title)
}

export async function getVoicesModelTokenByTitle(title) {
  const voices = await getVoices()
  return voices.filter((voice) => voice.title == title)[0].model_token
}

export async function fakeVoice(token, text) {
  const fakeBuckerUrl = 'https://storage.googleapis.com/vocodes-public'

  const uuid = crypto.randomUUID()
  const data = {
    uuid_idempotency_token: uuid,
    tts_model_token: token,
    inference_text: text
  }
  const inferenceJobTokenReq = await fetch(`${fakeApiUrl}/tts/inference`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const inferenceJobTokenBody = await inferenceJobTokenReq.json()
  const inferenceJobToken = inferenceJobTokenBody.inference_job_token

  while (true) {
    const inferenceJobDataReq = await fetch(`${fakeApiUrl}/tts/job/${inferenceJobToken}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const body = await inferenceJobDataReq.json()
    if (body.state.status === 'complete_success') {
      return body.state.maybe_public_bucket_wav_audio_path
    }
    await sleepMs(1000)
  }
}
