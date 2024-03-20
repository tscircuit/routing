import type { Obstacle, Point } from "./types"

type Parameters =
  | {
      x1: number
      x2: number
      y1: number
      y2: number
      obstacles: Obstacle[]
      margin?: number
    }
  | {
      points: Point[]
      obstacles: Obstacle[]
      margin?: number
    }

/**
 * Determine if a line is intersecting an obstacle
 */
export const isIntersectingObstacle = (params: Parameters): boolean => {
  const { obstacles, margin = 0 } = params

  let { x1, x2, y1, y2, points } = params as any

  const clipLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    left: number,
    right: number,
    bottom: number,
    top: number
  ): boolean => {
    let u1 = 0,
      u2 = 1,
      dx = x2 - x1,
      dy = y2 - y1

    const p = [-dx, dx, -dy, dy]
    const q = [x1 - left, right - x1, y1 - bottom, top - y1]

    for (let i = 0; i < 4; i++) {
      if (p[i] === 0) {
        if (q[i] < 0) return false
      } else {
        const u = q[i] / p[i]
        if (p[i] < 0 && u1 < u) u1 = u
        else if (p[i] > 0 && u2 > u) u2 = u
      }
    }

    return u1 <= u2
  }

  if (points?.length > 2) {
    return (
      isIntersectingObstacle({
        points: points.slice(0, 2),
        obstacles,
        margin,
      }) &&
      isIntersectingObstacle({
        points: points.slice(1),
        obstacles,
        margin,
      })
    )
  }

  if (points) {
    x1 = points[0].x
    x2 = points[1].x
    y1 = points[0].y
    y2 = points[1].y
  }

  for (const obstacle of obstacles) {
    const leftEdge = obstacle.center.x - obstacle.width / 2 - margin
    const rightEdge = obstacle.center.x + obstacle.width / 2 + margin
    const bottomEdge = obstacle.center.y - obstacle.height / 2 - margin
    const topEdge = obstacle.center.y + obstacle.height / 2 + margin

    if (clipLine(x1, y1, x2, y2, leftEdge, rightEdge, bottomEdge, topEdge)) {
      return true
    }
  }

  return false
}
