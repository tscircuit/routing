import type { Meta, StoryObj } from "@storybook/react"
import { PasteJson } from "./components/PasteJson"
import RouterBoard from "../components/RouterBoard"

const meta: Meta<typeof PasteJson> = {
  title: "RouterBoard/Debug Granular Route",
  component: PasteJson,
  tags: [],
  argTypes: {},
}

export const Primary = () => {
  return (
    <RouterBoard
      grid={{
        marginSegments: 1,
        maxGranularSearchSegments: 20,
        segmentSize: 5,
      }}
      obstacles={[
        {
          center: { x: 100, y: 60 },
          height: 10,
          width: 35,
        },
        {
          center: { x: 90, y: 70 },
          height: 15,
          width: 15,
        },
      ]}
      points={[
        { x: 10, y: 10 },
        { x: 130, y: 80 },
      ]}
      paths={[]}
      viewBox={{ width: 200, height: 200, topLeftX: 0, topLeftY: 0 }}
      width={800}
      height={500}
    />
  )
}

export default meta
