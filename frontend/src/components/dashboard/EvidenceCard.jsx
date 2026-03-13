import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Image as ImageIcon, MessageSquare, Mic, MoreHorizontal } from 'lucide-react';

export default function EvidenceCard({ type, name, tag, location, time, txid, processing, status, details, identities, prob }) {
  const navigate = useNavigate();
  const icons = {
    log: <FileText className="text-orange-500" size={24} />,
    image: <ImageIcon className="text-orange-500" size={24} />,
    chat: <MessageSquare className="text-emerald-500" size={24} />,
    audio: <Mic className="text-orange-500" size={24} />
  };

  return (
    <div className="bg-[#121212] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col group hover:border-white/10 transition-all">
      <div className="h-44 bg-white/[0.02] flex items-center justify-center relative p-6">
        <div className={`absolute top-4 right-4 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${tag.includes('CRITICAL') ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-white/5 text-slate-500 border-white/10'}`}>
          {tag}
        </div>
        <div className="size-20 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center">
          {icons[type]}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 gap-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-white truncate max-w-[80%]">{name}</p>
          <MoreHorizontal className="text-slate-700 cursor-pointer" size={20} />
        </div>

        <div className="flex-1">
          {location ? (
            <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                <span className="text-slate-500">Location</span>
                <span className="text-white">{location}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                <span className="text-slate-500">Timestamp</span>
                <span className="text-white">{time}</span>
              </div>
              <div className="mt-2 text-[11px] font-black tracking-[0.15em] bg-primary/10 text-primary p-2.5 rounded-xl border border-primary/10 text-center">
                TxID Detected: {txid}
              </div>
            </div>
          ) : processing ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{status}</p>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-primary animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {details && <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest"><span className="text-slate-500">Details</span><span className="text-white">{details}</span></div>}
              {identities && <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest"><span className="text-slate-500">Status</span><span className="text-white">{identities}</span></div>}
              {prob && (
                 <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest"><span className="text-slate-500">Deepfake Prob.</span><span className="text-white">{prob}</span></div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{width: prob}} /></div>
                 </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/5 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/dashboard/ai-analysis/${txid || 'unknown'}`)}>
          <span className="text-[11px] font-black uppercase text-slate-700 hover:text-slate-500 tracking-widest">Full Analysis →</span>
          <span className="text-[10px] font-black uppercase text-slate-800 tracking-widest">Metadata Exp.</span>
        </div>
      </div>
    </div>
  );
}