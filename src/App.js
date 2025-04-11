import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MoodboardEditor from './components/MoodboardEditor';
import { MoodboardProvider } from './contexts/MoodboardContext';

function App() {
  return (
    <MoodboardProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/moodboard/:id" element={<MoodboardEditor />} />
          </Routes>
        </div>
      </Router>
    </MoodboardProvider>
  );
}

export default App;
