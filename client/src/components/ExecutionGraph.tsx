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
  const nodeWidth = 200;
  const nodeHeight = 48;
  const startX = 100;
  const startY = 40;
  const gapY = 90;

  // ✅ VERY IMPORTANT: extra bottom padding
  const svgHeight =
    startY + graph.nodes.length * gapY + 80;

  const positions: Record<string, { x: number; y: number }> = {};

  graph.nodes.forEach((node, index) => {
    positions[node.id] = {
      x: startX,
      y: startY + index * gapY
    };
  });

  return (
    <div className="overflow-y-auto overflow-x-hidden">
      <svg
        width="100%"
        height={svgHeight}
        style={{ overflow: "visible" }}
      >
        {/* Arrow marker */}
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="#475569" />
          </marker>
        </defs>

        {/* Edges */}
        {graph.edges.map((edge, idx) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;

          return (
            <line
              key={idx}
              x1={from.x + nodeWidth / 2}
              y1={from.y + nodeHeight}
              x2={to.x + nodeWidth / 2}
              y2={to.y}
              stroke="#475569"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
          );
        })}

        {/* Nodes */}
        {graph.nodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;

          return (
            <g key={node.id}>
              <rect
                x={pos.x}
                y={pos.y}
                rx="12"
                ry="12"
                width={nodeWidth}
                height={nodeHeight}
                fill={node.isError ? "#fee2e2" : "#e0f2fe"}
                stroke={node.isError ? "#ef4444" : "#0284c7"}
                strokeWidth="2"
              />

              <text
                x={pos.x + nodeWidth / 2}
                y={pos.y + nodeHeight / 2 + 5}
                textAnchor="middle"
                fontSize="13"
                fill="#0f172a"
                fontFamily="monospace"
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
