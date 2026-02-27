import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import type { Connection, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { Save, CheckCircle2, AlertCircle, Bot } from 'lucide-react';

import MessageNode from './components/MessageNode';
import Sidebar from './components/Sidebar';
import 'reactflow/dist/style.css';
import './index.css';

const nodeTypes = {
  messageNode: MessageNode,
};

let id = 0;
const getId = () => `node_id_${id++}_${Date.now().toString(36)}`;

const App = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `New Message Node ${nodes.length + 1}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, nodes.length]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const onUpdateText = useCallback((id: string, text: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: text,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const onSave = useCallback(() => {
    if (nodes.length > 1) {
      // Validation Rule: More than one node and more than one node has empty target handles
      const nodesWithEmptyTarget = nodes.filter((node) => {
        const hasIncomingEdge = edges.some((edge) => edge.target === node.id);
        return !hasIncomingEdge;
      });

      if (nodesWithEmptyTarget.length > 1) {
        showNotification('Cannot save Flow: More than one node lacks an incoming connection.', 'error');
        return;
      }
    }

    if (nodes.length === 0) {
      showNotification('Add some nodes to your flow before saving!', 'error');
      return;
    }

    showNotification('Success: Your chatbot flow has been saved!', 'success');
  }, [nodes, edges]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="h-[74px] bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-8 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-premium-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Bot size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight text-slate-800 leading-none">Bitespeed</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Flow Builder</span>
          </div>
        </div>

        <button
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95 group"
          onClick={onSave}
        >
          <Save size={18} className="group-hover:rotate-12 transition-transform" />
          Save Changes
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-slate-50"
          >
            <Background color="#cbd5e1" gap={20} size={1.5} />
            <Controls className="!m-6" />
          </ReactFlow>
        </div>

        {/* Sidebar */}
        <Sidebar
          selectedNode={selectedNode}
          onUpdateText={onUpdateText}
          onDeselect={() => setSelectedNodeId(null)}
        />
      </main>

      {/* Notifications */}
      {notification && (
        <div className={`
          fixed top-24 left-1/2 -translate-x-1/2 z-[2000] px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border animate-bounce-in
          ${notification.type === 'success'
            ? 'bg-green-50/90 border-green-200 text-green-700'
            : 'bg-red-50/90 border-red-200 text-red-700'}
        `}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-bold tracking-tight">{notification.message}</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes bounce-in {
          0% { transform: translate(-50%, -100%) scale(0.9); opacity: 0; }
          70% { transform: translate(-50%, 20px) scale(1.05); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}} />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);
