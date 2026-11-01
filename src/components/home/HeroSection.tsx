import React from 'react';
import { Sparkles, ArrowRight, Play, Layers, Compass, CheckCircle2 } from 'lucide-react';
import { SubjectId } from '../../types/curriculum';

interface HeroSectionProps {
  onExploreSubjects: () => void;
  onOpenFeaturedSim: () => void;
  onOpenCoverageMatrix: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreSubjects,
  onOpenFeaturedSim,
  onOpenCoverageMatrix,
}) => {
  return (
    <div className="relative pt-12 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-emerald-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-300 mb-6 shadow-lg shadow-cyan-950/40">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold text-cyan-300">Cambridge IGCSE 2026 Syllabus Ready</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Strict Syllabus-Aligned Virtual Labs</span>
        </div>

        {/* Main Catchy Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Don’t Just Read About Science.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Experiment With It.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The ultimate interactive virtual science, mathematics, and computing laboratory designed specifically for the Cambridge IGCSE curriculum.
        </p>

        {/* The 4-step Learning Journey */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-300">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-cyan-400">
            1. Concept
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-indigo-400">
            2. Predict
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-emerald-400">
            3. Experiment
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-lime-400">
            4. Understand
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreSubjects}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Compass className="w-4 h-4" />
            <span>Select a Subject Below</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenFeaturedSim}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-semibold text-sm border border-slate-700/80 hover:border-cyan-500/40 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
            <span>Launch Featured Lab: Gas Laws</span>
          </button>

          <button
            onClick={onOpenCoverageMatrix}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-200 font-medium text-sm border border-indigo-500/30 transition-all"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Syllabus Matrix</span>
          </button>
        </div>

        {/* Trust & Specification Badges */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">6 Pure Subjects</p>
              <p className="text-[11px] text-slate-400">Complete CAIE syllabus</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">Predict & Verify</p>
              <p className="text-[11px] text-slate-400">Misconception alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">Real Physics Models</p>
              <p className="text-[11px] text-slate-400">No static GIF animations</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">Paper 6 Practical</p>
              <p className="text-[11px] text-slate-400">Data collection & plots</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

