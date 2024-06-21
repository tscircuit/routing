import { findTwoPointNearBiasRoute } from "./find-two-point-near-bias-route"
import { createLogContextTree } from "./logging/log-context"
import { removeUnnecessaryPoints } from "./remove-unnecessary-points"
import { removeUnnecessaryTurns } from "./remove-unnecessary-turns"
import { PathFindingParameters, PathFindingResult } from "./types"

/**
 * Find a the optimal route between two points with as few unnecessary turns
 * as possible.
 *
 * We do this by finding solving for the route, then removing unnecessary turns.
 *
 * Note: This approach is inconsistent if you change the order of the points,
 *       the first point is used as the start point and turns are removed
 *       by analyzing each of it's next turns.
 * Note: This isn't guaranteed to be the optimal schematic route.
 */
export const findTwoPointSchematicRoute = ({
  grid,
  obstacles,
  pointsToConnect,
  log,
}: PathFindingParameters): PathFindingResult => {
  log ??= createLogContextTree()
  // TODO Omit grid- shouldn't be needed for schematic routes
  const route = findTwoPointNearBiasRoute({
    grid,
    obstacles,
    pointsToConnect,
    allowDiagonal: false,
    log,
  })

  if (!route.pathFound) return { pathFound: false }

  // Copy over directionBiases by finding
  // any original point with a direction bias, then adding the bias to the
  // nearest point on the path
  for (const pointToConnect of pointsToConnect) {
    if (!pointToConnect.directionBias) continue
    const nearestPoint = route.points.reduce(
      (nearest, point) => {
        const dist = Math.hypot(
          point.x - pointToConnect.x,
          point.y - pointToConnect.y
        )
        if (dist < nearest.dist) return { point, dist }
        return nearest
      },
      { point: route.points[0], dist: Infinity }
    ).point
    nearestPoint.directionBias = pointToConnect.directionBias
  }

  // Remove unnecessary turns (this makes it schematic-like)
  let currentBest = route.points
  const tr_log = log.child("Remove Unnecessary Turns")
  let iters = 0
  while (true) {
    iters++
    let newPoints = removeUnnecessaryTurns({
      points: currentBest,
      obstacles,
      // log: tr_log.child(`Remove Unnecessary Turns Iteration ${iters}`),
    })
    newPoints = removeUnnecessaryPoints(newPoints)

    if (newPoints.length === currentBest.length) {
      break
    } else {
      currentBest = newPoints
    }
  }
  tr_log.end()

  return {
    ...route,
    points: currentBest,
  }
}
