
import React, { useState, useRef, useEffect } from 'react';
import { AutonomyLevel, SimulationMessage } from '../types';
import { simulateAIResponse } from '../services/geminiService';

interface SimulatorProps {
  levels: AutonomyLevel[];
  initialLevelId?: string;
}

const Simulator: React.FC<SimulatorProps> = ({ levels, initialLevelId }) => {
  const [selectedLevelId, setSelectedLevelId] = useState(initialLevelId || levels[0]?.id || '');
  const [messages, setMessages] = useState<SimulationMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeLevel = levels.find(l => l.id === selectedLevelId) || levels[0];

  useEffect(() => {
    if (initialLevelId) {
      setSelectedLevelId(initialLevelId);
    }
  }, [initialLevelId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent, content?: string) => {
    e?.preventDefault();
    const finalContent = content || inputValue;
    if (!finalContent.trim() || isTyping) return;

    const userMessage: SimulationMessage = {
      role: 'user',
      content: finalContent,
      metadata: { activeLevelId: selectedLevelId }
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    const aiResponseContent = await simulateAIResponse(newMessages, activeLevel);
    
    const aiMessage: SimulationMessage = {
      role: 'assistant',
      content: aiResponseContent,
      metadata: { activeLevelId: selectedLevelId }
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleProbeClick = (probe: string) => {
    handleSendMessage(undefined, probe);
  };

  return (
    <div className="h-screen flex flex-col p-12 max-w-6xl mx-auto overflow-hidden">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 mb-4">Scenario simulator</h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">Observe how the system navigates constraints in real-time.</p>
        </div>
        <div className="flex items-center gap-6 bg-slate-50 p-2 rounded-2xl border border-slate-100">
          <div className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active context</div>
          <select 
            className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/10"
            value={selectedLevelId}
            onChange={(e) => setSelectedLevelId(e.target.value)}
          >
            {levels.map(level => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Left: Chat Feed */}
        <div className="flex-1 bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/5 flex flex-col">
          <div className="flex-1 overflow-y-auto p-10 space-y-10">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                <div className="w-16 h-16 brand-gradient rounded-3xl mb-8 flex items-center justify-center shadow-2xl opacity-50">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-2">Ready for simulation</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">Input a query to test the governance logic for <span className="text-indigo-600 font-bold">{activeLevel.name}</span>.</p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-7 py-5 shadow-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-slate-950 text-white rounded-3xl rounded-tr-none' 
                    : 'bg-white text-slate-900 rounded-3xl rounded-tl-none border border-slate-100'
                }`}>
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${m.role === 'user' ? 'text-slate-400' : 'brand-text-gradient'}`}>
                    {m.role === 'assistant' ? activeLevel.name : 'User'}
                  </div>
                  <p className="text-base font-medium">{m.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-50 rounded-2xl px-6 py-3 border border-slate-100">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="p-8 bg-slate-50/50 border-t border-slate-50">
            <form onSubmit={(e) => handleSendMessage(e)} className="relative group">
              <input 
                type="text"
                placeholder={`Send a prompt as a user to ${activeLevel.name}...`}
                className="w-full bg-white border border-slate-200 px-8 py-6 rounded-[2rem] shadow-xl shadow-indigo-500/5 outline-none focus:ring-4 focus:ring-indigo-500/5 text-slate-950 font-medium transition-all group-hover:border-slate-300"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="absolute right-3 top-3 bottom-3 px-8 brand-gradient text-white rounded-[1.5rem] font-black text-sm shadow-lg disabled:opacity-20 transition-all hover:scale-[1.02] active:scale-95"
              >
                Simulate
              </button>
            </form>
            <div className="mt-4 text-center">
               <button 
                onClick={() => setMessages([])} 
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Clear simulation history
              </button>
            </div>
          </div>
        </div>

        {/* Right: Sample Probes */}
        <div className="w-80 space-y-6 flex flex-col">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Test probes</h4>
            <div className="space-y-4">
              {activeLevel.sampleProbes && activeLevel.sampleProbes.length > 0 ? (
                activeLevel.sampleProbes.map((probe, i) => (
                  <button 
                    key={i}
                    onClick={() => handleProbeClick(probe)}
                    className="w-full text-left p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-700 transition-all group"
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 brand-text-gradient opacity-0 group-hover:opacity-100 transition-opacity">
                         <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                      </div>
                      <span>{probe}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-[10px] font-bold text-slate-400 text-center italic">
                  No sample probes defined for this level. Generate a PRD to auto-populate.
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-slate-900 text-white">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Simulation info</h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Probes are curated scenarios designed to stress-test <span className="text-white font-bold">{activeLevel.name}</span>'s specific constraints and permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
