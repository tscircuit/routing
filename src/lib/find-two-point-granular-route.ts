import * as PF from "pathfinding"
import type {
  Point,
  Obstacle,
  Path,
  Grid,
  PathFindingResult,
  PathFindingParameters,
} from "./types"

export const findTwoPointGranularRoute = ({
  pointsToConnect,
  obstacles,
  grid,
}: PathFindingParameters): PathFindingResult => {
  if (pointsToConnect.length !== 2)
    throw new Error("Must supply exactly 2 pointsToConnect")

  const [start, end] = pointsToConnect

  const roundToNearestGridPoint = (p: Point) => {
    return {
      x: Math.round(p.x / grid.segmentSize) * grid.segmentSize,
      y: Math.round(p.y / grid.segmentSize) * grid.segmentSize,
    }
  }

  const gridTopLeft = roundToNearestGridPoint({
    x: Math.min(start.x, end.x) - grid.segmentSize * grid.marginSegments,
    y: Math.min(start.y, end.y) - grid.segmentSize * grid.marginSegments,
  })
  const gridBottomRight = roundToNearestGridPoint({
    x: Math.max(start.x, end.x) + grid.segmentSize * grid.marginSegments,
    y: Math.max(start.y, end.y) + grid.segmentSize * grid.marginSegments,
  })
  const gridWidthSegments = Math.round(
    (gridBottomRight.x - gridTopLeft.x) / grid.segmentSize
  )
  const gridHeightSegments = Math.round(
    (gridBottomRight.y - gridTopLeft.y) / grid.segmentSize
  )

  const gridMatrix = new PF.Grid(gridWidthSegments, gridHeightSegments)

  const realToNodeSpace = (p: Point) => ({
    x: Math.round((p.x - gridTopLeft.x) / grid.segmentSize),
    y: Math.round((p.y - gridTopLeft.y) / grid.segmentSize),
  })

  const nodeToRealSpace = (p: Point) => ({
    x: p.x * grid.segmentSize + gridTopLeft.x,
    y: p.y * grid.segmentSize + gridTopLeft.y,
  })

  const startNode = realToNodeSpace(start)
  const endNode = realToNodeSpace(end)

  obstacles.forEach((obstacle) => {
    const left = Math.round(
      (obstacle.center.x - obstacle.width / 2 - gridTopLeft.x) /
        grid.segmentSize
    )
    const top = Math.round(
      (obstacle.center.y - obstacle.height / 2 - gridTopLeft.y) /
        grid.segmentSize
    )
    const width = Math.round(obstacle.width / grid.segmentSize)
    const height = Math.round(obstacle.height / grid.segmentSize)

    for (let x = left; x < left + width; x++) {
      for (let y = top; y < top + height; y++) {
        if (x < 0 || y < 0 || x >= gridWidthSegments || y >= gridHeightSegments)
          continue
        gridMatrix.setWalkableAt(x, y, false)
      }
    }
  })

  const finder = new PF.AStarFinder({
    diagonalMovement: PF.DiagonalMovement.OnlyWhenNoObstacles,
  })
  const path = finder.findPath(
    startNode.x,
    startNode.y,
    endNode.x,
    endNode.y,
    gridMatrix
  )

  // If a path can't be found, return an empty path
  if (path.length === 0) {
    return { pathFound: false }
  }

  const optimizedPath = PF.Util.compressPath(path)

  // Convert node space to real space
  const realPath = optimizedPath.map(([x, y]) => nodeToRealSpace({ x, y }))

  // Compute length of route
  const length = realPath.reduce((acc, p, i) => {
    if (i === 0) return acc
    const prev = realPath[i - 1]
    return acc + Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2)
  }, 0)

  return {
    pathFound: true,
    points: realPath,
    length,
    width: 1,
  }
}
