/**
 * MERGE SAME-NET TRACES - SOLUTION FOR ISSUE #34
 */

export interface Point {
  x: number;
  y: number;
}

export interface Trace {
  id: string;
  netId: string;
  points: Point[];
  width: number;
}

export function mergeSameNetTraces(
  traces: Trace[],
  mergeDistance: number = 0.1
): Trace[] {
  const tracesByNet: Map<string, Trace[]> = new Map();
  
  for (const trace of traces) {
    if (!tracesByNet.has(trace.netId)) {
      tracesByNet.set(trace.netId, []);
    }
    tracesByNet.get(trace.netId)!.push(trace);
  }
  
  const mergedTraces: Trace[] = [];
  
  for (const [netId, netTraces] of tracesByNet) {
    if (netTraces.length <= 1) {
      mergedTraces.push(...netTraces);
      continue;
    }
    
    const sorted = [...netTraces].sort((a, b) => 
      getTraceLength(b) - getTraceLength(a)
    );
    
    const usedIndices = new Set<number>();
    const resultTraces: Trace[] = [];
    
    for (let i = 0; i < sorted.length; i++) {
      if (usedIndices.has(i)) continue;
      
      let basePoints = [...sorted[i].points];
      
      for (let j = i + 1; j < sorted.length; j++) {
        if (usedIndices.has(j)) continue;
        
        if (areTracesWithinDistance(basePoints, sorted[j].points, mergeDistance)) {
          basePoints = mergePointSets(basePoints, sorted[j].points, mergeDistance);
          usedIndices.add(j);
        }
      }
      
      resultTraces.push({
        ...sorted[i],
        points: simplifyPoints(basePoints, mergeDistance)
      });
    }
    
    mergedTraces.push(...resultTraces);
  }
  
  return mergedTraces;
}

function getTraceLength(trace: Trace): number {
  let length = 0;
  for (let i = 1; i < trace.points.length; i++) {
    const dx = trace.points[i].x - trace.points[i-1].x;
    const dy = trace.points[i].y - trace.points[i-1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

function areTracesWithinDistance(
  points1: Point[],
  points2: Point[],
  maxDistance: number
): boolean {
  for (const p1 of points1) {
    for (const p2 of points2) {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      if (Math.sqrt(dx * dx + dy * dy) <= maxDistance) {
        return true;
      }
    }
  }
  return false;
}

function mergePointSets(
  points1: Point[],
  points2: Point[],
  mergeThreshold: number
): Point[] {
  const merged = [...points1];
  
  for (const point of points2) {
    let isDuplicate = false;
    for (const existing of merged) {
      const dx = existing.x - point.x;
      const dy = existing.y - point.y;
      if (Math.sqrt(dx * dx + dy * dy) <= mergeThreshold) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      merged.push({ ...point });
    }
  }
  
  return merged;
}

function simplifyPoints(points: Point[], epsilon: number = 0.01): Point[] {
  if (points.length <= 2) return points;
  
  const result: Point[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = result[result.length - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    const cross = Math.abs(
      (curr.x - prev.x) * (next.y - prev.y) -
      (curr.y - prev.y) * (next.x - prev.x)
    );
    
    if (cross > epsilon) {
      result.push(curr);
    }
  }
  
  result.push(points[points.length - 1]);
  return result;
}
