import { LogContextTree } from "./logging/log-context"

export type Obstacle = {
  center: { x: number; y: number }
  width: number
  height: number
}

export type Point = {
  x: number
  y: number
  directionBias?: "up" | "down" | "left" | "right"
}

export type Path = {
  points: Array<Point>
  width: number
}

export type Grid = {
  /**
   * The segmentSize is the smallest distance between two adjacent paths, or
   * between an obstacle and a path. When path-finding, this is the width and
   * height of a single grid square.
   */
  segmentSize: number
  /**
   * The grid region is formed based on the pointsToConnect and the margin.
   * The margin is the buffer or extra space outside of the region formed by
   * pointsToConnect that is still part of the grid region. This is typically
   * set to 1 or 2
   */
  marginSegments: number

  /**
   * Maximum segments allowed in a square search. Typically 100. The square of
   * this is the size of the search matrix. Increase this will yield better
   * paths, but will decrease performance.
   */
  maxGranularSearchSegments: number
}

export type PathFindingParameters = {
  pointsToConnect: readonly Point[]
  obstacles: Obstacle[]
  grid: Grid
  allowDiagonal?: boolean
  log?: LogContextTree
}

export type FoundPath = Path & {
  length: number
  pathFound: true
}

export type PathFindingResult =
  | FoundPath
  | { pathFound: false; message?: string }
