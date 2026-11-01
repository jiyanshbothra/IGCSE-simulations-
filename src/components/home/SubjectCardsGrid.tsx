import React from 'react';
import { 
  Atom, 
  FlaskConical, 
  Dna, 
  Globe, 
  Sigma, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Play
} from 'lucide-react';
import { SubjectId, SubjectMetadata } from '../../types/curriculum';
import { IGCSE_SUBJECTS } from '../../data/subjects';

interface SubjectCardsGridProps {
  onSelectSubject: (subjectId: SubjectId) => void;
  onSelectSimulation: (simId: string) => void;
}

export const SubjectCardsGrid: React.FC<SubjectCardsGridProps> = ({
  onSelectSubject,
  onSelectSimulation,
}) => {
  const getSubjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'physics':
        return <Atom className="w-8 h-8 text-cyan-400" />;
      case 'chemistry':
        return <FlaskConical className="w-8 h-8 text-emerald-400" />;
      case 'biology':
        return <Dna className="w-8 h-8 text-lime-400" />;
      case 'environmental':
        return <Globe className="w-8 h-8 text-teal-400" />;
      case 'mathematics':
        return <Sigma className="w-8 h-8 text-indigo-400" />;
      case 'computerscience':
        return <Cpu className="w-8 h-8 text-rose-400" />;
    }
  };

  const getSubjectTheme = (id: SubjectId) => {
    switch (id) {
      case 'physics':
        return {
          border: 'border-cyan-500/30 hover:border-cyan-400/80',
          glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]',
          badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          btn: 'bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border-cyan-500/30',
          topics: ['Thermal Physics', 'Forces & Motion', 'Waves & Optics', 'Circuits', 'Space Physics'],
          featuredSimId: 'phys-gas-laws',
          featuredSimName: 'Gas Laws & Kinetic Theory'
        };
      case 'chemistry':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-400/80',
          glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          btn: 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/30',
          topics: ['Acid-Base Titration', 'States of Matter', 'Reaction Rates', 'Stoichiometry', 'Organic'],
          featuredSimId: 'chem-titration',
          featuredSimName: 'Volumetric Acid-Base Titration'
        };
      case 'biology':
        return {
          border: 'border-lime-500/30 hover:border-lime-400/80',
          glow: 'group-hover:shadow-[0_0_30px_rgba(132,204,22,0.25)]',
          badge: 'bg-lime-500/10 text-lime-300 border-lime-500/30',
          btn: 'bg-lime-600/20 hover:bg-lime-600 text-lime-300 hover:text-white border-lime-500/30',
          topics: ['Virtual Microscope', 'Cell Cytology', 'Osmosis & Diffusion', 'Enzymes', 'Genetics'],
          featuredSimId: 'bio-microscope',
          featuredSimName: 'Virtual Optical Microscope'
        };
      case 'environmental':
        return {
          border: 'border-teal-500/30 hover:border-teal-400/80',
          glow: 'group-hover:shadow-[0_0_30px_rgba(20,184,166,0.25)]',
          badge: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
          btn: 'bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border-teal-500/30',
          topics: ['Demographic Transition', 'Population Pyramids', 'Ecosystems', 'Climate Cycles', 'Water'],
          featuredSimId: 'env-population-dynamics',
          featuredSimName: 'Demographic Transition Model'
        };
      case 'mathematics':
        return {
          border: 'border-indigo-500/30 hover:border-indigo-400/80',
          glow: 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]',
          badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          btn: 'bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border-indigo-500/30',
          topics: ['Function Grapher', 'Tangent Slopes', 'Coordinate Geometry', 'Trigonometry', 'Vectors'],
          featuredSimId: 'math-dynamic-grapher',
          featuredSimName: 'Dynamic Function Grapher'
        };
      case 'computerscience':
        return {
          border: 'border-rose-500/30 hover:border-rose-400/80',
          glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.25)]',
          badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          btn: 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border-rose-500/30',
          topics: ['Logic Gate Breadboard', 'Truth Tables', 'CPU FDE Cycle', 'Binary Systems', 'Algorithms'],
          featuredSimId: 'cs-logic-gates',
          featuredSimName: 'Logic Gate Breadboard'
        };
    }
  };

  return (
    <section id="subjects-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Complete Cambridge Syllabus Hierarchy</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Choose Your IGCSE Subject
        </h2>
        <p className="mt-3 text-slate-400 text-sm leading-relaxed">
          Select any of the six official subjects to enter its syllabus units, chapters, and independent interactive laboratory simulations.
        </p>
      </div>

      {/* The 6 Subject Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {IGCSE_SUBJECTS.map((subject) => {
          const theme = getSubjectTheme(subject.id);
          return (
            <div
              key={subject.id}
              className={`group relative rounded-2xl bg-gradient-to-b from-[#111726] to-[#0c101c] border ${theme.border} p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${theme.glow}`}
            >
              <div>
                {/* Top Row: Icon + Syllabus Badges */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    {getSubjectIcon(subject.id)}
                  </div>
                  <div className="text-right">
                    <span className={`inline-block font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${theme.badge}`}>
                      CAIE {subject.code}
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">
                      Syllabus {subject.syllabusYear}
                    </p>
                  </div>
                </div>

                {/* Subject Title & Tagline */}
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1 line-clamp-1">
                  {subject.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {subject.description}
                </p>

                {/* Topics Preview Badges */}
                <div className="mt-4 pt-4 border-t border-slate-800/80">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                    Key Syllabus Areas:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {theme.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured Quick Lab Pill */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Play className="w-3.5 h-3.5 text-cyan-400 shrink-0 fill-cyan-400/20" />
                    <span className="text-xs text-slate-300 truncate">
                      {theme.featuredSimName}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSimulation(theme.featuredSimId);
                    }}
                    className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 shrink-0 ml-2"
                  >
                    Launch Lab →
                  </button>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span><strong className="text-white font-mono">{subject.unitCount}</strong> Units</span>
                  <span>•</span>
                  <span><strong className="text-white font-mono">{subject.simulationCount}</strong> Sims</span>
                </div>

                <button
                  onClick={() => onSelectSubject(subject.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${theme.btn}`}
                >
                  <span>Explore Subject</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};

