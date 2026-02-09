
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  Sparkles, X, Send, Terminal, Cpu, Zap, 
  MessageSquare, Brain, Loader2, Minimize2, Maximize2 
} from 'lucide-react';
import { db } from '../db';

const RegistryAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'PROTOCOL_INITIATED. Registry Assistant online. How can I synchronize your student logic today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = db.getUser();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are the MakSocial Registry Assistant, a high-intelligence support node for Makerere University students. 
          The user is ${user.name}, a ${user.status} student at the ${user.college} Hub. 
          Use technical/cybernetic terminology like 'synchronization', 'logic nodes', 'registry', 'uplink', 'strata', and 'commits'. 
          Help with campus info, study tips, or app navigation. Be professional, slightly futuristic, and extremely helpful. 
          Keep responses concise and formatted with markdown if needed.`
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', text: response.text || "SIGNAL_ERR: Sequence interrupted." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sequence failure: Connection to central intelligence hub lost. Please verify your API key protocol." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[2000] w-14 h-14 bg-[var(--brand-color)] text-white rounded-full shadow-[0_20px_50px_rgba(16,145,138,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center">
           <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 left-6 z-[3000] w-[350px] sm:w-[400px] transition-all duration-500 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col ${isMinimized ? 'h-[72px]' : 'h-[550px]'}`}>
      
      {/* HEADER */}
      <div className="p-4 bg-slate-950 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--brand-color)] rounded-xl flex items-center justify-center shadow-lg">
             <Brain size={20} className="text-white" />
          </div>
          <div>
             <h3 className="text-xs font-black text-white uppercase tracking-widest">Registry_Assistant</h3>
             <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Node_Active</span>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
           <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-slate-500 hover:text-white transition-colors">
              {isMinimized ? <Maximize2 size={16}/> : <Minimize2 size={16}/>}
           </button>
           <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
              <X size={18}/>
           </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* MESSAGES AREA */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar font-mono bg-[#05080c]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[12px] leading-relaxed shadow-lg ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 pb-1 border-b border-white/5 opacity-50 text-[8px] font-black uppercase tracking-widest">
                       <Terminal size={10}/> Registry_Stream
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-3">
                   <Loader2 size={14} className="animate-spin text-[var(--brand-color)]" />
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Parsing logic...</span>
                </div>
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-slate-950 border-t border-white/5">
            <div className="relative group">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Query central registry..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3.5 pl-5 pr-14 text-xs font-bold text-white placeholder:text-slate-600 outline-none focus:border-[var(--brand-color)] focus:ring-4 focus:ring-[var(--brand-color)]/5 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--brand-color)] text-white rounded-lg shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-30 transition-all"
              >
                <Send size={16}/>
              </button>
            </div>
            <p className="text-[7px] text-center font-bold text-slate-700 uppercase tracking-[0.3em] mt-3">Powered by Central Intelligence Hub v3.0</p>
          </div>
        </>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default RegistryAssistant;
