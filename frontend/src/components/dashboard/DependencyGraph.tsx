'use client';

import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '@/components/graph/CustomNode';
import CustomEdge from '@/components/graph/CustomEdge';

interface DependencyGraphProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (nodeId: string, data: Record<string, unknown>) => void;
}

/**
 * Register CustomNode for ALL node types so both:
 *  - Mock data nodes (type: "custom", data.nodeType: "package")
 *  - Backend nodes  (type: "package" | "file" | "service" | "root")
 * render correctly with the same component.
 */
const nodeTypes = {
  custom: CustomNode,
  root: CustomNode,
  package: CustomNode,
  file: CustomNode,
  service: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
  smoothstep: CustomEdge,
};

export default function DependencyGraph({
  nodes: initialNodes,
  edges: initialEdges,
  onNodeClick,
}: DependencyGraphProps) {
  /**
   * Normalize incoming nodes: ensure data.nodeType is set
   * (backend sets node.type but not data.nodeType; mock data does the opposite).
   */
  const normalizedNodes = useMemo(
    () =>
      initialNodes.map((n) => {
        const d = n.data as Record<string, unknown>;
        const nodeType =
          d.nodeType || (n.type !== 'custom' ? n.type : 'package');
        return {
          ...n,
          data: { ...d, nodeType },
        };
      }),
    [initialNodes]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(normalizedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync when props change (e.g. new repo selected)
  useEffect(() => {
    setNodes(normalizedNodes);
    setEdges(initialEdges);
  }, [normalizedNodes, initialEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (onNodeClick) {
        onNodeClick(node.id, node.data as Record<string, unknown>);
      }
    },
    [onNodeClick]
  );

  const minimapNodeColor = useCallback((node: Node) => {
    const data = node.data as Record<string, unknown>;
    if (data.isFlagged) return '#DA1E28';
    const nt = data.nodeType || node.type;
    if (nt === 'repo' || nt === 'root') return '#0F62FE';
    if (nt === 'service') return '#8A3FFC';
    if (nt === 'file') return '#24A148';
    return '#E0E0E0';
  }, []);

  return (
    <div className="h-full w-full rounded-xl border border-border-default bg-white overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={1} color="#F4F4F4" />
        <Controls showInteractive={false} position="bottom-left" />
        <MiniMap
          nodeColor={minimapNodeColor}
          maskColor="rgba(255, 255, 255, 0.8)"
          position="bottom-right"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
