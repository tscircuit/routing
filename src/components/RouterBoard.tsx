import type { Grid, Point, Path, Obstacle } from "../lib/types"

type Props = {
  grid: Grid
  obstacles: Array<Obstacle>
  paths: Path[]
  viewBox: { width: number; height: number; topLeftX: number; topLeftY: number }
  width: number
  height: number
} & (
  | { points: readonly Point[]; pointsToConnect?: undefined }
  | {
      pointsToConnect: readonly Point[]
      points?: undefined
    }
)

export const RouterBoard = ({
  paths,
  points,
  pointsToConnect,
  grid,
  obstacles,
  width,
  height,
  viewBox,
}: Props) => {
  const svgViewBox = [
    viewBox.topLeftX,
    viewBox.topLeftY,
    viewBox.width,
    viewBox.height,
  ].join(" ")

  points ??= pointsToConnect
  pointsToConnect ??= points

  // scale factor, 1 = 1% of width
  const SF = viewBox.width / 400

  return (
    <div>
      {" "}
      <svg
        width={width}
        height={height}
        viewBox={svgViewBox}
        // Flip to regular cartesian coordinates where y+ is up
        style={{
          transform: "scaleY(-1)",
        }}
      >
        {/* Render grid */}
        {Array.from({
          length: Math.ceil(width / grid.segmentSize) + 1,
        }).map((_, x) => (
          <line
            x1={viewBox.topLeftX + x * grid.segmentSize}
            y1={viewBox.topLeftY}
            x2={viewBox.topLeftX + x * grid.segmentSize}
            y2={viewBox.topLeftY + viewBox.height}
            stroke="lightgray"
            strokeWidth={SF}
          />
        ))}
        {Array.from({
          length: Math.ceil(height / grid.segmentSize) + 1,
        }).map((_, y) => (
          <line
            x1={viewBox.topLeftX}
            y1={viewBox.topLeftY + y * grid.segmentSize}
            x2={viewBox.topLeftX + viewBox.width}
            y2={viewBox.topLeftY + y * grid.segmentSize}
            stroke="lightgray"
            strokeWidth={SF}
          />
        ))}

        {/* Render obstacles */}
        {obstacles.map((obstacle, index) => (
          <rect
            x={obstacle.center.x - obstacle.width / 2}
            y={obstacle.center.y - obstacle.height / 2}
            width={obstacle.width}
            height={obstacle.height}
            fill="red"
            key={index}
          />
        ))}

        {/* Render paths */}
        {paths.map((path, index) => (
          <polyline
            points={path.points.map((p) => `${p.x},${p.y}`).join(" ")}
            stroke={(path as any).color ?? "green"}
            strokeWidth={path.width * SF}
            fill="none"
            key={index}
          />
        ))}

        {/* Render points */}
        {points.map((point, index) => (
          <circle
            cx={point.x}
            cy={point.y}
            r={SF * 1.5}
            fill="blue"
            key={index}
          />
        ))}
      </svg>
    </div>
  )
}

export default RouterBoard
