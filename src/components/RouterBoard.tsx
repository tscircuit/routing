type Path = {
  points: Array<{ x: number; y: number }>
  width: number
}

type Props = {
  points: Array<{ x: number; y: number }>
  grid: { lineDistanceX: number; lineDistanceY: number }
  obstacles: Array<{
    center: { x: number; y: number }
    width: number
    height: number
  }>
  paths: Path[]
  viewBox: { width: number; height: number; topLeftX: number; topLeftY: number }
  width: number
  height: number
}

export const RouterBoard = ({
  paths,
  points,
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

  return (
    <div>
      {" "}
      <svg width={width} height={height} viewBox={svgViewBox}>
        {/* Render grid */}
        {Array.from({
          length: Math.ceil(width / grid.lineDistanceX) + 1,
        }).map((_, x) => (
          <line
            x1={x * grid.lineDistanceX}
            y1={0}
            x2={x * grid.lineDistanceX}
            y2={viewBox.height}
            stroke="lightgray"
          />
        ))}
        {Array.from({
          length: Math.ceil(height / grid.lineDistanceY) + 1,
        }).map((_, y) => (
          <line
            x1={0}
            y1={y * grid.lineDistanceY}
            x2={viewBox.width}
            y2={y * grid.lineDistanceY}
            stroke="lightgray"
          />
        ))}

        {/* Render points */}
        {points.map((point, index) => (
          <circle cx={point.x} cy={point.y} r={0.5} fill="blue" key={index} />
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
            stroke="green"
            strokeWidth={path.width}
            fill="none"
            key={index}
          />
        ))}
      </svg>
    </div>
  )
}

export default RouterBoard
