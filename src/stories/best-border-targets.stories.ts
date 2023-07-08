import type { Meta, StoryObj } from "@storybook/react"

import { RouterBoard } from "../components/RouterBoard"
import { findTwoPointGranularRoute } from "../lib/find-two-point-granular-route"
import { Path, PathFindingResult } from "../lib/types"
import { findRoute } from "../lib/find-route"
import { findBestBorderTargetPaths } from "../lib/find-best-border-target-path"

const meta: Meta<typeof RouterBoard> = {
  title: "Routing/BestBorderTarget",
  component: RouterBoard,
  tags: [],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof RouterBoard>

const scenario = {
  A: { x: 10, y: 10 },
  distantTarget: { x: 80, y: 80 },
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
  ],
  grid: { segmentSize: 10, marginSegments: 3 },
}

const borderTargetPaths = findBestBorderTargetPaths({
  point: scenario.A,
  distantTarget: scenario.distantTarget,
  distanceToBorder: 50,
  grid: scenario.grid,
  obstacles: scenario.obstacles,
})

const throwIfNotFound = (path: PathFindingResult<any>): Path => {
  if (path.pathFound === false) {
    throw new Error("Path not found")
  } else {
    return path
  }
}

export const Primary: Story = {
  args: {
    ...scenario,
    points: [
      scenario.A,
      scenario.distantTarget,
      ...borderTargetPaths.map((p) => p.borderTarget),
    ],
    paths: borderTargetPaths,
    viewBox: {
      topLeftX: 0,
      topLeftY: 0,
      width: (8 / 5) * 100,
      height: 100,
    },
    width: 800,
    height: 500,
  },
}
