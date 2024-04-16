import * as PF from "pathfinding"
import bs58 from "bs58"

export const encodeDebugGridString = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  grid: PF.Grid
): string => {
  const binary = []
  const header = []

  header.push(startX)
  header.push(startY)
  header.push(endX)
  header.push(endY)
  header.push(grid.width)
  header.push(grid.height)

  // Encode grid walkability information
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      // Pathfinding.Grid.isWalkableAt returns true if the node is walkable
      binary.push(grid.isWalkableAt(x, y) ? 1 : 0)
    }
  }

  const binaryString = binary.join("")
  const stringBytes = binaryString.match(/.{8}/g)
  const numBytes = stringBytes.map((s) => Number.parseInt(s, 2))
  const buffer = Uint8Array.from(numBytes)
  const encoding = header.join("_") + "_" + bs58.encode(buffer)
  return encoding
}

// Example usage
// const grid = new PF.Grid(5, 5)
// const encodedString = encodeDebugGridString(0, 0, 4, 4, grid)
// console.log(encodedString)
