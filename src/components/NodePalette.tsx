import { Database, FileInput, Filter, GitMerge, FileOutput, Zap, Code2, Mail, Cloud } from 'lucide-react';

interface NodeType {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const nodeTypes: NodeType[] = [
  {
    type: 'python',
    label: 'PythonOperator',
    icon: <Code2 className="w-5 h-5" />,
    color: 'bg-cyan-600',
    description: 'Execute Python code'
  },
  {
    type: 'bash',
    label: 'BashOperator',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-emerald-600',
    description: 'Run bash commands'
  },
  {
    type: 'sql',
    label: 'SQLOperator',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-blue-600',
    description: 'Execute SQL queries'
  },
  {
    type: 'spark',
    label: 'SparkOperator',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-orange-600',
    description: 'Run Spark jobs'
  },
  {
    type: 's3',
    label: 'S3Operator',
    icon: <Cloud className="w-5 h-5" />,
    color: 'bg-amber-600',
    description: 'S3 operations'
  },
  {
    type: 'email',
    label: 'EmailOperator',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-purple-600',
    description: 'Send email notifications'
  },
  {
    type: 'sensor',
    label: 'Sensor',
    icon: <Filter className="w-5 h-5" />,
    color: 'bg-pink-600',
    description: 'Wait for condition'
  },
  {
    type: 'branch',
    label: 'BranchOperator',
    icon: <GitMerge className="w-5 h-5" />,
    color: 'bg-indigo-600',
    description: 'Conditional branching'
  },
];

export function NodePalette() {
  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.setData('nodeType', JSON.stringify(nodeType));
  };

  return (
    <aside className="w-72 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto">
      <h2 className="text-slate-900 mb-1">Operators</h2>
      <p className="text-slate-500 text-sm mb-4">Drag operators to canvas</p>
      
      <div className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            draggable
            onDragStart={(e) => handleDragStart(e, nodeType)}
            className="bg-white border border-slate-200 rounded-lg p-3 cursor-move hover:border-cyan-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`${nodeType.color} text-white p-2 rounded-md`}>
                {nodeType.icon}
              </div>
              <span className="text-slate-900">{nodeType.label}</span>
            </div>
            <p className="text-slate-500 text-xs">{nodeType.description}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}