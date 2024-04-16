import { computeGridTransform } from "./compute-grid-transform"
import { findTwoPointGranularRoute } from "./find-two-point-granular-route"
import { getPointDistance } from "./get-point-distance"
import { createLogContextTree } from "./logging/log-context"
import type {
  Point,
  PathFindingResult,
  PathFindingParameters,
  FoundPath,
} from "./types"

// const MULTIPLES = [20, 10, 5, 2, 1]
const MULTIPLES = [1, 2, 5, 10, 20]

export const findTwoPointMixedGranularityRoute = ({
  pointsToConnect,
  obstacles,
  grid,
  allowDiagonal,
  log,
}: PathFindingParameters): PathFindingResult => {
  log ??= createLogContextTree()
  if (pointsToConnect.length !== 2)
    throw new Error("Must supply exactly 2 pointsToConnect")

  const [start, end] = pointsToConnect
  const maxDist = Math.max(Math.abs(start.x - end.x), Math.abs(start.y - end.y))

  for (const multiple of MULTIPLES) {
    // HACK: when the grid step is big, it can lead to "overshooting" the points
    if (grid.segmentSize * multiple > maxDist / 4) continue

    // We should never exceed the maxGranularSearchSegments
    const remainingSegDist =
      Math.max(Math.abs(start.x - end.x), Math.abs(start.y - end.y)) /
      (grid.segmentSize * multiple)

    if (remainingSegDist > grid.maxGranularSearchSegments) continue

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
        // TODO If a route is found at a higher multiple, we still need to
        // connect the beginning and end points at the original granularity
        log.end()
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

    if (multiple === 1) {
      log.end()
      return result
    }
  }

  log.info.not_found = true
  log.end()
  return { pathFound: false }
}
