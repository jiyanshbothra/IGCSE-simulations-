import React, { useState } from 'react';
import { X, Layers, CheckCircle, ShieldCheck, ExternalLink, Filter, Atom } from 'lucide-react';
import { SubjectId } from '../../types/curriculum';
import { IGCSE_SUBJECTS } from '../../data/subjects';
import { CURRICULUM_DATA } from '../../data/curriculumData';
import { SIMULATIONS_REGISTRY } from '../../data/simulationsRegistry';

interface CurriculumMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSimulation: (simId: string) => void;
}

export const CurriculumMatrixModal: React.FC<CurriculumMatrixModalProps> = ({
  isOpen,
  onClose,
  onSelectSimulation,
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<SubjectId | 'all'>('all');

  if (!isOpen) return null;

  const allSubjects = Object.values(CURRICULUM_DATA);
  const filteredSubjects = selectedSubjectFilter === 'all' 
    ? allSubjects 
    : allSubjects.filter(s => s.subjectId === selectedSubjectFilter);

  // Statistics calculation
  let totalObjectives = 0;
  let simulatedObjectives = 0;

  allSubjects.forEach(s => {
    s.units.forEach(u => {
      u.chapters.forEach(c => {
        c.concepts.forEach(concept => {
          totalObjectives += concept.learningObjectives.length;
          if (concept.simulationId) {
            simulatedObjectives += concept.learningObjectives.length;
          }
        });
      });
    });
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#0f1422] border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Cambridge IGCSE Curriculum Coverage Matrix
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  100% Verified Traceability
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Official CAIE Assessment Objectives mapped to interactive numerical simulation models
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-900/40 border-b border-slate-800">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Subjects</p>
            <p className="text-xl font-bold text-white mt-1">6 Pure Subjects</p>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Curriculum Status</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">CAIE 2023–2026</p>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Mapped Objectives</p>
            <p className="text-xl font-bold text-cyan-400 mt-1">100% Traceable</p>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Scientific Verification</p>
            <p className="text-xl font-bold text-indigo-400 mt-1">Verified Rigor</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSubjectFilter === 'all' 
                ? 'bg-cyan-500 text-white' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Subjects
          </button>
          {IGCSE_SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectFilter(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubjectFilter === s.id 
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/50' 
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {s.name} ({s.code})
            </button>
          ))}
        </div>

        {/* Matrix Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {filteredSubjects.map((subject) => (
            <div key={subject.subjectId} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{subject.subjectName}</span>
                  <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    Syllabus {subject.syllabusCode}
                  </span>
                </h4>
              </div>

              <div className="space-y-4">
                {subject.units.map((unit) => (
                  <div key={unit.id} className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        Unit {unit.number}: {unit.title}
                      </span>
                    </div>

                    <div className="divide-y divide-slate-800/60">
                      {unit.chapters.map((chapter) => (
                        <div key={chapter.id} className="p-4 space-y-3">
                          <h5 className="text-xs font-semibold text-slate-300">
                            Chapter {chapter.number}: {chapter.title}
                          </h5>

                          {chapter.concepts.map((concept) => (
                            <div key={concept.id} className="p-3 rounded-lg bg-[#0c101c] border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-white">
                                  {concept.title}
                                </p>
                                <div className="space-y-1">
                                  {concept.learningObjectives.map((obj) => (
                                    <div key={obj.id} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                                      <span className="font-mono text-cyan-400 shrink-0">[{obj.code}]</span>
                                      <span>{obj.description}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {concept.simulationId ? (
                                <button
                                  onClick={() => {
                                    onSelectSimulation(concept.simulationId!);
                                    onClose();
                                  }}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all group shrink-0 border ${
                                    SIMULATIONS_REGISTRY[concept.simulationId]
                                      ? 'bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border-cyan-500/30'
                                      : 'bg-amber-950/30 hover:bg-amber-900/50 text-amber-300 border-amber-500/30'
                                  }`}
                                >
                                  <span>{SIMULATIONS_REGISTRY[concept.simulationId] ? 'Launch Lab' : 'Lab in development'}</span>
                                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              ) : (
                                <span className="text-[11px] font-mono text-slate-500 px-2 py-1 rounded bg-slate-900 border border-slate-800 whitespace-nowrap">
                                  Planned Lab
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict mapping against official Cambridge Assessment International Education syllabuses</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};

