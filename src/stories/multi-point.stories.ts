import type { Meta, StoryObj } from "@storybook/react"

import { RouterBoard } from "../components/RouterBoard"
import { findTwoPointRoute } from "../lib/find-two-point-route"
import { Path, PathFindingResult } from "../lib/types"
import { findRoute } from "../lib/find-route"

const meta: Meta<typeof RouterBoard> = {
  title: "Routing/MultiPointRoutes",
  component: RouterBoard,
  tags: [],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof RouterBoard>

const scenario = {
  points: [
    { x: 10, y: 10 },
    { x: 80, y: 80 },
    { x: 110, y: 20 },
  ],
  obstacles: [
    {
      center: { x: 80, y: 60 },
      width: 35,
      height: 10,
    },
    {
      center: { x: 70, y: 70 },
      width: 15,
      height: 15,
    },
    {
      center: { x: 40, y: 30 },
      width: 15,
      height: 35,
    },
    {
      center: { x: 70, y: 10 },
      width: 15,
      height: 55,
    },
  ],
  grid: { segmentSize: 10, marginSegments: 3 },
}

const throwIfNotFound = (path: PathFindingResult): Path => {
  if (path.pathFound === false) {
    throw new Error("Path not found")
  } else {
    return path
  }
}

export const Primary: Story = {
  args: {
    ...scenario,
    paths: [
      throwIfNotFound(
        findRoute({ ...scenario, pointsToConnect: scenario.points })
      ),
    ],
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
