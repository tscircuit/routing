import { isInObstacle } from "./is-in-obstacle"
import { PathFindingParameters } from "./types"

export const movePointsOutsideObstacles = (
  params: PathFindingParameters,
  opts?: { margin: number }
): PathFindingParameters => {
  const { pointsToConnect, obstacles } = params
  const { margin = params.grid.segmentSize } = opts ?? {}

  const pointsToConnectOutsideObstacles = pointsToConnect.map((oldPoint) => {
    const newPoint = { ...oldPoint }

    for (const obstacle of obstacles) {
      if (isInObstacle({ point: newPoint, obstacles: [obstacle], margin })) {
        const { center, width, height } = obstacle

        let udx = Math.sign(newPoint.x - center.x)
        let udy = Math.sign(newPoint.y - center.y)

        if (udx === 0) udx = 1
        if (udy === 0) udy = 1

        const x_edge = center.x + (width / 2) * udx
        const y_edge = center.y + (height / 2) * udy

        const dx_edge = Math.abs(newPoint.x - x_edge)
        const dy_edge = Math.abs(newPoint.y - y_edge)

        const y_edge_is_closer = dy_edge < dx_edge

        if (y_edge_is_closer) {
          newPoint.y = y_edge + margin * udy
        } else {
          newPoint.x = x_edge + margin * udx
        }
        // TODO a point could still be in an obstacle at this point because we don't
        // check if the new point is in an obstacle, you could do this via recursion.
      }
    }
    return newPoint
  })

  return {
    ...params,
    pointsToConnect: pointsToConnectOutsideObstacles,
  }
}
