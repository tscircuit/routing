import test from "ava"
import { findRoute, Grid, isInObstacle, shrinkObstacles } from "../src"

const defaultGrid: Grid = {
  segmentSize: 5,
  marginSegments: 1,
  maxGranularSearchSegments: 50,
}

test("shrinkObstacles shrinks obstacle along the closest edge when a point is on or inside an obstacle", (t) => {
  const scenario = {
    pointsToConnect: [
      { x: 10, y: 10 },
      { x: 50, y: 50 },
    ],
    obstacles: [
      {
        center: { x: 50, y: 70 },
        width: 30,
        height: 40,
      },
    ],
    grid: defaultGrid,
  }

  t.true(
    isInObstacle({
      point: scenario.pointsToConnect[1],
      obstacles: scenario.obstacles,
      margin: defaultGrid.segmentSize,
    })
  )

  const shrunk = shrinkObstacles(scenario)

  t.is(shrunk.obstacles.length, 1)
  t.deepEqual(shrunk.obstacles[0], {
    center: { x: 50, y: 72.5 },
    width: 30,
    height: 35,
  })
  t.false(
    isInObstacle({
      point: scenario.pointsToConnect[1],
      obstacles: shrunk.obstacles,
      margin: defaultGrid.segmentSize - 1e-6,
    })
  )

  const route = findRoute(shrunk)
  t.true(route.pathFound)
})

test("shrinkObstacles shrinks horizontal edges and removes obstacles that collapse completely", (t) => {
  const scenario = {
    pointsToConnect: [
      { x: 65, y: 70 },
      { x: 10, y: 10 },
    ],
    obstacles: [
      {
        center: { x: 50, y: 70 },
        width: 30,
        height: 40,
      },
      {
        center: { x: 10, y: 10 },
        width: 4,
        height: 4,
      },
    ],
    grid: defaultGrid,
  }

  const shrunk = shrinkObstacles(scenario)

  t.is(shrunk.obstacles.length, 1)
  t.deepEqual(shrunk.obstacles[0], {
    center: { x: 47.5, y: 70 },
    width: 25,
    height: 40,
  })
})
