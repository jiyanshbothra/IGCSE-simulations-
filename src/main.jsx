import React from 'react';
import { createRoot } from 'react-dom/client';
import App, { SimulationErrorBoundary } from './App';

createRoot(document.getElementById('root')).render(<React.StrictMode><SimulationErrorBoundary><App /></SimulationErrorBoundary></React.StrictMode>);
