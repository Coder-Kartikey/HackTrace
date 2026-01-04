type TraceEvent = {
  fn: string;
  type?: "start" | "end" | "error";
  error?: string;
};

type GraphNode = {
  id: string;
  isError?: boolean;
};

type GraphEdge = {
  from: string;
  to: string;
};

type ExecutionGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export function traceToGraph(trace: TraceEvent[]): ExecutionGraph {
  const nodesMap = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  let prevFn: string | null = null;

  for (const event of trace) {
    const fnName = event.fn;

    // Create node if not exists
    if (!nodesMap.has(fnName)) {
      nodesMap.set(fnName, {
        id: fnName,
        isError: event.type === "error"
      });
    }

    // Mark error node
    if (event.type === "error") {
      const node = nodesMap.get(fnName);
      if (node) node.isError = true;
    }

    // Create edge from previous function
    if (prevFn && prevFn !== fnName) {
      edges.push({
        from: prevFn,
        to: fnName
      });
    }

    prevFn = fnName;
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges
  };
}
