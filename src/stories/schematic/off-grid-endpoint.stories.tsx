import type { Meta, StoryObj } from "@storybook/react"

import { RouterBoard } from "../../components/RouterBoard"
import { findTwoPointGranularRoute } from "../../lib/find-two-point-granular-route"
import { Grid, Path, PathFindingResult } from "../../lib/types"
import { findTwoPointMixedGranularityRoute } from "../../lib/find-two-point-mixed-granularity-route"
import { findTwoPointSchematicRoute } from "../../lib/find-two-point-schematic-route"
import { findTwoPointNearBiasRoute } from "../../lib"
import { createLogContextTree } from "../../lib/logging/log-context"

const meta: Meta<typeof RouterBoard> = {
  title: "Schematic Routing/OffGridEndpoint",
  component: RouterBoard,
  tags: [],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof RouterBoard>

const throwIfNotFound = (path: PathFindingResult): Path => {
  if (path.pathFound === false) {
    throw new Error("Path not found")
  } else {
    return path
  }
}

export const Primary = () => {
  const scenario = {
    points: [
      { x: 10, y: 50 },
      { x: 130, y: 70 },
    ],
    obstacles: [
      {
        center: { x: 50, y: 80 },
        width: 35,
        height: 80,
      },
      {
        center: { x: 140, y: 30 },
        width: 50,
        height: 15,
      },
    ],
    grid: {
      segmentSize: 5,
      marginSegments: 1,
      maxGranularSearchSegments: 200,
    } as Grid,
  }
  const log = createLogContextTree({ loudEnd: true, verbose: false })
  return (
    <RouterBoard
      {...{
        ...scenario,
        paths: [
          throwIfNotFound(
            findTwoPointSchematicRoute({
              ...scenario,
              pointsToConnect: scenario.points,
              allowDiagonal: false,
              log,
            })
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
      }}
    />
  )
}
