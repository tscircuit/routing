import test from "ava"
import { Path, PathFindingResult, findRoute, Grid } from "../src"

const throwIfNotFound = (path: PathFindingResult): Path => {
  if (path.pathFound === false) {
    throw new Error("Path not found")
  } else {
    return path
  }
}

test("findRoute example", async (t) => {
  const A = { x: 10, y: 10 }
  const B = { x: 120, y: 80 }
  const scenario = {
    points: [A, B],
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

  const route = throwIfNotFound(
    findRoute({
      pointsToConnect: [A, B],
      obstacles: scenario.obstacles,
      grid: scenario.grid,
    })
  )

  t.snapshot(route.points)
})
