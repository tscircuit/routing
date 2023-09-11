import { Point } from "./types"

/**
 * Iterate over points, if a middle point lies on the same line as it's adjacent
 * points, remove it. Return the new array without the unnecessary points.
 */
export const removeUnnecessaryPoints = (points: Point[]): Point[] => {
  if (points.length <= 3) return points
  const newPoints: Point[] = [points[0]]

  for (let i = 1; i < points.length - 1; i++) {
    const P = newPoints[newPoints.length - 1]
    const A = points[i]
    const B = points[i + 1]

    if (P.x === A.x && A.x === B.x) {
      continue
    }
    if (P.y === A.y && A.y === B.y) {
      continue
    }

    newPoints.push(A)
  }
  newPoints.push(points[points.length - 1])
  return newPoints
}
