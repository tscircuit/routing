import test from "ava"
import * as PF from "pathfinding"

test("astar example", async (t) => {
  const finder = new PF.AStarFinder({
    diagonalMovement: PF.DiagonalMovement.Never,
  })
  const gridMatrix = new PF.Grid(6, 6)
  const params = {
    startNode: {
      x: 5,
      y: 5,
    },
    endNode: {
      x: 1,
      y: 1,
    },
  }

  const path = finder.findPath(
    params.startNode.x,
    params.startNode.y,
    params.endNode.x,
    params.endNode.y,
    gridMatrix
  )
  // console.log(path)

  t.pass()
})
