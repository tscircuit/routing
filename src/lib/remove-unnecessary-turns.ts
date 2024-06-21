import { isIntersectingObstacle } from "./is-intersecting-obstacle"
import { LogContextTree, createLogContextTree } from "./logging/log-context"
import { Obstacle, Point } from "./types"

/**
 * Return true if the second point is aligned with the direction bias of the
 * first point.
 */
export const isAlignedWithDirectionBias = (A: Point, B: Point) => {
  if (A.directionBias === "right") return B.x > A.x
  if (A.directionBias === "left") return B.x < A.x
  if (A.directionBias === "up") return B.y > A.y
  if (A.directionBias === "down") return B.y < A.y
  return true
}

/**
 * Return a middle point that is flipped over the axis created by the first and
 * last points. See diagram below:
 *
 * A -> B
 *      |
 *      C
 *
 * The alternate middle segment (B') is the following:
 *
 * A
 * |
 * B' -> C
 *
 */
export const getFlippedMiddlePoint = (A: Point, B: Point, C: Point) =>
  A.x === B.x
    ? { x: C.x, y: A.y }
    : {
        x: A.x,
        y: C.y,
      }

export const removeUnnecessaryTurns = ({
  points,
  obstacles,
  log,
}: {
  points: Point[]
  obstacles: Obstacle[]
  log?: LogContextTree
}): Point[] => {
  log ??= createLogContextTree()
  if (points.length <= 3) {
    log.end()
    return points
  }

  let newPoints = [points[0], points[1]]

  // Before we get started, we should attempt to incorporate the directionBias
  // of the first point in the route by flipping the second point if it's not
  // aligned with the bias (and it's possible to flip it)
  if (points[0].directionBias) {
    const [A, B, C] = points
    // Check if the second point is along the axis of the bias, if it is, don't
    // do anything
    if (!isAlignedWithDirectionBias(A, B)) {
      // Try to replace the second point with a "flipped" version that goes in
      // along the opposite axis.
      const flipped2ndPoint = getFlippedMiddlePoint(A, B, C)

      if (
        isAlignedWithDirectionBias(A, flipped2ndPoint) &&
        !isIntersectingObstacle({ obstacles, points: [A, flipped2ndPoint] })
      ) {
        newPoints = [A, flipped2ndPoint]
      }
    }
  }

  // Alter the last two points to incorporate the directionBias of the last point
  if (points[points.length - 1].directionBias) {
    const [A, B, C] = points.slice(-3)
    if (!isAlignedWithDirectionBias(C, B)) {
      const flipped2ndLastPoint = getFlippedMiddlePoint(A, B, C)
      if (
        isAlignedWithDirectionBias(C, flipped2ndLastPoint) &&
        !isIntersectingObstacle({ obstacles, points: [flipped2ndLastPoint, C] })
      ) {
        points[points.length - 2] = flipped2ndLastPoint
      }
    }
  }

  // Walk the route, if there's an unnecessary turn, check that the route
  // doesn't hit an obstacle and move on
  /**
   * Ascii visual to help with each iteration:
   *
   * P -> A
   *      |
   *      B -> C
   *
   * We compute B_opt by looking at the axis of A -> B
   *
   * P -> A -> B_opt
   *      |    |
   *      B -> C
   *
   * Then we check that the new path is possible by checking for any
   * obstacles between A -> B_opt and B_opt -> C
   *
   * If it is possible, we replace B with B_opt
   *
   */

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

    const B_opt = getFlippedMiddlePoint(A, B, C)

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
  log.end()
  return newPoints
}
