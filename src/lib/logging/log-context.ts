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

export const createLogContextTree = (): LogContextTree => {
  const tree: Partial<LogContextTree> = {
    name: "root",
    start_time: Date.now(),
  }

  tree.start = (info) => {
    tree.info = info
  }
  tree.end = () => {
    tree.end_time = Date.now()
    tree.duration = tree.end_time - tree.start_time
  }
  tree.child = (name) => {
    const child = createLogContextTree()
    child.name = name
    tree.children.push(child)
    return child
  }

  return tree as LogContextTree
}
