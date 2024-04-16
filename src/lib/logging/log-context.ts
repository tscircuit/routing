export interface LogContextTree {
  name: string
  start_time: number
  end_time?: number
  duration?: number
  children: LogContextTree[]
  info: any

  start: (info: any) => void
  child: (name: string) => LogContextTree
  end: () => void
}

export const getStringifiedTreeLines = (tree: LogContextTree) => {
  return [
    `${`${tree?.duration?.toString() ?? "???"}ms`.padEnd(6, " ")} ${
      tree.name
    }  ${tree.info ? JSON.stringify(tree.info) : ""}`,
    ...tree.children
      .map((child) => getStringifiedTreeLines(child))
      .flat()
      .map((line) => `       ${line}`),
  ]
}

export const createLogContextTree = ({
  loudEnd,
  verbose,
}: { loudEnd?: boolean; verbose?: boolean } = {}): LogContextTree => {
  const tree: Partial<LogContextTree> = {
    name: "root",
    start_time: Date.now(),
    info: {},
    children: [],
  }

  tree.start = (info) => {
    tree.info = info
  }
  tree.end = () => {
    tree.end_time = Date.now()
    tree.duration = tree.end_time - tree.start_time
    if (loudEnd && tree.name === "root") {
      console.log(getStringifiedTreeLines(tree as LogContextTree).join("\n"))
    }
  }
  tree.child = (name) => {
    const child = createLogContextTree()
    if (verbose) console.log(`>${name}`)
    child.name = name
    child.verbose = verbose
    tree.children.push(child)
    return child
  }

  return tree as LogContextTree
}
