import data from '../data/data.json'

export function getAllHexagrams() {
  const allHexagrams = data.hexagrams
  return allHexagrams
}

export function getHexagramByBinary(binary) {
  const allHexagrams = data.hexagrams
  const hexagramByBinary = allHexagrams.filter(hexagram => 
    hexagram.lines.toString() === binary.toString()
  )
  return hexagramByBinary[0]
}
