import React from 'react';
import { ArrowRight, Compass, Layers } from 'lucide-react';

interface HeroSectionProps {
  onExploreSubjects: () => void;
  onOpenCoverageMatrix: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreSubjects, onOpenCoverageMatrix }) => (
  <section className="relative overflow-hidden py-16 sm:py-20">
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-emerald-600/10 blur-[130px]" />
    <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Cambridge IGCSE interactive labs</p>
      <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
        Learn by <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">experimenting.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
        Choose a subject, open a chapter, and explore its simulations.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onExploreSubjects}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-cyan-600/20 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500"
        >
          <Compass className="h-4 w-4" />
          Explore subjects
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={onOpenCoverageMatrix}
          className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-5 py-3 text-sm font-medium text-indigo-200 transition hover:bg-indigo-900/50"
        >
          <Layers className="h-4 w-4 text-indigo-400" />
          Curriculum map
        </button>
      </div>
    </div>
  </section>
);
