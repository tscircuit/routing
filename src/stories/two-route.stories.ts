import type { Meta, StoryObj } from "@storybook/react"

import { RouterBoard } from "../components/RouterBoard"
import { findTwoPointRoute } from "../lib/find-two-point-route"
import { Path } from "../lib/types"

const meta: Meta<typeof RouterBoard> = {
  title: "Routing/SimpleTwoRoute",
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
  ],
  obstacles: [
    {
      center: { x: 80, y: 60 },
      width: 40,
      height: 10,
    },
    {
      center: { x: 70, y: 70 },
      width: 15,
      height: 15,
    },
  ],
  grid: { segmentSize: 10, marginSegments: 1 },
}

const ignoreIfNotFound = (path: Path | { pathFound: false }): Path =>
  path as any

export const Primary: Story = {
  args: {
    ...scenario,
    paths: [
      ignoreIfNotFound(
        findTwoPointRoute({ ...scenario, pointsToConnect: scenario.points })
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
