
import React, { useState } from 'react';
import { ProjectState } from '../types';

interface PolicyExportProps {
  state: ProjectState;
}

const PolicyExport: React.FC<PolicyExportProps> = ({ state }) => {
  const [format, setFormat] = useState<'json' | 'yaml' | 'markdown'>('json');

  const getExportContent = () => {
    switch (format) {
      case 'json':
        return JSON.stringify(state, null, 2);
      case 'markdown':
        return `# Autonomy Governance Policy\n\n## Autonomy Ladder\n\n${state.levels.map(l => `### ${l.name} (${l.type})\n${l.description}\n\n**Allowed:** ${l.permissions.allowedActions.join(', ')}\n\n**Forbidden:** ${l.permissions.forbiddenActions.join(', ')}`).join('\n\n')}\n\n## Escalation Paths\n\n${state.paths.map(p => `- Trigger: ${p.triggerType} (${p.triggerValue}) -> Target: ${p.target}`).join('\n')}`;
      case 'yaml':
        return `project: Autonomy Planner\nlevels:\n${state.levels.map(l => `  - id: ${l.id}\n    name: "${l.name}"\n    description: "${l.description}"`).join('\n')}`;
      default:
        return '';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Policy & Artifact Generator</h2>
        <p className="text-slate-500 mt-2">Export your governance framework for deployment or regulatory compliance.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-2">
            {(['json', 'yaml', 'markdown'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setFormat(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  format === f ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Download Artifact
          </button>
        </div>
        <div className="p-0">
          <pre className="p-8 text-xs font-mono text-slate-600 bg-slate-950 text-indigo-400 overflow-auto max-h-[500px]">
            {getExportContent()}
          </pre>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <h4 className="text-sm font-bold text-indigo-900 mb-2">Compliance Summary</h4>
          <p className="text-xs text-indigo-700 leading-relaxed">
            This policy satisfies Article 13/14 transparency requirements by explicitly documenting human-in-the-loop triggers and AI operational boundaries.
          </p>
        </div>
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
          <h4 className="text-sm font-bold text-slate-900 mb-2">Technical Integration</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            The JSON artifact can be directly ingested by the Autonomy Runtime Engine to enforce these rules in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyExport;
