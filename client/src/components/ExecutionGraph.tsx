type GraphNode = {
  id: string;
  isError?: boolean;
};

type GraphEdge = {
  from: string;
  to: string;
};

type ExecutionGraphType = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export default function ExecutionGraph({
  graph
}: {
  graph: ExecutionGraphType;
}) {
  const nodeRadius = 22;
  const startX = 150;
  const startY = 40;
  const gapY = 80;

  const nodePositions: Record<string, { x: number; y: number }> = {};

  graph.nodes.forEach((node, index) => {
    nodePositions[node.id] = {
      x: startX,
      y: startY + index * gapY
    };
  });

  const height =
    startY + graph.nodes.length * gapY;

  return (
    <svg width="300" height={height}>
      {/* Edges */}
      {graph.edges.map((edge, idx) => {
        const from = nodePositions[edge.from];
        const to = nodePositions[edge.to];

        if (!from || !to) return null;

        return (
          <line
            key={idx}
            x1={from.x}
            y1={from.y + nodeRadius}
            x2={to.x}
            y2={to.y - nodeRadius}
            stroke="#555"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
        );
      })}

      {/* Arrow marker */}
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 Z" fill="#555" />
        </marker>
      </defs>

      {/* Nodes */}
      {graph.nodes.map((node) => {
        const pos = nodePositions[node.id];

        return (
          <g key={node.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={nodeRadius}
              fill={node.isError ? "#FCA5A5" : "#93C5FD"}
              stroke="#1F2937"
              strokeWidth="2"
            />
            <text
              x={pos.x}
              y={pos.y + 4}
              textAnchor="middle"
              fontSize="10"
              fill="#111827"
            >
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
