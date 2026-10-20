import { isInObstacle } from "./is-in-obstacle"
import { Obstacle, PathFindingParameters } from "./types"

export const shrinkObstacles = <
  T extends PathFindingParameters = PathFindingParameters
>(
  params: T,
  opts?: { margin?: number }
): T => {
  const { pointsToConnect, obstacles } = params
  const { margin = params.grid.segmentSize } = opts ?? {}

  const shrunkObstacles = obstacles
    .map((oldObstacle): Obstacle | null => {
      let left = oldObstacle.center.x - oldObstacle.width / 2
      let right = oldObstacle.center.x + oldObstacle.width / 2
      let bottom = oldObstacle.center.y - oldObstacle.height / 2
      let top = oldObstacle.center.y + oldObstacle.height / 2

      for (const point of pointsToConnect) {
        const currentWidth = right - left
        const currentHeight = top - bottom
        if (currentWidth <= 0 || currentHeight <= 0) break

        const currentObstacle: Obstacle = {
          center: {
            x: (left + right) / 2,
            y: (bottom + top) / 2,
          },
          width: currentWidth,
          height: currentHeight,
        }

        if (isInObstacle({ point, obstacles: [currentObstacle], margin })) {
          const { center, width, height } = currentObstacle

          let udx = Math.sign(point.x - center.x)
          let udy = Math.sign(point.y - center.y)

          if (udx === 0) udx = 1
          if (udy === 0) udy = 1

          const x_edge = center.x + (width / 2) * udx
          const y_edge = center.y + (height / 2) * udy

          const dx_edge = Math.abs(point.x - x_edge)
          const dy_edge = Math.abs(point.y - y_edge)

          const y_edge_is_closer = dy_edge < dx_edge

          if (y_edge_is_closer) {
            if (udy > 0) {
              top = Math.min(top, point.y - margin)
            } else {
              bottom = Math.max(bottom, point.y + margin)
            }
          } else {
            if (udx > 0) {
              right = Math.min(right, point.x - margin)
            } else {
              left = Math.max(left, point.x + margin)
            }
          }
        }
      }

      const newWidth = Math.max(0, right - left)
      const newHeight = Math.max(0, top - bottom)

      return {
        ...oldObstacle,
        center: {
          x: (left + right) / 2,
          y: (bottom + top) / 2,
        },
        width: newWidth,
        height: newHeight,
      }
    })
    .filter(
      (obstacle): obstacle is Obstacle =>
        obstacle !== null && obstacle.width > 0 && obstacle.height > 0
    )

  return {
    ...params,
    obstacles: shrunkObstacles,
  }
}
