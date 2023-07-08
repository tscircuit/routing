import type { Meta, StoryObj } from "@storybook/react"

import { RouterBoard } from "../components/RouterBoard"

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  title: "RouterBoard/Test",
  component: RouterBoard,
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: {
      control: "color",
    },
  },
}

export default meta
type Story = StoryObj<typeof RouterBoard>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    points: [
      { x: 10, y: 10 },
      { x: 20, y: 10 },
      { x: 30, y: 10 },
      { x: 40, y: 10 },
      { x: 50, y: 10 },
    ],
    grid: { lineDistanceX: 10, lineDistanceY: 10 },
    obstacles: [
      {
        center: { x: 60, y: 60 },
        width: 10,
        height: 10,
      },
      {
        center: { x: 70, y: 70 },
        width: 15,
        height: 15,
      },
    ],
    paths: [
      {
        points: [
          { x: 10, y: 10 },
          { x: 20, y: 20 },
          { x: 30, y: 30 },
          { x: 40, y: 40 },
          { x: 50, y: 50 },
        ],
        width: 2,
      },
      {
        points: [
          { x: 10, y: 10 },
          { x: 20, y: 20 },
          { x: 30, y: 30 },
        ],
        width: 1,
      },
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
