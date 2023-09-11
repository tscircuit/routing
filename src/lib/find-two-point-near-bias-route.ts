import { findBestBorderTargetPaths } from "./find-best-border-target-paths"
import { findTwoPointGranularRoute } from "./find-two-point-granular-route"
import type {
  FoundPath,
  PathFindingParameters,
  PathFindingResult,
} from "./types"

/**
 * Finds a route between two points, avoiding obstacles and using an approximate
 * wide-grid path-finding strategy between long distances
 */
export const findTwoPointNearBiasRoute = ({
  pointsToConnect,
  obstacles,
  grid,
  depth,
}: PathFindingParameters & { depth?: number }): PathFindingResult => {
  if (pointsToConnect.length !== 2)
    throw new Error("Must supply exactly 2 pointsToConnect")
  depth = depth ?? 0
  let [A, B] = pointsToConnect

  const remainingSegDist =
    Math.max(Math.abs(A.x - B.x), Math.abs(A.y - B.y)) / grid.segmentSize

  if (remainingSegDist <= grid.maxGranularSearchSegments) {
    return findTwoPointGranularRoute({
      pointsToConnect,
      obstacles,
      grid,
    })
  }

  if (depth > 3) return { pathFound: false, message: "Max depth reached" }

  const distanceToBorder = Math.min(
    grid.segmentSize * grid.maxGranularSearchSegments,
    (remainingSegDist / 2 - 3) * grid.segmentSize
  )

  const ABP = findBestBorderTargetPaths({
    point: A,
    obstacles,
    grid,
    distanceToBorder,
    distantTarget: B,
  })

  const BBP = findBestBorderTargetPaths({
    point: B,
    obstacles,
    grid,
    distanceToBorder,
    distantTarget: A,
  })

  // Go through every combination of A border points and B border points, and
  // select the best path
  const routes: FoundPath[] = []
  for (const abp of ABP) {
    for (const bbp of BBP) {
      const middleRoute = findTwoPointNearBiasRoute({
        pointsToConnect: [abp.borderTarget, bbp.borderTarget],
        obstacles,
        grid,
        depth: depth + 1,
      })
      if (middleRoute.pathFound === false) continue
      const fullRoute = {
        points: [
          ...abp.points,
          ...middleRoute.points,
          ...[...bbp.points].reverse(),
        ],
        // points: [...abp.points, ...middleRoute.points, ...bbp.points],
        length: abp.length + middleRoute.length + bbp.length,
        pathFound: true,
        width: abp.width,
      } as FoundPath
      routes.push(fullRoute)
    }
  }
  if (routes.length === 0) return { pathFound: false }

  // Return shortest route
  return routes.reduce((a, b) => (a.length < b.length ? a : b))
}
