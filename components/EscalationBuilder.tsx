
import React from 'react';
import { AutonomyLevel, EscalationPath } from '../types';

interface EscalationBuilderProps {
  levels: AutonomyLevel[];
  paths: EscalationPath[];
  onUpdate: (paths: EscalationPath[]) => void;
}

const EscalationBuilder: React.FC<EscalationBuilderProps> = ({ levels, paths, onUpdate }) => {
  const getLevelName = (id: string) => levels.find(l => l.id === id)?.name || 'Unknown';

  const addPath = () => {
    const newPath: EscalationPath = {
      id: `path-${Date.now()}`,
      sourceLevelId: levels[0].id,
      triggerType: 'RiskFlag',
      triggerValue: 'New Trigger Description',
      target: 'HumanHandoff',
      isMandatory: true
    };
    onUpdate([...paths, newPath]);
  };

  const removePath = (id: string) => {
    onUpdate(paths.filter(p => p.id !== id));
  };

  const updatePath = (id: string, updates: Partial<EscalationPath>) => {
    onUpdate(paths.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Escalation Matrix</h2>
          <p className="text-slate-500 mt-2">Configure rules that trigger transitions between autonomy levels or human oversight.</p>
        </div>
        <button 
          onClick={addPath}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Rule
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
          <div className="col-span-3">Source Level</div>
          <div className="col-span-4">Trigger Condition</div>
          <div className="col-span-3">Target Action</div>
          <div className="col-span-2 text-right">Settings</div>
        </div>

        {paths.map((path) => (
          <div key={path.id} className="grid grid-cols-12 gap-4 items-center bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="col-span-3">
              <select 
                className="w-full text-sm font-semibold p-2 bg-slate-50 border rounded-lg"
                value={path.sourceLevelId}
                onChange={(e) => updatePath(path.id, { sourceLevelId: e.target.value })}
              >
                {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>

            <div className="col-span-4 flex gap-2">
              <select 
                className="w-1/3 text-xs font-bold p-2 bg-slate-50 border rounded-lg"
                value={path.triggerType}
                onChange={(e) => updatePath(path.id, { triggerType: e.target.value as any })}
              >
                <option value="RiskFlag">Risk</option>
                <option value="ConfidenceThreshold">Confidence</option>
                <option value="TopicClassification">Topic</option>
                <option value="UserIntent">Intent</option>
                <option value="Sentiment">Sentiment</option>
              </select>
              <input 
                className="flex-1 text-sm p-2 bg-slate-50 border rounded-lg"
                value={path.triggerValue}
                onChange={(e) => updatePath(path.id, { triggerValue: e.target.value })}
              />
            </div>

            <div className="col-span-3 flex gap-2">
              <select 
                className="w-1/2 text-sm p-2 bg-slate-50 border rounded-lg"
                value={path.target}
                onChange={(e) => updatePath(path.id, { target: e.target.value as any })}
              >
                <option value="LevelChange">Mode Change</option>
                <option value="HumanHandoff">Human Agent</option>
                <option value="Clarification">Clarify</option>
                <option value="SystemExit">Exit System</option>
              </select>
              {path.target === 'LevelChange' && (
                <select 
                  className="w-1/2 text-sm p-2 bg-slate-50 border rounded-lg"
                  value={path.targetLevelId}
                  onChange={(e) => updatePath(path.id, { targetLevelId: e.target.value })}
                >
                  <option value="">Select Level</option>
                  {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              )}
            </div>

            <div className="col-span-2 flex items-center justify-end gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  className="w-4 h-4 rounded text-indigo-600"
                  checked={path.isMandatory}
                  onChange={(e) => updatePath(path.id, { isMandatory: e.target.checked })}
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Mandatory</span>
              </label>
              <button 
                onClick={() => removePath(path.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EscalationBuilder;
