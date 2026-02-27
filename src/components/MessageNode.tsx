import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageCircle } from 'lucide-react';

const MessageNode = ({ data, selected }: any) => {
  return (
    <div className={`
      relative min-w-[280px] bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 overflow-hidden
      ${selected ? 'border-primary shadow-primary/20 scale-[1.02]' : 'border-slate-100 hover:border-slate-200'}
    `}>
      {/* Node Header */}
      <div className="bg-slate-50/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
            <MessageCircle size={16} />
          </div>
          <span className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Send Message</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center p-1">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="whatsapp" className="w-full h-full brightness-0 invert" />
          </div>
        </div>
      </div>

      {/* Node Body */}
      <div className="p-5 min-h-[80px] flex items-center text-slate-600 text-[15px] leading-relaxed bg-white">
        {data.label || <span className="text-slate-300 italic">No message content set</span>}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white hover:!bg-primary transition-colors duration-200"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white hover:!bg-primary transition-colors duration-200"
      />
    </div>
  );
};

export default memo(MessageNode);
