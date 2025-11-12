import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import "./styles/globals.css";


export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen w-screen overflow-hidden bg-slate-100">
        <WorkflowBuilder />
      </div>
    </DndProvider>
  );
}