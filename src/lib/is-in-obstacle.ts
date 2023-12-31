import type { Obstacle, Point } from "./types"

type Parameters = {
  point: Point
  obstacles: Obstacle[]
  margin?: number
}
export const isInObstacle = ({
  point,
  obstacles,
  margin = 0,
}: Parameters): boolean => {
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i]

    const leftEdge = obstacle.center.x - obstacle.width / 2 - margin
    const rightEdge = obstacle.center.x + obstacle.width / 2 + margin
    const bottomEdge = obstacle.center.y - obstacle.height / 2 - margin
    const topEdge = obstacle.center.y + obstacle.height / 2 + margin

    if (
      point.x >= leftEdge &&
      point.x <= rightEdge &&
      point.y >= bottomEdge &&
      point.y <= topEdge
    ) {
      return true
    }
  }

  // If the point is not within any obstacles
  return false
}
