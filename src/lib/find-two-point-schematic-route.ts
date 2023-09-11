import { findTwoPointNearBiasRoute } from "./find-two-point-near-bias-route"
import { PathFindingParameters } from "./types"

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
}: PathFindingParameters) => {
  // TODO Omit grid- shouldn't be needed for schematic routes
  const route = findTwoPointNearBiasRoute({
    grid,
    obstacles,
    pointsToConnect,
    allowDiagonal: false,
  })

  if (!route.pathFound) return { pathFound: false }

  const newPoints = [route.points[0]]

  // Walk the route, if there's an unnecessary turn, check that the route
  // doesn't hit an obstacle and move on
  for (let i = 0; i < route.points.length - 3; i++) {
    const A = route.points[i]
    const B = route.points[i + 1]
    const C = route.points[i + 2]

    // If A and C are on the same axis, we can remove B
    if (A.x === C.x || A.y === C.y) {
      // Check that the route doesn't hit an obstacle
      // TODO Since it's a straight-line path, it should be faster to compute
      // without doing pathfinding
      if (
        !findTwoPointNearBiasRoute({
          grid,
          obstacles,
          pointsToConnect: [A, C],
          allowDiagonal: false,
        }).pathFound
      ) {
        newPoints.push(C)
        i++
      }
    } else {
      newPoints.push(B)
    }
  }
  newPoints.push(...route.points.slice(-2))

  return {
    ...route,
    points: newPoints,
  }
}
