import React, { useState } from 'react';
import { Box, Compass, FolderKanban, Info, PlusCircle, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, projectCount = 0, user, onOpenAuth, onOpenAssistant }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Box },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'projects', label: 'My Projects', icon: FolderKanban, badge: projectCount > 0 ? projectCount : null },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-charcoal-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-md bg-accent text-white flex items-center justify-center font-mono font-bold text-sm tracking-wider shadow-subtle group-hover:bg-accent-hover transition-colors">
                RE:
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-charcoal flex items-center gap-1.5">
                  RE:BOX
                </span>
                <span className="text-[10px] text-charcoal-muted tracking-tight -mt-1 hidden sm:inline-block">
                  Creative Reuse Studio
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-charcoal text-white'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-background-warm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                      isActive ? 'bg-accent text-white' : 'bg-charcoal-border text-charcoal'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* AI Assistant Quick Nav Trigger */}
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-accent-light text-accent-dark hover:bg-accent hover:text-white transition-all ml-1 border border-accent-border"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Copilot</span>
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* User Profile or Google Sign In */}
            {user ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border transition-all ${
                  activePage === 'dashboard'
                    ? 'border-accent bg-accent-light'
                    : 'border-charcoal-border hover:bg-background-warm'
                }`}
                title="Open User Dashboard"
              >
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-charcoal max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3 py-1.5 border border-charcoal-border rounded-md bg-white hover:bg-neutral-50 text-charcoal text-xs font-semibold shadow-subtle transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign In</span>
              </button>
            )}

            {/* Primary CTA Button */}
            <button
              onClick={() => handleNavClick('workspace')}
              className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-3.5 py-2 rounded-md shadow-subtle hover:shadow transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Start Creating</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAssistant}
              className="p-1.5 rounded bg-accent-light text-accent-dark text-xs"
              title="AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNavClick('workspace')}
              className="bg-accent text-white text-xs font-medium px-2.5 py-1.5 rounded-md flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-charcoal-muted hover:text-charcoal hover:bg-background-warm"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-charcoal-border bg-background-surface px-4 pt-2 pb-4 space-y-1 shadow-card">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-charcoal text-white'
                    : 'text-charcoal hover:bg-background-warm'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('workspace')}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium py-2.5 rounded-md shadow-subtle"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start with an Object</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
