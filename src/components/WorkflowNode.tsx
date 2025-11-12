import { useRef, useState, useEffect } from 'react';
import type { WorkflowNode as WorkflowNodeType } from './WorkflowBuilder';
import { Trash2, Circle } from 'lucide-react';
import { Button } from './ui/button';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  isSelected: boolean;
  isConnecting: boolean;
  onPositionChange: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onStartConnection: (id: string) => void;
  onEndConnection: (id: string) => void;
}

export function WorkflowNode({
  node,
  isSelected,
  isConnecting,
  onPositionChange,
  onDelete,
  onSelect,
  onStartConnection,
  onEndConnection,
}: WorkflowNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!nodeRef.current) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
    onSelect(node.id);
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    onPositionChange(node.id, newX, newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove mouse event listeners with useEffect
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, node.id]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(node.id);
  };

  const handleOutputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartConnection(node.id);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEndConnection(node.id);
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute bg-white rounded-lg shadow-lg border-2 transition-all ${
        isSelected ? 'border-cyan-500 shadow-xl ring-2 ring-cyan-200' : 'border-slate-300'
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${
        isConnecting ? 'ring-2 ring-cyan-400' : ''
      }`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: '180px',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Input Connection Point */}
      <div
        className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-pointer group z-10"
        onClick={handleInputClick}
      >
        <div className="w-6 h-6 rounded-full border-2 border-slate-400 bg-white group-hover:border-cyan-500 group-hover:bg-cyan-50 transition-colors flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-cyan-500 transition-colors"></div>
        </div>
      </div>

      {/* Output Connection Point */}
      <div
        className="absolute -right-3 top-1/2 -translate-y-1/2 cursor-pointer group z-10"
        onClick={handleOutputClick}
      >
        <div className="w-6 h-6 rounded-full border-2 border-slate-400 bg-white group-hover:border-cyan-500 group-hover:bg-cyan-50 transition-colors flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-cyan-500 transition-colors"></div>
        </div>
      </div>

      {/* Node Header */}
      <div className={`${node.color} text-white px-4 py-3 rounded-t-lg flex items-center justify-between`}>
        <span className="text-sm truncate">{node.label}</span>
        {isSelected && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/20"
            onClick={handleDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Node Body */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-600 text-xs">task_id</p>
          <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">{node.type}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400" title="Success"></div>
          <div className="w-2 h-2 rounded-full bg-slate-200" title="Not run"></div>
        </div>
      </div>
    </div>
  );
}