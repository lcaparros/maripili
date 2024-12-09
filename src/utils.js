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

export async function searchGif({ query, offsetIndex = 40, type = randomFromPercentage(50) ? 'gifs' : 'stickers' }) {
  const gf = new GiphyFetch(BOT_GIPHY_API_KEY)

  const offset = randomIntFromInterval(0, offsetIndex)
  const { data: gifs } = await gf.search(query, {
    sort: 'relevant',
    offset,
    limit: 1,
    type
  })

  return gifs[0].images.original.url
}

export function getCurrentDate() {
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

  const hoy = new Date()
  const dia = hoy.getDate()
  const mes = meses[hoy.getMonth()]

  return `${dia} de ${mes}`
}

export function isXmas() {
  const hoy = new Date()
  const dia = hoy.getDate()
  const mes = hoy.getMonth() + 1

  if ((mes === 12 && dia >= 10) || (mes === 1 && dia <= 7)) {
    return true
  } else {
    return false
  }
}
