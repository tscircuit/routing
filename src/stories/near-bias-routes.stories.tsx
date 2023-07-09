import type { Meta, StoryObj } from "@storybook/react"

import { RouterBoard } from "../components/RouterBoard"
import { findTwoPointGranularRoute } from "../lib/find-two-point-granular-route"
import { Grid, Path, PathFindingResult, Point } from "../lib/types"
import { findRoute } from "../lib/find-route"
import { findBestBorderTargetPaths } from "../lib/find-best-border-target-paths"
import { findTwoPointNearBiasRoute } from "../lib/find-two-point-near-bias-route"

const throwIfNotFound = (path: PathFindingResult<any>): Path => {
  if (path.pathFound === false) {
    throw new Error("Path not found")
  } else {
    return path
  }
}

const NearBiasRoute = ({ A, B }: { A: Point; B: Point }) => {
  const scenario = {
    points: [A, B],
    obstacles: [
      {
        center: { x: 80, y: 60 },
        width: 66,
        height: 30,
      },
      {
        center: { x: 40, y: 30 },
        width: 15,
        height: 35,
      },
      {
        center: { x: 80, y: 10 },
        width: 15,
        height: 80,
      },
      {
        center: { x: 10, y: 50 },
        width: 10,
        height: 30,
      },
    ],
    grid: {
      segmentSize: 4,
      marginSegments: 3,
      maxGranularSearchSegments: 10,
    } as Grid,
    viewBox: {
      topLeftX: 0,
      topLeftY: 0,
      width: (8 / 5) * 100,
      height: 100,
    },
    width: 800,
    height: 500,
  }

  const route = throwIfNotFound(
    findTwoPointNearBiasRoute({
      pointsToConnect: [A, B],
      obstacles: scenario.obstacles,
      grid: scenario.grid,
    })
  )

  const btA = findBestBorderTargetPaths({
    point: A,
    distantTarget: B,
    distanceToBorder: 40,
    grid: scenario.grid,
    obstacles: scenario.obstacles,
  })

  const btB = findBestBorderTargetPaths({
    point: B,
    distantTarget: A,
    distanceToBorder: 40,
    grid: scenario.grid,
    obstacles: scenario.obstacles,
  })

  return (
    <>
      <RouterBoard {...scenario} paths={[route]} />
      <h2>Initial Border Points</h2>
      <RouterBoard {...scenario} paths={btA} />
      <RouterBoard {...scenario} paths={btB} />
    </>
  )
}

const meta: Meta<typeof RouterBoard> = {
  title: "Routing/NearBiasRoutes",
  component: NearBiasRoute as any,
  tags: [],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof NearBiasRoute>

export const MultipleSearchPaths: Story = {
  args: {
    A: { x: 10, y: 10 },
    B: { x: 120, y: 80 },
  },
}

export const Smoothing: Story = {
  args: {
    A: { x: 10, y: 10 },
    B: { x: 50, y: 80 },
  },
}
