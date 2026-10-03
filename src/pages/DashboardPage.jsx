import React from 'react';
import { 
  User, CheckCircle2, Leaf, Clock, Award, Sparkles, Camera, PlusCircle, 
  ArrowRight, FolderKanban, ShieldCheck, LogOut, ExternalLink, Wrench 
} from 'lucide-react';

export default function DashboardPage({ user, onLogout, setActivePage, onOpenAssistant, onStartCameraWorkspace }) {
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-base text-charcoal font-semibold">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  const badges = [
    {
      icon: "🏆",
      title: "Zero Waste Pioneer",
      desc: "Completed first creative reuse transformation.",
      earned: true,
      date: "Earned Oct 2026"
    },
    {
      icon: "🧴",
      title: "Plastic Alchemist",
      desc: "Turned a PET bottle into an ambient desk lamp.",
      earned: true,
      date: "Earned Oct 2026"
    },
    {
      icon: "📦",
      title: "Cardboard Architect",
      desc: "Crafted modular interlocking storage.",
      earned: true,
      date: "Earned Sep 2026"
    },
    {
      icon: "🧵",
      title: "Textile Artisan",
      desc: "Upcycled worn cotton clothing without sewing.",
      earned: false,
      date: "Locked"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* USER PROFILE HEADER CARD */}
      <div className="bg-background-surface border border-charcoal-border rounded-2xl p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-accent shadow-subtle"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-accent border-2 border-white" title="Active"></span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight">
                  {user.name}
                </h1>
                
                {/* Google Account Verified Badge */}
                {user.provider === 'google' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-medium">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Google Account Verified</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-charcoal-muted font-mono">
                {user.email}
              </p>
              <p className="text-xs text-charcoal-muted italic pt-0.5">
                “{user.bio || 'Upcycling enthusiast & zero-waste creator.'}”
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-md border border-charcoal-border hover:bg-background-warm text-charcoal text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-charcoal-subtle" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

        {/* SUSTAINABILITY IMPACT SCORECARD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-charcoal-borderLight">
          
          <div className="p-3.5 rounded-xl bg-background-warm/70 border border-charcoal-borderLight space-y-1">
            <span className="text-[10px] font-mono uppercase text-charcoal-subtle font-semibold">
              Objects Diverted
            </span>
            <p className="text-xl sm:text-2xl font-bold text-charcoal">
              {user.stats?.itemsUpcycled || 6}
            </p>
            <span className="text-[10px] text-accent font-medium">Saved from landfill</span>
          </div>

          <div className="p-3.5 rounded-xl bg-background-warm/70 border border-charcoal-borderLight space-y-1">
            <span className="text-[10px] font-mono uppercase text-charcoal-subtle font-semibold">
              CO₂ Avoided
            </span>
            <p className="text-xl sm:text-2xl font-bold text-accent-dark">
              {user.stats?.co2AvoidedKg || 5.4} <span className="text-xs font-normal">kg</span>
            </p>
            <span className="text-[10px] text-charcoal-muted">Equivalent to 22km drive</span>
          </div>

          <div className="p-3.5 rounded-xl bg-background-warm/70 border border-charcoal-borderLight space-y-1">
            <span className="text-[10px] font-mono uppercase text-charcoal-subtle font-semibold">
              Completed Builds
            </span>
            <p className="text-xl sm:text-2xl font-bold text-charcoal">
              {user.stats?.projectsCompleted || 3}
            </p>
            <span className="text-[10px] text-charcoal-muted">Functional products in use</span>
          </div>

          <div className="p-3.5 rounded-xl bg-background-warm/70 border border-charcoal-borderLight space-y-1">
            <span className="text-[10px] font-mono uppercase text-charcoal-subtle font-semibold">
              Hours Crafted
            </span>
            <p className="text-xl sm:text-2xl font-bold text-charcoal">
              {user.stats?.hoursCrafted || 8.5} <span className="text-xs font-normal">hrs</span>
            </p>
            <span className="text-[10px] text-charcoal-muted">Mindful creative focus</span>
          </div>

        </div>

      </div>

      {/* QUICK WORKSPACE LAUNCHERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Launcher 1: Camera Access Studio */}
        <div
          onClick={onStartCameraWorkspace}
          className="bg-background-surface border border-charcoal-border rounded-xl p-5 shadow-subtle hover:shadow-card hover:border-accent cursor-pointer transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-accent-light text-accent flex items-center justify-center group-hover:scale-105 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-charcoal flex items-center justify-between">
              <span>Camera Capture Studio</span>
              <ArrowRight className="w-4 h-4 text-charcoal-subtle group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Snap a photo with your webcam or mobile camera to identify materials in real time.
            </p>
          </div>
        </div>

        {/* Launcher 2: Personal AI Assistant */}
        <div
          onClick={onOpenAssistant}
          className="bg-background-surface border border-charcoal-border rounded-xl p-5 shadow-subtle hover:shadow-card hover:border-accent cursor-pointer transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-accent text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-charcoal flex items-center justify-between">
              <span>Personal AI Assistant</span>
              <ArrowRight className="w-4 h-4 text-charcoal-subtle group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Get instant advice on cutting techniques, adhesive pairings, and custom upcycling ideas.
            </p>
          </div>
        </div>

        {/* Launcher 3: My Projects Portfolio */}
        <div
          onClick={() => setActivePage('projects')}
          className="bg-background-surface border border-charcoal-border rounded-xl p-5 shadow-subtle hover:shadow-card hover:border-accent cursor-pointer transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-background-warm text-charcoal flex items-center justify-center group-hover:scale-105 transition-transform">
            <FolderKanban className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-charcoal flex items-center justify-between">
              <span>My Projects Portfolio</span>
              <ArrowRight className="w-4 h-4 text-charcoal-subtle group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Track active builds, review step-by-step instructions, and mark creations completed.
            </p>
          </div>
        </div>

      </div>

      {/* EARNED CRAFT BADGES & ACHIEVEMENTS */}
      <div className="bg-background-surface border border-charcoal-border rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-accent" />
            <h3 className="font-bold text-sm text-charcoal uppercase tracking-wider">
              Earned Badges & Milestones
            </h3>
          </div>
          <span className="text-xs text-charcoal-muted font-mono">
            3 of 4 Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                b.earned
                  ? 'bg-background-warm/60 border-charcoal-border'
                  : 'bg-background-warm/20 border-charcoal-borderLight opacity-50'
              }`}
            >
              <div className="text-2xl">{b.icon}</div>
              <div className="space-y-0.5">
                <p className="font-bold text-charcoal text-xs">{b.title}</p>
                <p className="text-[11px] text-charcoal-muted leading-tight">{b.desc}</p>
              </div>
              <span className={`text-[10px] font-mono block ${b.earned ? 'text-accent font-semibold' : 'text-charcoal-subtle'}`}>
                {b.date}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
