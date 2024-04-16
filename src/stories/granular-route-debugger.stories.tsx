import type { Meta, StoryObj } from "@storybook/react"
import { PasteJson } from "./components/PasteJson"
import RouterBoard from "../components/RouterBoard"
import { decodeDebugGridString } from "../lib/logging/decode-debug-grid-string"
import { Obstacle } from "../lib/types"
import { useState } from "react"

const meta: Meta<typeof PasteJson> = {
  title: "RouterBoard/Debug Granular Route",
  component: PasteJson,
  tags: [],
  argTypes: {},
}

export const Primary = () => {
  const [dgs, setDebugGridString] = useState(
    new URLSearchParams(window.location.search).get("dgs") ??
      "1_1_25_5_26_6_o96eohxqTGqUo8UxuXH1eTJ8Gv"
  )
  let dg: ReturnType<typeof decodeDebugGridString> | null = null
  const obstacles: Obstacle[] = []
  try {
    dg = decodeDebugGridString(dgs)
    for (let y = 0; y < dg.grid.height; y++) {
      for (let x = 0; x < dg.grid.width; x++) {
        if (!dg.grid.isWalkableAt(x, y)) {
          obstacles.push({
            center: { x: x * 5, y: y * 5 },
            width: 2,
            height: 2,
          })
        }
      }
    }
  } catch (e) {}
  return (
    <div>
      debug grid string:{" "}
      <input
        type="text"
        value={dgs}
        onChange={(e) => setDebugGridString(e.target.value)}
      />
      {dg && (
        <RouterBoard
          grid={{
            marginSegments: 1,
            maxGranularSearchSegments: 20,
            segmentSize: 5,
          }}
          obstacles={obstacles}
          points={[
            { x: dg.startX * 5, y: dg.startY * 5 },
            { x: dg.endX * 5, y: dg.endY * 5 },
          ]}
          paths={[]}
          viewBox={{
            width: dg.grid.width * 5,
            height: dg.grid.height * 5,
            topLeftX: 0,
            topLeftY: 0,
          }}
          width={800}
          height={500}
        />
      )}
    </div>
  )
}

export default meta
