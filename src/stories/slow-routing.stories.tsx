const scenario = {
  pointsToConnect: [
    // { x: 3, y: -1.75, schematic_port_id: "schematic_port_34" },
    { x: 4.5, y: -1.75, schematic_port_id: "schematic_port_35" },
    { x: -8, y: -7.75, schematic_port_id: "schematic_port_36" },
    // {
    //   x: 4.5,
    //   y: -0.5,
    //   schematic_port_id: "schematic_port_28",
    //   facing_direction: "up",
    // },
  ],
  obstacles: [
    { center: { x: 0, y: 0 }, width: 1, height: 6.5 },
    { center: { x: -0.75, y: -3 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: -2.5 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: -2 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: -1.5 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: -1 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: -0.5 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: 0 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: 0.5 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: 1 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: 1.5 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: 2 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: 2.5 }, width: 0.4, height: 0.4 },
    { center: { x: -0.75, y: 3 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: -3 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: -2.5 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: -2 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: -1.5 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: -1 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: -0.5 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: 0 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: 0.5 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: 1 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: 1.5 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: 2 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: 2.5 }, width: 0.4, height: 0.4 },
    { center: { x: 0.75, y: 3 }, width: 0.4, height: 0.4 },
    { center: { x: 3, y: 0 }, width: 1, height: 0.3 },
    { center: { x: 3, y: -0.5 }, width: 0.4, height: 0.4 },
    { center: { x: 3, y: 0.5 }, width: 0.4, height: 0.4 },
    { center: { x: 4.5, y: 0 }, width: 1, height: 0.3 },
    { center: { x: 4.5, y: 0.5 }, width: 0.4, height: 0.4 },
    { center: { x: 3, y: 2 }, width: 0.45899999999999963, height: 1 },
    { center: { x: 3, y: 1.5 }, width: 0.4, height: 0.4 },
    { center: { x: 3, y: 2.5 }, width: 0.4, height: 0.4 },
    { center: { x: 4.5, y: 2 }, width: 0.45899999999999963, height: 1 },
    { center: { x: 4.5, y: 1.5 }, width: 0.4, height: 0.4 },
    { center: { x: 4.5, y: 2.5 }, width: 0.4, height: 0.4 },
    { center: { x: 3, y: -1.875 }, width: 0.7999999999999998, height: 0.25 },
    { center: { x: 4.5, y: -1.875 }, width: 0.8000000000000007, height: 0.25 },
    { center: { x: -8, y: -7.875 }, width: 0.8000000000000007, height: 0.25 },
  ],
  grid: { maxGranularSearchSegments: 50, marginSegments: 10, segmentSize: 0.1 },
}

import type { Meta, StoryObj } from "@storybook/react"

import { RouterBoard } from "../components/RouterBoard"
import { findTwoPointGranularRoute } from "../lib/find-two-point-granular-route"
import { Grid, Path, PathFindingResult } from "../lib/types"
import { findTwoPointMixedGranularityRoute } from "../lib/find-two-point-mixed-granularity-route"
import { findTwoPointSchematicRoute } from "../lib/find-two-point-schematic-route"
import {
  findSchematicRoute,
  findTwoPointNearBiasRoute,
  movePointsOutsideObstacles,
} from "../lib"

const meta: Meta<typeof RouterBoard> = {
  title: "Routing/SlowRouting1",
  component: RouterBoard,
  tags: [],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof RouterBoard>

const throwIfNotFound = (path: PathFindingResult): Path => {
  if (path.pathFound === false) {
    // throw new Error("Path not found")
    return {
      points: [],
      width: 1,
    }
  } else {
    return path
  }
}

export const TestSchematicRoute1 = () => {
  const scenario2 = movePointsOutsideObstacles(scenario)
  return (
    <RouterBoard
      {...{
        ...scenario2,
        paths: [
          throwIfNotFound(
            findSchematicRoute({
              ...scenario2,
              allowDiagonal: false,
            })
          ),
        ],
        viewBox: {
          topLeftX: -10,
          topLeftY: -10,
          width: (8 / 5) * 20,
          height: 20,
        },
        width: 800,
        height: 500,
      }}
    />
  )
}
