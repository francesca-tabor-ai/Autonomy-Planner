
import React from 'react';

type TabType = 'product' | 'ladder' | 'escalation' | 'simulator' | 'governance' | 'export';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'product', label: 'Product & PRD', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'ladder', label: 'Autonomy ladder', icon: 'M4 6h16M4 12h16M4 18h16' },
    { id: 'escalation', label: 'Escalation paths', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'simulator', label: 'Scenario simulator', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'governance', label: 'Governance & audit', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'export', label: 'Policy generator', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
  ];

  return (
    <div className="w-72 bg-white h-screen flex flex-col border-r border-slate-100">
      <div className="p-8">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-950 flex items-center gap-3">
          <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white text-sm font-black tracking-tighter">AP</span>
          </div>
          <span className="brand-text-gradient">Planner</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-slate-50 text-slate-950' 
                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50/50'
            }`}
          >
            <div className={`transition-colors ${activeTab === item.id ? 'brand-text-gradient' : 'text-slate-400 group-hover:text-slate-600'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === item.id ? 2.5 : 2} d={item.icon} />
              </svg>
            </div>
            <span className={`text-sm font-semibold tracking-tight ${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full brand-gradient shadow-sm"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-50">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">JS</div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-none">Jordan S.</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
