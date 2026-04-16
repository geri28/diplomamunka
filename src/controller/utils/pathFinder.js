import { globalGraphEdges, globalGraphNodes } from "../../model/mapData";

const findShortestPath = (graphNodes, graphEdges, start, end) => {
  if (!start || !end || !graphNodes[start] || !graphNodes[end]) return [];

  const adj = {};
  Object.keys(graphNodes).forEach((n) => (adj[n] = []));

  graphEdges.forEach(([a, b]) => {
    if (graphNodes[a] && graphNodes[b]) {
      const dx = graphNodes[a].x - graphNodes[b].x;
      const dy = graphNodes[a].y - graphNodes[b].y;
      const weight = Math.sqrt(dx * dx + dy * dy);
      adj[a].push({ node: b, weight });
      adj[b].push({ node: a, weight });
    }
  });

  const dist = {};
  const prev = {};
  const q = new Set(Object.keys(graphNodes));

  Object.keys(graphNodes).forEach((n) => {
    dist[n] = Infinity;
    prev[n] = null;
  });
  dist[start] = 0;

  while (q.size > 0) {
    let u = null;
    q.forEach((n) => {
      if (u === null || dist[n] < dist[u]) u = n;
    });
    if (dist[u] === Infinity || u === end) break;
    q.delete(u);

    adj[u].forEach((v) => {
      if (q.has(v.node)) {
        const alt = dist[u] + v.weight;
        if (alt < dist[v.node]) {
          dist[v.node] = alt;
          prev[v.node] = u;
        }
      }
    });
  }

  const path = [];
  let curr = end;
  if (prev[curr] !== null || curr === start) {
    while (curr) {
      path.unshift(curr);
      curr = prev[curr];
    }
  }
  return path;
};
export const calculateRoute = (
  startValue,
  finishValue,
  liftValue,
  startFloor,
  finishFloor,
) => {
  if (startValue && finishValue && startValue !== finishValue) {
    const isAudmax =
      (startValue === "audmax" && finishFloor === "emelet3") ||
      (finishValue === "audmax" && startFloor === "emelet3");

    if (startFloor !== finishFloor && liftValue === "igen" && !isAudmax) {
      const liftConfig = {
        foldszint: "liftf",
        emelet1: "lift1",
        emelet2: "lift2",
        emelet3: "lift3",
        emelet4: "lift4",
      };

      let startTransitionNode = liftConfig[startFloor];
      let finishTransitionNode = liftConfig[finishFloor];

      if (startValue === "audmax") {
        startTransitionNode = "lift3";
      } else if (finishValue === "audmax") {
        finishTransitionNode = "lift3";
      }
      const path1 = findShortestPath(
        globalGraphNodes,
        globalGraphEdges,
        startValue,
        startTransitionNode,
      );
      const path2 = findShortestPath(
        globalGraphNodes,
        globalGraphEdges,
        finishTransitionNode,
        finishValue,
      );
      return [...path1, ...path2];
    } else {
      return findShortestPath(
        globalGraphNodes,
        globalGraphEdges,
        startValue,
        finishValue,
      );
    }
  }
  return [];
};
