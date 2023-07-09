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
export const findTwoPointRoute = ({
  pointsToConnect,
  obstacles,
  grid,
}: PathFindingParameters): PathFindingResult => {
  return findTwoPointGranularRoute({ pointsToConnect, obstacles, grid })
}
