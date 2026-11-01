import React from 'react';
import { ArrowRight, Atom, Cpu, Dna, FlaskConical, Globe, Sigma } from 'lucide-react';
import { SubjectId } from '../../types/curriculum';
import { IGCSE_SUBJECTS } from '../../data/subjects';
import { CURRICULUM_DATA } from '../../data/curriculumData';
import { SIMULATIONS_REGISTRY } from '../../data/simulationsRegistry';

interface SubjectCardsGridProps {
  onSelectSubject: (subjectId: SubjectId) => void;
}

export const SubjectCardsGrid: React.FC<SubjectCardsGridProps> = ({ onSelectSubject }) => {
  const getSubjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'physics': return <Atom className="h-8 w-8 text-cyan-400" />;
      case 'chemistry': return <FlaskConical className="h-8 w-8 text-emerald-400" />;
      case 'biology': return <Dna className="h-8 w-8 text-lime-400" />;
      case 'environmental': return <Globe className="h-8 w-8 text-teal-400" />;
      case 'mathematics': return <Sigma className="h-8 w-8 text-indigo-400" />;
      case 'computerscience': return <Cpu className="h-8 w-8 text-rose-400" />;
    }
  };

  const getSubjectTheme = (id: SubjectId) => {
    switch (id) {
      case 'physics': return { border: 'border-cyan-500/30 hover:border-cyan-400/80', glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]', badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30', button: 'bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border-cyan-500/30' };
      case 'chemistry': return { border: 'border-emerald-500/30 hover:border-emerald-400/80', glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', button: 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/30' };
      case 'biology': return { border: 'border-lime-500/30 hover:border-lime-400/80', glow: 'group-hover:shadow-[0_0_30px_rgba(132,204,22,0.2)]', badge: 'bg-lime-500/10 text-lime-300 border-lime-500/30', button: 'bg-lime-600/20 hover:bg-lime-600 text-lime-300 hover:text-white border-lime-500/30' };
      case 'environmental': return { border: 'border-teal-500/30 hover:border-teal-400/80', glow: 'group-hover:shadow-[0_0_30px_rgba(20,184,166,0.2)]', badge: 'bg-teal-500/10 text-teal-300 border-teal-500/30', button: 'bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border-teal-500/30' };
      case 'mathematics': return { border: 'border-indigo-500/30 hover:border-indigo-400/80', glow: 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30', button: 'bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border-indigo-500/30' };
      case 'computerscience': return { border: 'border-rose-500/30 hover:border-rose-400/80', glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30', button: 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border-rose-500/30' };
    }
  };

  return (
    <section id="subjects-section" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Choose a subject</h2>
        <p className="mt-2 text-sm text-slate-400">Browse chapters and open their simulations.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {IGCSE_SUBJECTS.map((subject) => {
          const theme = getSubjectTheme(subject.id);
          const curriculum = CURRICULUM_DATA[subject.id];
          const chapterCount = curriculum.units.reduce((count, unit) => count + unit.chapters.length, 0);
          const labCount = Object.values(SIMULATIONS_REGISTRY).filter((simulation) => simulation.subjectId === subject.id).length;

          return (
            <button
              key={subject.id}
              onClick={() => onSelectSubject(subject.id)}
              className={`group flex min-h-48 flex-col justify-between rounded-2xl border bg-gradient-to-b from-[#111726] to-[#0c101c] p-5 text-left shadow-xl transition hover:-translate-y-1 ${theme.border} ${theme.glow}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90">
                    {getSubjectIcon(subject.id)}
                  </span>
                  <span className={`rounded-md border px-2.5 py-1 font-mono text-xs font-bold ${theme.badge}`}>
                    CAIE {subject.code}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white transition group-hover:text-cyan-300">{subject.name}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-slate-400">{subject.tagline}</p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4">
                <div className="flex gap-3 text-[11px] text-slate-400">
                  <span><strong className="font-mono text-white">{chapterCount}</strong> chapters</span>
                  <span><strong className="font-mono text-white">{labCount}</strong> labs</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${theme.button}`}>
                  Open subject <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
