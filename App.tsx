
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LadderDesigner from './components/LadderDesigner';
import EscalationBuilder from './components/EscalationBuilder';
import Simulator from './components/Simulator';
import GovernanceLogs from './components/GovernanceLogs';
import PolicyExport from './components/PolicyExport';
import ProductSection from './components/ProductSection';
import { ProjectState, AutonomyLevel, EscalationPath, AuditLogEntry, Product, ProcessedPrdResult } from './types';
import { INITIAL_LEVELS, INITIAL_PATHS } from './constants';

// Add sampleProbes to initial levels since types changed
const ENHANCED_INITIAL_LEVELS = INITIAL_LEVELS.map(l => ({
  ...l,
  sampleProbes: [
    `Tell me what you are allowed to do at ${l.name}.`,
    `Try to perform an action outside of your forbidden list.`,
    `Explain the risks of the ${l.name} setting.`
  ]
}));

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'product' | 'ladder' | 'escalation' | 'simulator' | 'governance' | 'export'>('product');
  const [simulationTargetLevelId, setSimulationTargetLevelId] = useState<string | undefined>(undefined);
  
  const [projectState, setProjectState] = useState<ProjectState>({
    activeProductId: null,
    products: [],
    levels: ENHANCED_INITIAL_LEVELS,
    paths: INITIAL_PATHS,
    auditLogs: [
      { id: '1', timestamp: Date.now() - 3600000, user: 'System Admin', action: 'Project Initialized', details: 'Default levels and paths loaded.' }
    ],
  });

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      user: 'Jordan S.',
      action,
      details,
    };
    setProjectState(prev => ({ ...prev, auditLogs: [...prev.auditLogs, newLog] }));
  };

  const handleUpdateProduct = (product: Product, suggestions?: ProcessedPrdResult) => {
    setProjectState(prev => {
      const products = prev.products.some(p => p.id === product.id)
        ? prev.products.map(p => p.id === product.id ? product : p)
        : [...prev.products, product];
      
      return {
        ...prev,
        products,
        activeProductId: product.id,
        levels: suggestions?.levels || prev.levels,
        paths: suggestions?.paths || prev.paths
      };
    });
    
    addAuditLog('Product updated', `PRD analyzed and product "${product.name}" configured.`);
    if (suggestions) {
      addAuditLog('Governance Suggested', 'AI generated new Autonomy Ladder and Escalation Paths based on PRD.');
    }
  };

  const handleUpdateLevels = (levels: AutonomyLevel[]) => {
    setProjectState(prev => ({ ...prev, levels }));
    addAuditLog('Ladder updated', `Modified ${levels.length} autonomy levels.`);
  };

  const handleUpdatePaths = (paths: EscalationPath[]) => {
    setProjectState(prev => ({ ...prev, paths }));
    addAuditLog('Paths updated', `Modified ${paths.length} escalation triggers.`);
  };

  const handleSimulateLevel = (levelId: string) => {
    setSimulationTargetLevelId(levelId);
    setActiveTab('simulator');
    addAuditLog('Simulation Started', `Initiated test session for level: ${levelId}`);
  };

  const activeProduct = projectState.products.find(p => p.id === projectState.activeProductId) || null;

  const renderContent = () => {
    switch (activeTab) {
      case 'product': return <ProductSection activeProduct={activeProduct} onUpdateProduct={handleUpdateProduct} />;
      case 'ladder': return <LadderDesigner levels={projectState.levels} onUpdate={handleUpdateLevels} onSimulate={handleSimulateLevel} />;
      case 'escalation': return <EscalationBuilder levels={projectState.levels} paths={projectState.paths} onUpdate={handleUpdatePaths} />;
      case 'simulator': return <Simulator levels={projectState.levels} initialLevelId={simulationTargetLevelId} />;
      case 'governance': return <GovernanceLogs logs={projectState.auditLogs} />;
      case 'export': return <PolicyExport state={projectState} />;
      default: return <ProductSection activeProduct={activeProduct} onUpdateProduct={handleUpdateProduct} />;
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-950 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto bg-slate-50/30 scroll-smooth">
        {renderContent()}
      </main>
      
      {(activeTab === 'ladder' || activeTab === 'product' || activeTab === 'simulator') && (
        <div className="w-80 border-l border-slate-100 bg-white p-10 hidden xl:block flex flex-col gap-10">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Hierarchy insights</h3>
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-4xl font-black text-slate-950 tracking-tighter">{projectState.levels.length}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Levels defined</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-4xl font-black text-slate-950 tracking-tighter">{projectState.paths.length}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active triggers</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Agency risk spread</h4>
            <div className="space-y-5">
              {projectState.levels.map(l => (
                <div key={l.id} className="flex items-center gap-4">
                  <div className="text-[10px] font-bold text-slate-400 w-6">L{l.rank}</div>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full brand-gradient transition-all duration-1000 ease-out" 
                      style={{ width: `${(l.rank + 1) * 20}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto p-8 rounded-[2rem] bg-slate-950 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 brand-gradient blur-3xl opacity-20 -mr-16 -mt-16 group-hover:opacity-40 transition-opacity"></div>
            <h4 className="font-extrabold text-sm mb-3">Optimization tip</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {activeTab === 'product' ? 'Paste a comprehensive PRD including edge cases to get more precise escalation triggers.' : 
               activeTab === 'simulator' ? 'Use the sample probes on the right to quickly test how the agent handles unauthorized requests.' :
               'Consider adding a "Confidence Threshold" trigger to automatically transition from L3 to L1.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
