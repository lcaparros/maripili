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
