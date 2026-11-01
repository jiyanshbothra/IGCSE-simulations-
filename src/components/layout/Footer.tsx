import React from 'react';
import { ShieldCheck, Sparkles, BookOpen, ExternalLink, Github } from 'lucide-react';
import { IGCSE_SUBJECTS } from '../../data/subjects';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#07090e] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Platform Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">IGCSE LAB</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Virtual science, mathematics, and computing laboratory designed for the Cambridge IGCSE curriculum. Experiment, manipulate variables, and discover underlying physical laws.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Scientifically Verified Numerical Engines</span>
            </div>
          </div>

          {/* Col 2: The 6 Subjects */}
          <div className="space-y-2 md:col-span-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Syllabus Coverage
            </h4>
            <ul className="space-y-1.5 text-xs">
              {IGCSE_SUBJECTS.map((sub) => (
                <li key={sub.id} className="flex items-center justify-between">
                  <span className="text-slate-300">{sub.name}</span>
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                    CAIE {sub.code}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Pedagogical Core */}
          <div className="space-y-2 md:col-span-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Learning Principles
            </h4>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Real-Time Physics & Chemistry Solvers</li>
              <li>• Predict → Experiment → Explain Cycle</li>
              <li>• Live Multi-Variable Sensor Readouts</li>
              <li>• Synchronized Real-Time Plotting</li>
              <li>• IGCSE Paper 6 Alternative to Practical Prep</li>
              <li>• Touch & Keyboard Accessible</li>
            </ul>
          </div>

          {/* Col 4: Repository & Cambridge Disclaimer */}
          <div className="space-y-3 md:col-span-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Open Education
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open source educational project built for independent student research, homework investigation, and classroom interactive teaching.
            </p>
            <a
              href="https://github.com/jiyanshbothra/IGCSE-simulations-.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors border border-slate-700"
            >
              <Github className="w-3.5 h-3.5" />
              <span>View Source on GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 IGCSE LAB Interactive Educational Platform. Designed around official Cambridge Assessment International Education syllabuses.</p>
          <p className="font-mono">Syllabus Editions: 2023–2026/2027 CAIE Pure Series</p>
        </div>
      </div>
    </footer>
  );
};

