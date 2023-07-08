import * as PF from "pathfinding"

type Obstacle = {
  center: { x: number; y: number }
  width: number
  height: number
}

type Point = { x: number; y: number }

type Path = {
  points: Array<{ x: number; y: number }>
  width: number
}

type Parameters = {
  pointsToConnect: Point[]
  obstacles: Obstacle[]
  grid: {
    /**
     * The segmentSize is the smallest distance between two adjacent paths, or
     * between an obstacle and a path. When path-finding, this is the width and
     * height of a single grid square.
     */
    segmentSize: number
    /**
     * The grid region is formed based on the pointsToConnect and the margin.
     * The margin is the buffer or extra space outside of the region formed by
     * pointsToConnect that is still part of the grid region. This is typically
     * set to 1 or 2
     */
    marginSegments: number
  }
}

export const findTwoPointRoute = ({
  pointsToConnect,
  obstacles,
  grid,
}: Parameters): (Path & { pathFound: true }) | { pathFound: false } => {
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

  // const finder = new PF.BestFirstFinder()
  const finder = new PF.AStarFinder({
    diagonalMovement: PF.DiagonalMovement.Always,
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

  // Convert node space to real space
  const realPath = path.map(([x, y]) => nodeToRealSpace({ x, y }))

  return {
    pathFound: true,
    points: realPath,
    width: 1,
  }
}
