import type { Meta, StoryObj } from "@storybook/react"

import { RouterBoard } from "../components/RouterBoard"
import { findTwoPointGranularRoute } from "../lib/find-two-point-granular-route"
import { Grid, Path, PathFindingResult } from "../lib/types"
import { findTwoPointMixedGranularityRoute } from "../lib/find-two-point-mixed-granularity-route"
import { findTwoPointSchematicRoute } from "../lib/find-two-point-schematic-route"
import { findTwoPointNearBiasRoute } from "../lib"

const meta: Meta<typeof RouterBoard> = {
  title: "Routing/SchematicStyleRoute",
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
      { x: 10, y: 10 },
      { x: 130, y: 80 },
    ],
    obstacles: [
      {
        center: { x: 100, y: 60 },
        width: 35,
        height: 10,
      },
      {
        center: { x: 90, y: 70 },
        width: 15,
        height: 15,
      },
    ],
    grid: {
      segmentSize: 5,
      marginSegments: 1,
      maxGranularSearchSegments: 50,
    } as Grid,
  }
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
            })
          ),
          {
            ...throwIfNotFound(
              findTwoPointNearBiasRoute({
                ...scenario,
                pointsToConnect: scenario.points,
                allowDiagonal: false,
              })
            ),
            color: "rgba(0, 0, 255, 0.2)",
          } as any,
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
