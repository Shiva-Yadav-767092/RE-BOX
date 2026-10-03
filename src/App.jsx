import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import WorkspacePage from './pages/WorkspacePage';
import ExplorePage from './pages/ExplorePage';
import MyProjectsPage from './pages/MyProjectsPage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import AuthModal from './components/AuthModal';
import AIAssistantModal from './components/AIAssistantModal';
import { fetchProjectsAPI } from './services/api';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [projectCount, setProjectCount] = useState(0);
  const [preselectedSampleId, setPreselectedSampleId] = useState(null);
  const [initialCameraMode, setInitialCameraMode] = useState(false);

  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rebox_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    loadProjectCount();
  }, []);

  const loadProjectCount = async () => {
    try {
      const projects = await fetchProjectsAPI();
      setProjectCount(projects ? projects.length : 0);
    } catch (e) {
      console.warn('Could not load project count:', e);
    }
  };

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem('rebox_user', JSON.stringify(authenticatedUser));
    setActivePage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rebox_user');
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartWithSample = (sampleId) => {
    setPreselectedSampleId(sampleId);
    setInitialCameraMode(false);
    setActivePage('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCameraWorkspace = () => {
    setPreselectedSampleId(null);
    setInitialCameraMode(true);
    setActivePage('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectExploreProject = (exploreItem) => {
    const sampleMap = {
      plastic: 'sample_plastic_bottle',
      fabric: 'sample_tshirt',
      cardboard: 'sample_cardboard_box',
      metal: 'sample_tin_can',
      glass: 'sample_glass_jar',
      wood: 'sample_wood_scrap'
    };
    const sId = sampleMap[exploreItem.category] || 'sample_plastic_bottle';
    setPreselectedSampleId(sId);
    setInitialCameraMode(false);
    setActivePage('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectSaved = () => {
    loadProjectCount();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-charcoal font-sans relative">
      
      {/* Sticky Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          if (page === 'workspace') {
            setPreselectedSampleId(null);
            setInitialCameraMode(false);
          }
          setActivePage(page);
        }}
        projectCount={projectCount}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Page Views */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            onStartWithSample={handleStartWithSample}
          />
        )}

        {activePage === 'workspace' && (
          <WorkspacePage
            preselectedSampleId={preselectedSampleId}
            onProjectSaved={handleProjectSaved}
            setActivePage={setActivePage}
            initialCameraMode={initialCameraMode}
          />
        )}

        {activePage === 'explore' && (
          <ExplorePage
            onSelectProjectToMake={handleSelectExploreProject}
          />
        )}

        {activePage === 'projects' && (
          <MyProjectsPage
            setActivePage={setActivePage}
            onOpenProjectWorkspace={() => {
              setActivePage('workspace');
            }}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            user={user}
            onLogout={handleLogout}
            setActivePage={setActivePage}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onStartCameraWorkspace={handleStartCameraWorkspace}
          />
        )}

        {activePage === 'about' && (
          <AboutPage
            setActivePage={setActivePage}
          />
        )}
      </main>

      {/* Floating Personal AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsAssistantOpen(true)}
          className="bg-accent hover:bg-accent-hover text-white px-4 py-3 rounded-full shadow-modal flex items-center gap-2.5 text-xs font-semibold hover:scale-105 active:scale-95 transition-all group"
          title="Open Personal AI Assistant"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <span>Ask Personal AI</span>
        </button>
      </div>

      {/* Auth Modal (Login / Register / Google Account) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Personal AI Assistant Conversational Drawer */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Footer */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}
