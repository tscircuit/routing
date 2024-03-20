import { LogContextTree, createLogContextTree } from "./logging/log-context"

export type RouteContext = {
  log: LogContextTree
}
export const createRouteContext = (): RouteContext => {
  return {
    log: createLogContextTree(),
  }
}
