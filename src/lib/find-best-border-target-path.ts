import { computeGridTransform } from "./compute-grid-transform"
import { findTwoPointGranularRoute } from "./find-two-point-granular-route"
import { isInObstacle } from "./is-in-obstacle"
import type {
  FoundPath,
  Grid,
  Obstacle,
  PathFindingParameters,
  PathFindingResult,
  Point,
} from "./types"

/**
 * Find the best border targets for a given point, avoid obstacles. The best
 * border targets are points along the border of the grid that is closest to the
 * distantTarget. Optimized to automatically de-dupe contiguous points (border
 * points with no obstacles between them)
 *
 * Ascii square showing the best border target for a distant target:
 * A = Point 1, B = Point 2, X = Best border target
 *
 *      ##########
 *      #        #
 *      # A      #
 *      #        #
 *      #        X              B
 *      ##########
 *
 */
export const findBestBorderTargetPaths = ({
  point,
  obstacles,
  grid,
  distantTarget,
  distanceToBorder,
}: {
  grid: Grid
  obstacles: Obstacle[]
  point: Point
  distantTarget: Point
  distanceToBorder: number
}): Array<FoundPath<{ borderTarget: Point }>> => {
  const { roundToNearestGridPoint } = computeGridTransform({ grid })

  const borderPoints: Array<{ x: number; y: number; targetDistance: number }> =
    []
  const borderSideLength = distanceToBorder * 2
  for (const [xs, ys, xd, yd] of [
    [-1, -1, 1, 0],
    [1, -1, 0, 1],
    [1, 1, -1, 0],
    [-1, 1, 0, -1],
  ]) {
    for (let d = 0; d < borderSideLength; d += grid.segmentSize) {
      const bp = roundToNearestGridPoint({
        x: point.x + xs * distanceToBorder + xd * d,
        y: point.y + ys * distanceToBorder + yd * d,
      })
      if (isInObstacle({ point: bp, obstacles })) {
        continue
      }
      borderPoints.push({
        ...bp,
        targetDistance: Math.sqrt(
          (bp.x - distantTarget.x) ** 2 + (bp.y - distantTarget.y) ** 2
        ),
      })
    }
  }

  // De-dupe border points that are contiguous
  const contiguousBorderPoints: Array<typeof borderPoints> = [[borderPoints[0]]]
  for (let i = 1; i < borderPoints.length; i++) {
    const A = borderPoints[i - 1]
    const B = borderPoints[i]

    // TODO this could be optimized since the distance between these points
    // is generally one grid segment
    const result = findTwoPointGranularRoute({
      pointsToConnect: [A, B],
      grid,
      obstacles,
    })

    if (result.pathFound === true && result.length < grid.segmentSize * 2) {
      contiguousBorderPoints[contiguousBorderPoints.length - 1].push(B)
    } else {
      contiguousBorderPoints.push([B])
    }
  }

  // Combine the first and last segment if they're connected (currently
  // there's always an extra segment at the end)
  // const lastSegment = contiguousBorderPoints[contiguousBorderPoints.length - 1]
  // const joinResult = findTwoPointGranularRoute({
  //   pointsToConnect: [
  //     contiguousBorderPoints[0][0],
  //     lastSegment[lastSegment.length - 1],
  //   ],
  //   grid,
  //   obstacles,
  // })
  // if (
  //   joinResult.pathFound === true &&
  //   joinResult.length < grid.segmentSize * 2
  // ) {
  //   contiguousBorderPoints[0].push(
  //     ...(contiguousBorderPoints.pop() as typeof borderPoints)
  //   )
  // }

  // Find the closest borderPoint of each contiguous set
  const closestBorderPoints = contiguousBorderPoints.map((borderPoints) => {
    return borderPoints.reduce(
      (closest, borderPoint) => {
        return borderPoint.targetDistance < closest.targetDistance
          ? borderPoint
          : closest
      },
      { x: 0, y: 0, targetDistance: Infinity }
    )
  })
  console.log("closestBorderPoints", closestBorderPoints)

  // // Order the borderPoints by their distance to the distantTarget
  // borderPoints.sort((a, b) => a.targetDistance - b.targetDistance)

  // First borderPoint with a path to the distantTarget is the best borderPoint
  const resultPaths: Array<FoundPath<{ borderTarget: Point }>> = []
  for (const borderPoint of closestBorderPoints) {
    const result = findTwoPointGranularRoute({
      pointsToConnect: [point, borderPoint],
      obstacles,
      grid,
    })
    if (result.pathFound === true) {
      resultPaths.push({
        ...result,
        borderTarget: borderPoint,
      })
    }
  }
  console.log("resultPaths", resultPaths)
  return resultPaths
}
