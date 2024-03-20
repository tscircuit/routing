import { findBestBorderTargetPaths } from "./find-best-border-target-paths"
import { findTwoPointGranularRoute } from "./find-two-point-granular-route"
import { createLogContextTree } from "./logging/log-context"
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
  allowDiagonal,
  depth,
  log,
}: PathFindingParameters & { depth?: number }): PathFindingResult => {
  log ??= createLogContextTree()
  if (pointsToConnect.length !== 2)
    throw new Error("Must supply exactly 2 pointsToConnect")
  depth = depth ?? 0
  let [A, B] = pointsToConnect

  const remainingSegDist =
    Math.max(Math.abs(A.x - B.x), Math.abs(A.y - B.y)) / grid.segmentSize

  if (remainingSegDist <= grid.maxGranularSearchSegments) {
    const granRoute = findTwoPointGranularRoute({
      pointsToConnect,
      obstacles,
      grid,
      allowDiagonal,
      log: log.child("2P Granular Route"),
    })
    log.end()
    return granRoute
  }

  if (depth > 3) {
    log.info.max_depth = true
    log.end()
    return { pathFound: false, message: "Max depth reached" }
  }

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
    allowDiagonal,
    log: log.child("Border Target Paths A"),
  })

  const BBP = findBestBorderTargetPaths({
    point: B,
    obstacles,
    grid,
    distanceToBorder,
    distantTarget: A,
    allowDiagonal,
    log: log.child("Border Target Paths B"),
  })

  // Go through every combination of A border points and B border points, and
  // select the best path
  const routes: FoundPath[] = []
  const bp_log = log.child(
    `Border Target Matrix Search ${ABP.length * BBP.length}`
  )
  for (let abpi = 0; abpi < ABP.length; abpi++) {
    const abp = ABP[abpi]
    for (let bbpi = 0; bbpi < BBP.length; bbpi++) {
      const bbp = BBP[bbpi]
      const middleRoute = findTwoPointNearBiasRoute({
        pointsToConnect: [abp.borderTarget, bbp.borderTarget],
        obstacles,
        grid,
        depth: depth + 1,
        allowDiagonal,
        log: bp_log.child(
          `Middle Route ${abpi + 1}x${bbpi + 1}/${ABP.length}x${BBP.length}`
        ),
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
  bp_log.end()
  if (routes.length === 0) {
    log.info.no_routes = true
    log.end()
    return { pathFound: false }
  }

  log.end()
  // Return shortest route
  return routes.reduce((a, b) => (a.length < b.length ? a : b))
}
