import React from 'react';
import { MessageSquare, ArrowLeft, PlusCircle, LayoutGrid, Settings2, PencilLine } from 'lucide-react';

interface SidebarProps {
    selectedNode: any;
    onUpdateText: (id: string, text: string) => void;
    onDeselect: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedNode, onUpdateText, onDeselect }) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-80 h-full bg-white/80 backdrop-blur-xl border-l border-slate-200 flex flex-col shadow-2xl z-20 overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Library Section */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-6 text-slate-400">
                        <LayoutGrid size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Node Library</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div
                            className="group cursor-grab active:cursor-grabbing p-5 rounded-2xl border-2 border-slate-100 bg-white hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col items-center gap-3 text-center"
                            onDragStart={(event) => onDragStart(event, 'messageNode')}
                            draggable
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <MessageSquare size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-700">Message</h3>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Drag to canvas</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content / Settings Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {selectedNode ? (
                        <div className="absolute inset-0 bg-white flex flex-col animate-slide-in">
                            <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
                                <button
                                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/50 hover:shadow-sm transition-all duration-200"
                                    onClick={onDeselect}
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 text-slate-700">
                                        <Settings2 size={14} className="text-primary" />
                                        <span className="text-sm font-bold">Node Settings</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">ID: {selectedNode.id}</span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                            <PencilLine size={12} />
                                            Text Content
                                        </label>
                                        <span className="text-[10px] text-slate-300 font-mono">{selectedNode.data.label?.length || 0} chars</span>
                                    </div>
                                    <textarea
                                        className="w-100 w-full min-h-[180px] p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-700 text-[15px] focus:outline-none focus:border-primary/30 focus:bg-white focus:shadow-inner transition-all duration-200 resize-none font-medium leading-relaxed"
                                        placeholder="Enter your message..."
                                        value={selectedNode.data.label || ''}
                                        onChange={(e) => onUpdateText(selectedNode.id, e.target.value)}
                                    />
                                    <p className="text-[10px] text-slate-400 leading-relaxed italic">
                                        This text will be sent to the user when they reach this step in the flow.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 bg-slate-50/20">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                                    <PlusCircle size={18} />
                                    <span className="text-xs font-medium">Changes are saved automatically</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6 opacity-60 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                                <PlusCircle size={32} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-slate-600">No Node Selected</h3>
                                <p className="text-[13px] text-slate-400 max-w-[180px] mx-auto leading-relaxed">
                                    Select a node on the canvas to edit its properties or drag a new node from the library.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
