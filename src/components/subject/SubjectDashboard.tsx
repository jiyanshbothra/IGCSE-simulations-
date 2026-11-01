import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Layers, 
  Play, 
  BookOpen, 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { SubjectId } from '../../types/curriculum';
import { IGCSE_SUBJECTS } from '../../data/subjects';
import { CURRICULUM_DATA } from '../../data/curriculumData';
import { SIMULATIONS_REGISTRY } from '../../data/simulationsRegistry';

interface SubjectDashboardProps {
  subjectId: SubjectId;
  onBackToHome: () => void;
  onSelectSimulation: (simId: string) => void;
}

export const SubjectDashboard: React.FC<SubjectDashboardProps> = ({
  subjectId,
  onBackToHome,
  onSelectSimulation,
}) => {
  const [activeTab, setActiveTab] = useState<'units' | 'simulations'>('units');
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  const subject = IGCSE_SUBJECTS.find((s) => s.id === subjectId)!;
  const curriculum = CURRICULUM_DATA[subjectId] || { units: [] };

  // All simulations belonging to this subject
  const subjectSimulations = Object.values(SIMULATIONS_REGISTRY).filter(
    (sim) => sim.subjectId === subjectId
  );

  const filteredSimulations = subjectSimulations.filter(
    (sim) =>
      sim.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      sim.subtitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      sim.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Subjects</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800 text-cyan-400">
            CAIE Syllabus {subject.code}
          </span>
          <span className="text-slate-600">•</span>
          <span>{subject.syllabusYear} Examination Series</span>
        </div>
      </div>

      {/* Subject Hero Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-[#111726] to-slate-900 border border-slate-800 p-8 shadow-2xl mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cambridge IGCSE Pure Qualification</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {subject.name}
          </h1>
          <p className="text-base text-cyan-200/80 font-medium mt-2">
            {subject.tagline}
          </p>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
            {subject.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
              <strong className="text-white font-mono">{subject.unitCount}</strong> Syllabus Units
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
              <strong className="text-white font-mono">{subject.chapterCount}</strong> Chapters
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
              <strong className="text-white font-mono">{subject.simulationCount}</strong> Interactive Simulations
            </span>
            <span className="px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Syllabus Accuracy
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'units'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Syllabus Units & Chapters
          </button>
          <button
            onClick={() => setActiveTab('simulations')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'simulations'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Available Simulations ({subjectSimulations.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search within this subject..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Tab 1: Units & Chapters Accordion */}
      {activeTab === 'units' && (
        <div className="space-y-4">
          {curriculum.units.map((unit) => {
            const isExpanded = expandedUnit === unit.id || expandedUnit === null;
            return (
              <div
                key={unit.id}
                className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                  className="w-full p-5 bg-slate-900/80 hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
                        UNIT {unit.number}
                      </span>
                      <h3 className="text-base font-bold text-white">
                        {unit.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {unit.description}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="p-5 border-t border-slate-800/80 space-y-4">
                    {unit.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="p-4 rounded-xl bg-[#0c101c] border border-slate-800/80 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[11px] font-mono text-slate-400">
                              Chapter {chapter.number}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-0.5">
                              {chapter.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1">
                              {chapter.description}
                            </p>
                          </div>
                        </div>

                        {/* Concepts & Simulations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {chapter.concepts.map((concept) => (
                            <div
                              key={concept.id}
                              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                            >
                              <div>
                                <h5 className="text-xs font-bold text-slate-200">
                                  {concept.title}
                                </h5>
                                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                                  {concept.description}
                                </p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                                {concept.simulationId ? (
                                  <button
                                    onClick={() => onSelectSimulation(concept.simulationId!)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                      SIMULATIONS_REGISTRY[concept.simulationId]
                                        ? 'bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border-cyan-500/30'
                                        : 'bg-amber-950/30 hover:bg-amber-900/50 text-amber-300 hover:text-amber-200 border-amber-500/30'
                                    }`}
                                  >
                                    {SIMULATIONS_REGISTRY[concept.simulationId] ? (
                                      <>
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        <span>Launch Simulation Lab</span>
                                      </>
                                    ) : (
                                      <span>Lab in development</span>
                                    )}
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-mono text-slate-500 px-2 py-1 rounded bg-slate-950 border border-slate-800">
                                    Curriculum Track
                                  </span>
                                )}

                                <span className="text-[10px] text-slate-500 font-mono">
                                  {concept.learningObjectives.length} Obj
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: All Available Simulations Grid */}
      {activeTab === 'simulations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulations.map((sim) => (
            <div
              key={sim.id}
              className="rounded-2xl bg-gradient-to-b from-[#111726] to-[#0c101c] border border-slate-800 hover:border-cyan-500/50 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono text-cyan-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                    {sim.syllabusCode}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                    {sim.difficulty} Tier
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {sim.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {sim.subtitle}
                </p>

                <div className="mt-4 space-y-1.5 text-[11px] text-slate-300">
                  <p className="font-semibold text-slate-400 uppercase text-[10px]">Learning Objectives:</p>
                  <p className="line-clamp-2 text-slate-400">
                    • {sim.learningObjectives[0]}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  {sim.challenges.length} Challenges
                </span>
                <button
                  onClick={() => onSelectSimulation(sim.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white text-xs font-semibold border border-cyan-500/30 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Open Lab</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

