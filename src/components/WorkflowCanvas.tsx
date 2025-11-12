import { useRef, useState } from 'react';
import type { WorkflowNode as WorkflowNodeType, Connection } from './WorkflowBuilder';
import { WorkflowNode } from './WorkflowNode';

interface WorkflowCanvasProps {
  nodes: WorkflowNodeType[];
  connections: Connection[];
  selectedNode: string | null;
  onAddNode: (type: string, label: string, color: string, x: number, y: number) => void;
  onUpdateNodePosition: (id: string, x: number, y: number) => void;
  onDeleteNode: (id: string) => void;
  onSelectNode: (id: string | null) => void;
  onAddConnection: (from: string, to: string) => void;
}

export function WorkflowCanvas({
  nodes,
  connections,
  selectedNode,
  onAddNode,
  onUpdateNodePosition,
  onDeleteNode,
  onSelectNode,
  onAddConnection,
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeTypeData = e.dataTransfer.getData('nodeType');
    if (!nodeTypeData || !canvasRef.current) return;

    const nodeType = JSON.parse(nodeTypeData);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 75; // Center the node
    const y = e.clientY - rect.top - 40;

    onAddNode(nodeType.type, nodeType.label, nodeType.color, x, y);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectNode(null);
      setConnectingFrom(null);
    }
  };

  const handleStartConnection = (nodeId: string) => {
    setConnectingFrom(nodeId);
  };

  const handleEndConnection = (nodeId: string) => {
    if (connectingFrom && connectingFrom !== nodeId) {
      onAddConnection(connectingFrom, nodeId);
    }
    setConnectingFrom(null);
  };

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x + 75, y: node.y + 40 } : { x: 0, y: 0 };
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative bg-white overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
      style={{
        backgroundImage: `
          linear-gradient(to right, #e2e8f0 1px, transparent 1px),
          linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {connections.map((connection) => {
          const from = getNodePosition(connection.from);
          const to = getNodePosition(connection.to);
          
          // Calculate control points for bezier curve
          const midX = (from.x + to.x) / 2;
          
          return (
            <g key={connection.id}>
              <path
                d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                stroke="#06b6d4"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowhead)"
                opacity="0.8"
              />
            </g>
          );
        })}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#06b6d4" />
          </marker>
        </defs>
      </svg>

      {/* Nodes */}
      <div className="relative" style={{ zIndex: 2 }}>
        {nodes.map((node) => (
          <WorkflowNode
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            isConnecting={connectingFrom === node.id}
            onPositionChange={onUpdateNodePosition}
            onDelete={onDeleteNode}
            onSelect={onSelectNode}
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
          />
        ))}
      </div>

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-slate-400 mb-2">Drag operators here to build your DAG</p>
            <p className="text-slate-300 text-sm">Connect tasks to define dependencies</p>
          </div>
        </div>
      )}
    </div>
  );
}