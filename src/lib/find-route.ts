import * as PF from "pathfinding"
import { findTwoPointGranularRoute } from "./find-two-point-granular-route"
import type { Point, Obstacle, Path, Grid, PathFindingResult } from "./types"
import { findTwoPointNearBiasRoute } from "./find-two-point-near-bias-route"

type Parameters = {
  pointsToConnect: Point[]
  obstacles: Obstacle[]
  grid: Grid
  allowDiagonal?: boolean
}

/**
 * Find a route between all the points.
 *
 * Internally, uses findTwoPointRoute. If two points are more than 2x distant
 * that the nearest point, then there is no need to compute a route between
 * them.
 */
export const findRoute = ({
  pointsToConnect,
  obstacles,
  grid,
  allowDiagonal,
}: Parameters): PathFindingResult => {
  // Sort the points to connect in ascending order of their distances
  pointsToConnect.sort((a, b) => {
    const distA = Math.sqrt(a.x ** 2 + a.y ** 2)
    const distB = Math.sqrt(b.x ** 2 + b.y ** 2)
    return distA - distB
  })

  let pathFound = false
  let points: Point[] = []
  let totalLength = 0

  // Iterate over each point
  for (let i = 0; i < pointsToConnect.length - 1; i++) {
    const pointA = pointsToConnect[i]
    const pointB = pointsToConnect[i + 1]

    // Find a route between the two points
    const pathResult: PathFindingResult = findTwoPointNearBiasRoute({
      pointsToConnect: [pointA, pointB],
      obstacles,
      grid,
      allowDiagonal,
    })

    if ("pathFound" in pathResult && pathResult.pathFound) {
      pathFound = true
      points = [...points, ...pathResult.points]
      totalLength += pathResult.length
    } else {
      return { pathFound: false }
    }
  }

  return pathFound
    ? { points, length: totalLength, width: 1, pathFound: true }
    : { pathFound: false }
}
