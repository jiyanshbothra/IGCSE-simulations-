import React, { useState, useEffect } from 'react';
import { SubjectId } from './types/curriculum';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { SubjectCardsGrid } from './components/home/SubjectCardsGrid';
import { CurriculumMatrixModal } from './components/home/CurriculumMatrixModal';
import { SubjectDashboard } from './components/subject/SubjectDashboard';
import { GasLawsSimulation } from './components/simulations/physics/GasLawsSimulation';
import { TitrationSimulation } from './components/simulations/chemistry/TitrationSimulation';
import { MicroscopeSimulation } from './components/simulations/biology/MicroscopeSimulation';
import { PopulationDynamicsSimulation } from './components/simulations/environmental/PopulationDynamicsSimulation';
import { DynamicGrapherSimulation } from './components/simulations/mathematics/DynamicGrapherSimulation';
import { LogicGatesSimulation } from './components/simulations/computerscience/LogicGatesSimulation';
import { PrecisionMeasurementSimulation } from './components/simulations/physics/PrecisionMeasurementSimulation';
import { GenericSimulation } from './components/simulations/GenericSimulation';
import { SIMULATIONS_REGISTRY } from './data/simulationsRegistry';
import { CURRICULUM_DATA } from './data/curriculumData';
import { IGCSE_SUBJECTS } from './data/subjects';

const findCurriculumConcept = (simId: string) => {
  for (const curriculum of Object.values(CURRICULUM_DATA)) {
    for (const unit of curriculum.units) {
      for (const chapter of unit.chapters) {
        const concept = chapter.concepts.find((item) => item.simulationId === simId);
        if (concept) {
          return { subjectId: curriculum.subjectId, concept };
        }
      }
    }
  }

  return undefined;
};

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'subject' | 'simulation'>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('physics');
  const [selectedSimId, setSelectedSimId] = useState<string>('phys-gas-laws');
  const [isMatrixOpen, setIsMatrixOpen] = useState<boolean>(false);

  // Hash-based URL routing for deep linking & back/forward browser support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      const parts = hash.split('/');

      if (parts[0] === 'subject' && parts[1]) {
        const found = IGCSE_SUBJECTS.find(s => s.id === parts[1]);
        if (found) {
          setSelectedSubjectId(found.id);
          setCurrentView('subject');
        }
      } else if (parts[0] === 'sim' && parts[1]) {
        const simulation = SIMULATIONS_REGISTRY[parts[1]];
        const curriculumEntry = findCurriculumConcept(parts[1]);
        if (simulation || curriculumEntry) {
          setSelectedSimId(parts[1]);
          setSelectedSubjectId(simulation?.subjectId ?? curriculumEntry!.subjectId);
          setCurrentView('simulation');
        }
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToHome = () => {
    window.location.hash = '#/';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSubject = (subjectId: SubjectId) => {
    window.location.hash = `#/subject/${subjectId}`;
    setSelectedSubjectId(subjectId);
    setCurrentView('subject');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSimulation = (simId: string) => {
    const simulation = SIMULATIONS_REGISTRY[simId];
    const curriculumEntry = findCurriculumConcept(simId);
    if (!simulation && !curriculumEntry) return;

    window.location.hash = `#/sim/${simId}`;
    setSelectedSimId(simId);
    setSelectedSubjectId(simulation?.subjectId ?? curriculumEntry!.subjectId);
    setCurrentView('simulation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render the selected simulation lab component
  const renderSimulationComponent = () => {
    switch (selectedSimId) {
      case 'phys-vernier-caliper':
        return <PrecisionMeasurementSimulation onBack={() => navigateToSubject('physics')} />;
      case 'phys-gas-laws':
        return <GasLawsSimulation onBack={() => navigateToSubject('physics')} />;
      case 'chem-titration':
        return <TitrationSimulation onBack={() => navigateToSubject('chemistry')} />;
      case 'bio-microscope':
        return <MicroscopeSimulation onBack={() => navigateToSubject('biology')} />;
      case 'env-population-dynamics':
        return <PopulationDynamicsSimulation onBack={() => navigateToSubject('environmental')} />;
      case 'math-dynamic-grapher':
        return <DynamicGrapherSimulation onBack={() => navigateToSubject('mathematics')} />;
      case 'cs-logic-gates':
        return <LogicGatesSimulation onBack={() => navigateToSubject('computerscience')} />;
    }

    const metadata = SIMULATIONS_REGISTRY[selectedSimId];
    if (metadata) {
      return <GenericSimulation metadata={metadata} onBack={() => navigateToSubject(metadata.subjectId)} />;
    }

    const curriculumEntry = findCurriculumConcept(selectedSimId);
    return (
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-300">Simulation in development</p>
          <h1 className="mt-3 text-2xl font-bold text-white">
            {curriculumEntry?.concept.title ?? 'Simulation unavailable'}
          </h1>
          {curriculumEntry && (
            <>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{curriculumEntry.concept.description}</p>
              {curriculumEntry.concept.learningObjectives.length > 0 && (
                <div className="mt-6 rounded-xl border border-slate-800 bg-black/20 p-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-300">Learning objective</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {curriculumEntry.concept.learningObjectives[0].description}
                  </p>
                </div>
              )}
            </>
          )}
          <button
            onClick={() => navigateToSubject(curriculumEntry?.subjectId ?? selectedSubjectId)}
            className="mt-6 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-white"
          >
            Back to subject
          </button>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Global Header */}
      <Header
        currentSubject={currentView !== 'home' ? selectedSubjectId : undefined}
        currentSimId={currentView === 'simulation' ? selectedSimId : undefined}
        onNavigateHome={navigateToHome}
        onSelectSubject={navigateToSubject}
        onSelectSimulation={navigateToSimulation}
        onOpenCoverageMatrix={() => setIsMatrixOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection
              onExploreSubjects={() => {
                const el = document.getElementById('subjects-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenFeaturedSim={() => navigateToSimulation('phys-gas-laws')}
              onOpenCoverageMatrix={() => setIsMatrixOpen(true)}
            />
            <SubjectCardsGrid
              onSelectSubject={navigateToSubject}
              onSelectSimulation={navigateToSimulation}
            />
          </>
        )}

        {currentView === 'subject' && (
          <SubjectDashboard
            subjectId={selectedSubjectId}
            onBackToHome={navigateToHome}
            onSelectSimulation={navigateToSimulation}
          />
        )}

        {currentView === 'simulation' && renderSimulationComponent()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Cambridge IGCSE Curriculum Coverage Matrix Modal */}
      <CurriculumMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        onSelectSimulation={navigateToSimulation}
      />

    </div>
  );
};

export default App;

