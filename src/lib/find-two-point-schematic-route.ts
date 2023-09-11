import { findTwoPointNearBiasRoute } from "./find-two-point-near-bias-route"
import { isIntersectingObstacle } from "./is-intersecting-obstacle"
import { removeUnnecessaryPoints } from "./remove-unnecessary-points"
import {
  Obstacle,
  PathFindingParameters,
  PathFindingResult,
  Point,
} from "./types"

const removeUnnecessaryTurns = ({
  points,
  obstacles,
}: {
  points: Point[]
  obstacles: Obstacle[]
}): Point[] => {
  if (points.length <= 3) return points

  const newPoints = [points[0], points[1]]

  // Walk the route, if there's an unnecessary turn, check that the route
  // doesn't hit an obstacle and move on
  for (let i = 1; i < points.length - 3; i++) {
    const P = newPoints[i - 1]

    const A = newPoints[i]
    const B = points[i + 1]
    const C = points[i + 2]

    // Are P -> A -> B all on the same line (the turn was changed?)

    if (P.x === A.x && A.x === B.x) {
      newPoints.push(B)
      continue
    }
    if (P.y === A.y && A.y === B.y) {
      newPoints.push(B)
      continue
    }

    const B_opt =
      A.x === B.x
        ? { x: C.x, y: A.y }
        : {
            x: A.x,
            y: C.y,
          }

    // The path to B_opt is more optimal because it has one less turn, but does
    // it hit any obstacles?

    const newPathPossible =
      !isIntersectingObstacle({
        obstacles,
        points: [A, B_opt],
      }) &&
      !isIntersectingObstacle({
        obstacles,
        points: [B_opt, C],
      })

    if (newPathPossible) {
      newPoints.push(B_opt)
    } else {
      newPoints.push(B)
    }
  }
  newPoints.push(...points.slice(-2))
  return newPoints
}

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
}: PathFindingParameters): PathFindingResult => {
  // TODO Omit grid- shouldn't be needed for schematic routes
  const route = findTwoPointNearBiasRoute({
    grid,
    obstacles,
    pointsToConnect,
    allowDiagonal: false,
  })

  if (!route.pathFound) return { pathFound: false }

  let currentBest = route.points
  while (true) {
    let newPoints = removeUnnecessaryTurns({ points: currentBest, obstacles })
    newPoints = removeUnnecessaryPoints(newPoints)

    if (newPoints.length === currentBest.length) {
      break
    } else {
      currentBest = newPoints
    }
  }

  return {
    ...route,
    points: currentBest,
  }
}
