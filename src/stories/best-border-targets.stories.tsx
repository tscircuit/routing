import type { Meta, StoryObj } from "@storybook/react"

import { RouterBoard } from "../components/RouterBoard"
import { findTwoPointGranularRoute } from "../lib/find-two-point-granular-route"
import { Grid, Path, PathFindingResult } from "../lib/types"
import { findRoute } from "../lib/find-route"
import { findBestBorderTargetPaths } from "../lib/find-best-border-target-paths"

const BorderTargets1 = () => {
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
      {
        center: { x: 10, y: 50 },
        width: 10,
        height: 30,
      },
    ],
    grid: {
      segmentSize: 10,
      marginSegments: 3,
      maxGranularSearchSegments: 50,
    } as Grid,
  }

  const borderTargetPaths = findBestBorderTargetPaths({
    point: scenario.A,
    distantTarget: scenario.distantTarget,
    distanceToBorder: 50,
    grid: scenario.grid,
    obstacles: scenario.obstacles,
  })

  return (
    <RouterBoard
      {...scenario}
      {...{
        points: [
          scenario.A,
          scenario.distantTarget,
          ...borderTargetPaths.map((p) => p.borderTarget),
        ],
        paths: borderTargetPaths,
        viewBox: {
          topLeftX: -10,
          topLeftY: -10,
          width: (8 / 5) * 100,
          height: 100,
        },
        width: 800,
        height: 500,
      }}
    />
  )
}

const BorderTargets2 = () => {
  const scenario = {
    A: { x: 10, y: 10 },
    B: { x: 50, y: 80 },
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

  const borderTargetPaths = findBestBorderTargetPaths({
    point: scenario.A,
    distantTarget: scenario.B,
    distanceToBorder: 35,
    grid: scenario.grid,
    obstacles: scenario.obstacles,
  })

  return (
    <RouterBoard
      {...scenario}
      {...{
        points: [
          scenario.A,
          scenario.B,
          ...borderTargetPaths.map((p) => p.borderTarget),
        ],
        paths: borderTargetPaths,
        viewBox: {
          topLeftX: -10,
          topLeftY: -10,
          width: (8 / 5) * 100,
          height: 100,
        },
        width: 800,
        height: 500,
      }}
    />
  )
}

export default {
  title: "Routing/BestBorderTargets",
  component: BorderTargets1,
  tags: [],
  argTypes: {},
}

export const BorderTargets1Story: StoryObj<{}> = BorderTargets1.bind({})
export const BorderTargets2Story: StoryObj<{}> = BorderTargets2.bind({})
