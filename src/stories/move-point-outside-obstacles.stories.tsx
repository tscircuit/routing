import { movePointsOutsideObstacles } from "../lib/move-points-outside-obstacles"
import { PasteJson } from "./components/PasteJson"

export const MovePointOutsideObstacles = () => {
  const scenario = {
    pointsToConnect: [
      {
        x: 10,
        y: 10,
      },
      {
        x: 50,
        y: 50,
      },
    ],
    obstacles: [
      {
        center: {
          x: 50,
          y: 70,
        },
        width: 30,
        height: 40,
      },
    ],
    grid: {
      segmentSize: 5,
      marginSegments: 1,
      maxGranularSearchSegments: 50,
    },
  }

  // const movedScenario = movePointsOutsideObstacles(scenario)

  return <PasteJson initialJson={scenario} />
}

export default {
  title: "Routing/MovePointOutsideObstacles",
  component: MovePointOutsideObstacles,
}
