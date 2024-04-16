import * as PF from "pathfinding"
import bs58 from "bs58"

export const decodeDebugGridString = (
  encodedString: string
): {
  startX: number
  startY: number
  endX: number
  endY: number
  grid: PF.Grid
} => {
  const parts = encodedString.split("_")
  const header = parts.slice(0, 6).map(Number)
  const encodedData = parts[6]

  const [startX, startY, endX, endY, width, height] = header

  const decodedBuffer = bs58.decode(encodedData)
  const binaryString = Array.from(decodedBuffer)
    .map((byte) => byte.toString(2).padStart(8, "0")) // Ensure each byte is 8 bits
    .join("")

  const grid = new PF.Grid(width, height)

  let index = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isWalkable = binaryString[index] === "1"
      grid.setWalkableAt(x, y, isWalkable)
      index++
    }
  }

  return {
    startX,
    startY,
    endX,
    endY,
    grid,
  }
}

// Example usage
// const encodedString = "0_0_4_4_5_5_2UzHL" // Example encoded string
// const decoded = decodeDebugGridString(encodedString)
// console.log(decoded)
