import type { Obstacle, Point } from "./types"

/**
 * Determine if a line is intersecting an obstacle
 */
export const isIntersectingObstacle = ({
  x1,
  x2,
  y1,
  y2,
  obstacles,
  margin = 0,
}: {
  x1: number
  x2: number
  y1: number
  y2: number
  obstacles: Obstacle[]
  margin?: number
}): boolean => {
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
