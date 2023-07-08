import { Grid, Point } from "./types"

type Parameters = {
  grid: Grid
  gridTopLeft?: Point
}
export const computeGridTransform = ({
  grid,
  gridTopLeft = { x: 0, y: 0 },
}: Parameters) => {
  const roundToNearestGridPoint = (p: Point) => {
    return {
      x: Math.round(p.x / grid.segmentSize) * grid.segmentSize,
      y: Math.round(p.y / grid.segmentSize) * grid.segmentSize,
    }
  }
  const realToNodeSpace = (p: Point) => ({
    x: Math.round((p.x - gridTopLeft.x) / grid.segmentSize),
    y: Math.round((p.y - gridTopLeft.y) / grid.segmentSize),
  })

  const nodeToRealSpace = (p: Point) => ({
    x: p.x * grid.segmentSize + gridTopLeft.x,
    y: p.y * grid.segmentSize + gridTopLeft.y,
  })

  return { roundToNearestGridPoint, realToNodeSpace, nodeToRealSpace }
}
