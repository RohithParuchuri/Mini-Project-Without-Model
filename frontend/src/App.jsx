import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- Page Imports ---
// Public Pages
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';

// Dashboard Components & Pages
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CommandCenter from './pages/CommandCenter';
import CaseManagement from './pages/CaseManagement';
import AIAnalysis from './pages/AIAnalysis';
import Login from './pages/Login';
import Register from './pages/Register';
import Resources from './pages/Resources';
import GetHelp from './pages/GetHelp';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AboutUs from './pages/AboutUs';

/**
 * LandingPage Wrapper
 * Combines the hero, stats, and features components into the primary entry view.
 */
const LandingPage = () => (
  <div className="min-h-screen bg-[#121212] text-[#E6E2DF]">
    {/* Background Noise Texture */}
    <div className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-15 mix-blend-overlay" />
    
    <Navbar />
    
    <main className="relative z-10">
      <Hero />
      <Stats />
      <Features />
    </main>
  </div>
);

/**
 * Main Application Component
 * Handles the high-level routing logic between the landing page and the 
 * persistent dashboard shell.
 */
export default function App() {
  return (
    <AuthProvider>
      <Router>
      <Routes>
        {/* --- Public Route --- */}
        <Route path="/" element={<LandingPage />} />

        {/* --- Authentication Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Public Support Routes --- */}
        <Route path="/resources" element={<Resources />} />
        <Route path="/get-help" element={<GetHelp />} />
        <Route path="/about-us" element={<AboutUs />} />
        
        {/* --- Admin Route --- */}
        <Route path="/admin" element={<Admin />} />

        {/* --- Dashboard Routes (Nested inside DashboardLayout) --- */}
        <Route path="/dashboard" element={<DashboardLayout />}>

          {/* Default dashboard path: /dashboard shows main Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Individual Dashboard Views */}
          <Route path="command-center" element={<CommandCenter />} />
          
          {/* Path: /dashboard/cases */}
          <Route path="cases" element={<CaseManagement />} />
          
          {/* Path: /dashboard/profile */}
          <Route path="profile" element={<Profile />} />
          
          {/* Path: /dashboard/ai-analysis OR /dashboard/ai-analysis/123
              The :id? parameter ensures the page loads even without a specific case selected.
          */}
          <Route path="ai-analysis/:id?" element={<AIAnalysis />} />

          {/* Alias route for /dashboard/analysis */}
          <Route path="analysis/:id?" element={<AIAnalysis />} />

        </Route>

        {/* --- Global Redirect --- */}
        {/* Any unknown URL will redirect the user back to the Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
    </AuthProvider>
  );
}