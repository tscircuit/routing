import * as PF from "pathfinding"
import type { Point, Obstacle, Path, Grid, PathFindingResult } from "./types"
import { findTwoPointSchematicRoute } from "./find-two-point-schematic-route"
import { LogContextTree, createLogContextTree } from "./logging/log-context"

type Parameters = {
  pointsToConnect: Point[]
  obstacles: Obstacle[]
  grid: Grid
  allowDiagonal?: boolean
  log?: LogContextTree
}

/**
 * Find a schematic route between all the points.
 *
 * Internally, uses findTwoPointSchematicRoute. If two points are more than 2x distant
 * that the nearest point, then there is no need to compute a route between
 * them.
 */
export const findSchematicRoute = ({
  pointsToConnect,
  obstacles,
  grid,
  log,
}: Parameters): PathFindingResult => {
  log ??= createLogContextTree()

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
  const ps_log = log.child(`${pointsToConnect.length} A->B Path Search`)
  for (let i = 0; i < pointsToConnect.length - 1; i++) {
    const pointA = pointsToConnect[i]
    const pointB = pointsToConnect[i + 1]

    // Find a route between the two points
    const pathResult: PathFindingResult = findTwoPointSchematicRoute({
      pointsToConnect: [pointA, pointB],
      obstacles,
      grid,
      allowDiagonal: false,
      log: ps_log,
    })

    if ("pathFound" in pathResult && pathResult.pathFound) {
      pathFound = true
      points = [...points, ...pathResult.points]
      totalLength += pathResult.length
    } else {
      return { pathFound: false }
    }
  }
  ps_log.end()
  log.end()

  return pathFound
    ? { points, length: totalLength, width: 1, pathFound: true }
    : { pathFound: false }
}
