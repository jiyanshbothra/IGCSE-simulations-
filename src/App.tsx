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
import { SIMULATIONS_REGISTRY } from './data/simulationsRegistry';
import { IGCSE_SUBJECTS } from './data/subjects';

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
        if (SIMULATIONS_REGISTRY[parts[1]]) {
          setSelectedSimId(parts[1]);
          setSelectedSubjectId(SIMULATIONS_REGISTRY[parts[1]].subjectId);
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
    window.location.hash = `#/sim/${simId}`;
    setSelectedSimId(simId);
    if (SIMULATIONS_REGISTRY[simId]) {
      setSelectedSubjectId(SIMULATIONS_REGISTRY[simId].subjectId);
    }
    setCurrentView('simulation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render the selected simulation lab component
  const renderSimulationComponent = () => {
    switch (selectedSimId) {
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
      default:
        return <GasLawsSimulation onBack={() => navigateToSubject('physics')} />;
    }
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

