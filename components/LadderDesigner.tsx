
import React, { useState } from 'react';
import { AutonomyLevel, AutonomyLevelType } from '../types';

interface LadderDesignerProps {
  levels: AutonomyLevel[];
  onUpdate: (levels: AutonomyLevel[]) => void;
  onSimulate: (levelId: string) => void;
}

const LadderDesigner: React.FC<LadderDesignerProps> = ({ levels, onUpdate, onSimulate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUpdateLevel = (id: string, updates: Partial<AutonomyLevel>) => {
    onUpdate(levels.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const handleUpdatePermission = (id: string, field: string, value: string | string[]) => {
    const level = levels.find(l => l.id === id);
    if (!level) return;
    
    handleUpdateLevel(id, {
      permissions: {
        ...level.permissions,
        [field]: value
      }
    });
  };

  return (
    <div className="p-12 max-w-6xl mx-auto">
      <div className="mb-12 flex justify-between items-start">
        <div className="max-w-xl">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 mb-4">Autonomy ladder</h2>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">Define the levels of agency and control. Each level represents a graduated increase in AI decision-making power.</p>
        </div>
        <button className="px-6 py-3 brand-gradient text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 transition-transform active:scale-95">
          + New level
        </button>
      </div>

      <div className="relative space-y-10">
        {/* Connecting Line */}
        <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-slate-100 -z-10"></div>

        {levels.sort((a,b) => b.rank - a.rank).map((level) => (
          <div 
            key={level.id} 
            className={`group relative bg-white rounded-[2rem] border transition-all duration-300 ${
              editingId === level.id 
                ? 'ring-1 ring-slate-200 shadow-2xl scale-[1.02] z-10' 
                : 'border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-colors ${
                    editingId === level.id ? 'brand-gradient text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                  }`}>
                    {level.rank}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-950 tracking-tight">{level.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-widest">
                        {level.type}
                      </span>
                      <span className="text-slate-300">•</span>
                      <p className="text-sm text-slate-400 font-medium">{level.description.substring(0, 80)}...</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onSimulate(level.id)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Simulate this level"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setEditingId(editingId === level.id ? null : level.id)}
                    className={`p-3 rounded-xl transition-all ${
                      editingId === level.id ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-400'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingId === level.id ? "M5 13l4 4L19 7" : "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"} />
                    </svg>
                  </button>
                </div>
              </div>

              {editingId !== level.id ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4 border-t border-slate-50">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Allowed actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {level.permissions.allowedActions.map((a, i) => (
                        <span key={i} className="text-xs font-semibold px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Forbidden actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {level.permissions.forbiddenActions.map((a, i) => (
                        <span key={i} className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100/50">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Language constraints</h4>
                    <p className="text-sm text-slate-500 italic leading-relaxed font-medium">“{level.permissions.languageConstraints}”</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Display name</label>
                      <input 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={level.name}
                        onChange={(e) => handleUpdateLevel(level.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                      <input 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={level.description}
                        onChange={(e) => handleUpdateLevel(level.id, { description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Allowed permissions (comma separated)</label>
                    <textarea 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-24"
                      value={level.permissions.allowedActions.join(', ')}
                      onChange={(e) => handleUpdatePermission(level.id, 'allowedActions', e.target.value.split(',').map(s => s.trim()))}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                     <button onClick={() => setEditingId(null)} className="px-6 py-3 text-slate-500 font-bold text-sm">Cancel</button>
                     <button onClick={() => setEditingId(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95">Save changes</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LadderDesigner;
