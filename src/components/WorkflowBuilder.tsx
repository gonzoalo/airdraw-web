import { useState } from 'react';
import { NodePalette } from './NodePalette';
import { WorkflowCanvas } from './WorkflowCanvas';
import { Button } from './ui/button';
import { Play, Save, Trash2, Wind } from 'lucide-react';

export interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const addNode = (type: string, label: string, color: string, x: number, y: number) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}-${Math.random()}`,
      type,
      label,
      x,
      y,
      color,
    };
    setNodes([...nodes, newNode]);
  };

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, x, y } : node
    ));
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
    setConnections(connections.filter(conn => conn.from !== id && conn.to !== id));
    if (selectedNode === id) {
      setSelectedNode(null);
    }
  };

  const addConnection = (from: string, to: string) => {
    // Prevent duplicate connections
    const exists = connections.some(conn => conn.from === from && conn.to === to);
    if (!exists && from !== to) {
      setConnections([...connections, { id: `conn-${Date.now()}`, from, to }]);
    }
  };

  const clearWorkflow = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNode(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wind className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-white">DAG Builder</h1>
            <p className="text-slate-400 text-sm">Design your data pipeline workflow</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white">
            <Save className="w-4 h-4 mr-2" />
            Save DAG
          </Button>
          <Button variant="outline" size="sm" onClick={clearWorkflow} className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white">
            <Play className="w-4 h-4 mr-2" />
            Trigger DAG
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <NodePalette />
        <WorkflowCanvas
          nodes={nodes}
          connections={connections}
          selectedNode={selectedNode}
          onAddNode={addNode}
          onUpdateNodePosition={updateNodePosition}
          onDeleteNode={deleteNode}
          onSelectNode={setSelectedNode}
          onAddConnection={addConnection}
        />
      </div>
    </div>
  );
}