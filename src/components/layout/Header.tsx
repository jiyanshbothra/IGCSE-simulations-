import React, { useState } from 'react';
import { 
  Atom, 
  Search, 
  Github, 
  BookOpen, 
  ChevronRight, 
  Layers, 
  Sparkles,
  FlaskConical,
  Dna,
  Globe,
  Sigma,
  Cpu,
  Map,
  BriefcaseBusiness,
  X
} from 'lucide-react';
import { SubjectId } from '../../types/curriculum';
import { IGCSE_SUBJECTS } from '../../data/subjects';
import { SIMULATIONS_REGISTRY } from '../../data/simulationsRegistry';

interface HeaderProps {
  currentSubject?: SubjectId;
  currentSimId?: string;
  onNavigateHome: () => void;
  onSelectSubject: (subjectId: SubjectId) => void;
  onSelectSimulation: (simId: string) => void;
  onOpenCoverageMatrix: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSubject,
  currentSimId,
  onNavigateHome,
  onSelectSubject,
  onSelectSimulation,
  onOpenCoverageMatrix,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const activeSubjectData = IGCSE_SUBJECTS.find(s => s.id === currentSubject);
  const activeSimData = currentSimId ? SIMULATIONS_REGISTRY[currentSimId] : null;

  // Filter simulations based on search
  const filteredSims = Object.values(SIMULATIONS_REGISTRY).filter(sim => 
    sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sim.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sim.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
    sim.syllabusCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'physics': return <Atom className="w-4 h-4 text-cyan-400" />;
      case 'chemistry': return <FlaskConical className="w-4 h-4 text-emerald-400" />;
      case 'biology': return <Dna className="w-4 h-4 text-lime-400" />;
      case 'environmental': return <Globe className="w-4 h-4 text-teal-400" />;
      case 'mathematics': return <Sigma className="w-4 h-4 text-indigo-400" />;
      case 'computerscience': return <Cpu className="w-4 h-4 text-rose-400" />;
      case 'geography': return <Map className="w-4 h-4 text-green-400" />;
      case 'business': return <BriefcaseBusiness className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0d14]/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 group transition-transform active:scale-95 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all border border-cyan-400/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  IGCSE LAB
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  CAIE 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Interactive Science & Mathematics Laboratory
              </p>
            </div>
          </button>

          {/* Breadcrumb Trail */}
          {(activeSubjectData || activeSimData) && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 pl-3 border-l border-slate-800">
              <button 
                onClick={onNavigateHome}
                className="hover:text-slate-200 transition-colors"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              
              {activeSubjectData && (
                <button
                  onClick={() => onSelectSubject(activeSubjectData.id)}
                  className={`flex items-center gap-1.5 font-medium hover:text-white transition-colors ${!activeSimData ? 'text-cyan-400' : ''}`}
                >
                  {getSubjectIcon(activeSubjectData.id)}
                  <span>{activeSubjectData.name}</span>
                </button>
              )}

              {activeSimData && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-white font-medium truncate max-w-[200px]">
                    {activeSimData.title}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search Button */}
          <div className="relative">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all text-xs"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Search simulations & concepts...</span>
              <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Curriculum Coverage Matrix */}
          <button
            onClick={onOpenCoverageMatrix}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all"
            title="Cambridge Syllabus Coverage Matrix"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Syllabus Matrix</span>
          </button>

          {/* Subject Navigation Menu */}
          <div className="hidden lg:flex items-center gap-1 border-l border-slate-800 pl-3">
            {IGCSE_SUBJECTS.map((sub) => {
              const isSelected = sub.id === currentSubject;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubject(sub.id)}
                  className={`p-1.5 rounded-lg transition-all ${
                    isSelected 
                      ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-600' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                  title={`${sub.name} (${sub.code})`}
                >
                  {getSubjectIcon(sub.id)}
                </button>
              );
            })}
          </div>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/jiyanshbothra/IGCSE-simulations-.git"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Quick Search Modal / Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl bg-[#0f1422] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, learning objective, syllabus code (e.g. 0625, titration, gas laws)..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                autoFocus
              />
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-3 space-y-2">
              {filteredSims.length > 0 ? (
                filteredSims.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => {
                      onSelectSimulation(sim.id);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all flex items-start justify-between gap-4 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                          {sim.syllabusCode}
                        </span>
                        <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {sim.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {sim.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sim.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </button>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No simulations found matching "{searchQuery}". Try searching for "gas", "titration", "cell", or "logic".
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

