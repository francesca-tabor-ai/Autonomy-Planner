export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Autonomy Planner
          </h1>
          
          <p className="text-xl text-slate-700 mb-8 leading-relaxed">
            The professional workbench for designing, governing, and validating agentic AI systems. 
            Transform the ambiguity of natural language product requirements into a deterministic, 
            high-integrity governance framework.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Policy Synthesis
              </h2>
              <p className="text-slate-600">
                Automatically extract structured problem statements, audiences, and risk assessments 
                from unstructured PRDs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Graduated Agency
              </h2>
              <p className="text-slate-600">
                Define a tiered Autonomy Ladder (L0–L4) with granular permissions, prohibited actions, 
                and specific linguistic constraints.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Escalation Logic
              </h2>
              <p className="text-slate-600">
                Map risk-based triggers—such as confidence thresholds or specific topics—to mandatory 
                human handoffs or system exits.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Simulated Validation
              </h2>
              <p className="text-slate-600">
                Stress-test your governance in a real-time sandbox using AI-generated probes that 
                push system boundaries.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-slate-900 text-white rounded-lg">
            <p className="text-lg">
              This platform ensures that as AI moves from passive assistants to active agents, 
              it remains within a reliable, auditable, and human-centric operational envelope.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
