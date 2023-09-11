import { useState } from "react"
import RouterBoard from "../components/RouterBoard"
import { isIntersectingObstacle } from "../lib/is-intersecting-obstacle"
import { Grid } from "../lib/types"

export const IsIntersectingObstacle = () => {
  const [{ mx, my }, setMouse] = useState({ mx: 0, my: 0 })
  const grid = {
    segmentSize: 10,
    marginSegments: 1,
    maxGranularSearchSegments: 50,
  } as Grid

  const obstacles = [
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
      center: { x: 20, y: 60 },
      width: 1,
      height: 15,
    },
  ]

  const intersecting = isIntersectingObstacle({
    x1: 50,
    y1: 50,
    x2: mx,
    y2: my,
    obstacles,
  })

  const points = [
    { x: 50, y: 50 },
    { x: mx, y: my },
  ]

  return (
    <div
      onMouseMove={(e) => {
        setMouse({
          mx: (e.nativeEvent.offsetX / 600) * 120,
          my: (e.nativeEvent.offsetY / 500) * 100,
        })
      }}
    >
      Intersecting: {intersecting ? "yes" : "no"}
      <RouterBoard
        grid={grid}
        obstacles={obstacles}
        points={points}
        height={500}
        paths={[
          {
            points,
            width: 1,
          },
        ]}
        viewBox={{
          height: 100,
          width: 120,
          topLeftX: 0,
          topLeftY: 0,
        }}
        width={600}
      />
    </div>
  )
}
export default {
  title: "Utilities/IsIntersectingObstacle",
  component: IsIntersectingObstacle,
}
