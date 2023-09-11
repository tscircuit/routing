import { computeGridTransform } from "./compute-grid-transform"
import { findTwoPointGranularRoute } from "./find-two-point-granular-route"
import { getPointDistance } from "./get-point-distance"
import type {
  Point,
  PathFindingResult,
  PathFindingParameters,
  FoundPath,
} from "./types"

const MULTIPLES = [16, 8, 4, 3, 2, 1]

export const findTwoPointMixedGranularityRoute = ({
  pointsToConnect,
  obstacles,
  grid,
  allowDiagonal,
}: PathFindingParameters): PathFindingResult => {
  if (pointsToConnect.length !== 2)
    throw new Error("Must supply exactly 2 pointsToConnect")

  const [start, end] = pointsToConnect
  const maxDist = Math.max(Math.abs(start.x - end.x), Math.abs(start.y - end.y))

  for (const multiple of MULTIPLES) {
    // HACK: when the grid step is big, it can lead to "overshooting" the points
    if (grid.segmentSize * multiple > maxDist / 4) continue

    const { transformedGrid } = computeGridTransform({ grid, multiple })
    const result = findTwoPointGranularRoute({
      pointsToConnect: [start, end],
      obstacles,
      grid: transformedGrid,
    })
    if (result.pathFound && multiple !== 1) {
      const startMiddle = result.points[1]
      const startPath = findTwoPointGranularRoute({
        pointsToConnect: [start, startMiddle],
        obstacles,
        grid,
        allowDiagonal,
      })
      const middleEnd = result.points[result.points.length - 2]
      const endPath = findTwoPointGranularRoute({
        pointsToConnect: [middleEnd, end],
        obstacles,
        grid,
        allowDiagonal,
      })
      if (startPath.pathFound && endPath.pathFound) {
        return {
          pathFound: true,
          points: [
            ...startPath.points,
            ...result.points.slice(1, -1),
            ...endPath.points,
          ],
          // TODO result.length needs to be computed for slice
          length:
            startPath.length +
            result.length -
            getPointDistance(result.points[0], result.points[1]) -
            getPointDistance(...(result.points.slice(-2) as [Point, Point])) +
            endPath.length,
          width: startPath.width,
        } as FoundPath
      }
    }

    if (multiple === 1) return result
  }
  throw new Error("unreachable")
}
