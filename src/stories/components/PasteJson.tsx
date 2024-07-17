import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { RouterBoard } from "../../components/RouterBoard"
import { ErrorBoundary } from "react-error-boundary"
import {
  findRoute,
  findSchematicRoute,
  movePointsOutsideObstacles,
} from "../../lib"

const defaultJson = {
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
  },
}

const FallbackError = ({ error }) => {
  return <div style={{ color: "red" }}>{error.message}</div>
}

export const PasteJson = ({ initialJson }: { initialJson?: any }) => {
  const [textAreaJson, setTextAreaJson] = useState(
    JSON.stringify(initialJson ?? defaultJson, null, "  ")
  )
  const [algo, setAlgo] = useState("none")
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    w: (8 / 5) * 100,
    h: 100,
  })
  const [viewBoxText, setViewBoxText] = useState(
    [viewBox.x, viewBox.y, viewBox.w, viewBox.h].join(",")
  )
  const [options, setOptions] = useState({ movePointsOutsideObstacles: false })

  const Board = () => {
    let paths = []

    const inputJson = JSON.parse(textAreaJson)

    const points =
      inputJson.pointsToConnect ?? inputJson.points ?? defaultJson.points

    let scenario = {
      ...defaultJson,
      ...inputJson,
      points,
      pointsToConnect: points,
    }

    if (options.movePointsOutsideObstacles) {
      scenario = movePointsOutsideObstacles(scenario)
    }

    if (algo === "find_schematic_route") {
      const route = findSchematicRoute(scenario)
      if (route.pathFound) paths = [route]
    } else if (algo === "find_route") {
      const route = findRoute(scenario)
      if (route.pathFound) paths = [route]
    }

    return (
      <RouterBoard
        {...scenario}
        paths={paths}
        viewBox={{
          topLeftX: viewBox.x,
          topLeftY: viewBox.y,
          width: viewBox.w,
          height: viewBox.h,
        }}
        height={500}
        width={800}
      />
    )
  }

  return (
    <div>
      <p>
        You can paste a JSON configuration below to render a corresponding
        router board, this is useful for debugging!
      </p>
      <div style={{ display: "flex" }}>
        <textarea
          style={{ flexGrow: 1, height: 200 }}
          defaultValue={textAreaJson}
          onChange={(e) => {
            console.log(e.target.value.length - textAreaJson.length)
            if (e.target.value.length - textAreaJson.length > 100) {
              // reset viewbox to view the entire board
              try {
                const { obstacles = [], pointsToConnect = [] } = JSON.parse(e.target.value)

                let minX = Infinity
                let minY = Infinity
                let maxX = -Infinity
                let maxY = -Infinity

                for (const point of pointsToConnect) {
                  minX = Math.min(minX, point.x)
                  minY = Math.min(minY, point.y)
                  maxX = Math.max(maxX, point.x)
                  maxY = Math.max(maxY, point.y)
                }

                for (const obstacle of obstacles) {
                  minX = Math.min(minX, obstacle.center.x - obstacle.width / 2)
                  minY = Math.min(minY, obstacle.center.y - obstacle.height / 2)
                  maxX = Math.max(maxX, obstacle.center.x + obstacle.width / 2)
                  maxY = Math.max(maxY, obstacle.center.y + obstacle.height / 2)
                }

                setViewBox({
                  x: minX,
                  y: minY,
                  w: maxX - minX,
                  h: maxY - minY,
                })
                setViewBoxText([minX, minY, maxX - minX, maxY - minY].join(","))
              } catch (e) {
                console.log(e)
              }

            }
            setTextAreaJson(e.target.value)
          }}
        ></textarea>
        <div style={{ flexGrow: 1 }}>
          <div onClick={() => setAlgo("none")}>
            <input readOnly type="radio" checked={algo === "none"} /> Don't find
            paths
          </div>
          <div onClick={() => setAlgo("find_schematic_route")}>
            <input
              readOnly
              type="radio"
              checked={algo === "find_schematic_route"}
            />{" "}
            find schematic route
          </div>
          <div onClick={() => setAlgo("find_route")}>
            <input readOnly type="radio" checked={algo === "find_route"} /> find
            route
          </div>
          <br />
          <input
            type="checkbox"
            checked={options.movePointsOutsideObstacles}
            onChange={(e) => {
              setOptions({
                ...options,
                movePointsOutsideObstacles: e.target.checked,
              })
            }}
          />{" "}
          move points outside obstacles
          <br />
          <br />
          <div>
            viewbox (x,y,w,h):{" "}
            <input
              type="text"
              value={viewBoxText}
              onChange={(e) => {
                setViewBoxText(e.target.value)
                try {
                  const [x, y, w, h] = e.target.value.split(",").map(parseFloat)
                  if ([x, y, w, h].some(isNaN))
                    throw new Error("invalid viewbox")
                  setViewBox({ x, y, w, h })
                } catch (e) {}
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <ErrorBoundary key={textAreaJson} fallbackRender={FallbackError}>
          <Board />
        </ErrorBoundary>
      </div>
    </div>
  )
}
