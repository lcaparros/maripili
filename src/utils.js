import { GiphyFetch } from '@giphy/js-fetch-api'
import { BOT_GIPHY_API_KEY } from './config.js'

export function getElementFromArray(array) {
  const random = Math.floor(Math.random() * array.length)
  return array[random]
}

export function randomFromPercentage(percentage) {
  const random = randomIntFromInterval(1, 100)
  return random > percentage ? true : false
}

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function sleepMs(time) {
  return new Promise((r) => setTimeout(r, time))
}

export async function searchGif(query, offsetIndex = 40) {
  const gf = new GiphyFetch(BOT_GIPHY_API_KEY)

  const offset = randomIntFromInterval(1, offsetIndex)
  const type = randomFromPercentage(50) ? 'gifs' : 'stickers'
  const { data: gifs } = await gf.search(query, {
    sort: 'relevant',
    offset,
    limit: 1,
    type
  })

  return gifs[0].images.original.url
}
