
import React, { useState } from 'react';
import { Product, ProcessedPrdResult } from '../types';
import { processPrd } from '../services/geminiService';

interface ProductSectionProps {
  activeProduct: Product | null;
  onUpdateProduct: (product: Product, suggestions?: ProcessedPrdResult) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({ activeProduct, onUpdateProduct }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: activeProduct?.name || '',
    rawPrd: activeProduct?.rawPrd || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rawPrd) return;

    setIsProcessing(true);
    try {
      const result = await processPrd(formData.rawPrd);
      const updatedProduct: Product = {
        id: activeProduct?.id || `prod-${Date.now()}`,
        name: formData.name,
        rawPrd: formData.rawPrd,
        structuredPrd: result.structuredPrd
      };
      onUpdateProduct(updatedProduct, result);
    } catch (error) {
      console.error("Failed to process PRD:", error);
      alert("There was an error analyzing the PRD. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-12 max-w-6xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 mb-4">Product blueprint</h2>
        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
          Input your product vision. We use AI to extract governance requirements and suggest initial autonomy levels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: PRD Input Form */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 brand-gradient rounded-full"></span>
            Define Product
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product name</label>
              <input 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                placeholder="e.g. WealthBot 3000"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Raw PRD content</label>
              <textarea 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all h-64 resize-none"
                placeholder="Paste your unstructured PRD, user stories, or feature descriptions here..."
                value={formData.rawPrd}
                onChange={(e) => setFormData(prev => ({ ...prev, rawPrd: e.target.value }))}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full py-5 brand-gradient text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-indigo-100 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing PRD...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Governance
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Structured PRD Display */}
        <div className={`transition-all duration-700 ${activeProduct?.structuredPrd ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-4 grayscale'}`}>
          {!activeProduct?.structuredPrd ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
               <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-400">Governance blueprint</h4>
              <p className="text-sm text-slate-400 mt-2 font-medium">Submit a PRD to unlock structured analysis.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Problem Statement</h4>
                <p className="text-sm font-medium leading-relaxed text-slate-700">{activeProduct.structuredPrd.problemStatement}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Target Audience</h4>
                  <p className="text-sm font-bold text-indigo-600">{activeProduct.structuredPrd.targetAudience}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Risk Level</h4>
                  <p className="text-sm font-bold text-orange-600">{activeProduct.structuredPrd.riskAssessment}</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Key Features</h4>
                <ul className="space-y-3">
                  {activeProduct.structuredPrd.keyFeatures.map((f, i) => (
                    <li key={i} className="text-xs font-semibold flex items-center gap-3 text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full brand-gradient"></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">AI Insight</h4>
                 <p className="text-xs font-medium text-indigo-800 leading-relaxed italic">
                   "Based on the identified risk factors, we've initialized a Ladder with emphasis on Supervised Agency for financial intent extraction."
                 </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
