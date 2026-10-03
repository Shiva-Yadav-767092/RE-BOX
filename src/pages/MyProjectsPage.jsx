import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, PlusCircle, CheckCircle2, Clock, Trash2, Edit3, 
  ExternalLink, ChevronRight, Leaf, ShieldCheck, ArrowRight, Eye
} from 'lucide-react';
import { fetchProjectsAPI, updateProjectAPI, deleteProjectAPI } from '../services/api';
import confetti from 'canvas-confetti';

export default function MyProjectsPage({ setActivePage, onOpenProjectWorkspace }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'In Progress', 'Completed'
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNoteText, setTempNoteText] = useState('');
  const [activeProjectGuide, setActiveProjectGuide] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProjectsAPI();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (project) => {
    const newStatus = project.status === 'Completed' ? 'In Progress' : 'Completed';
    try {
      const updated = await updateProjectAPI(project.id, {
        status: newStatus,
        completedAt: newStatus === 'Completed' ? new Date().toISOString() : null
      });

      if (newStatus === 'Completed') {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, status: newStatus } : p));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
    try {
      await deleteProjectAPI(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      if (activeProjectGuide?.id === id) setActiveProjectGuide(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleSaveNote = async (id) => {
    try {
      await updateProjectAPI(id, { userNotes: tempNoteText });
      setProjects(prev => prev.map(p => p.id === id ? { ...p, userNotes: tempNoteText } : p));
      setEditingNoteId(null);
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'all') return true;
    return p.status === activeFilter;
  });

  const completedCount = projects.filter(p => p.status === 'Completed').length;
  const inProgressCount = projects.filter(p => p.status === 'In Progress').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background-warm border border-charcoal-border text-charcoal text-xs font-medium">
            <FolderKanban className="w-3.5 h-3.5 text-accent" />
            <span>Project Portfolio</span>
          </div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">
            My Projects
          </h1>
          <p className="text-sm text-charcoal-muted">
            Track your ongoing builds, completed creations, and reuse impact.
          </p>
        </div>

        <button
          onClick={() => setActivePage('workspace')}
          className="self-start sm:self-auto px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-md shadow-subtle flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Start with an Object</span>
        </button>
      </div>

      {/* Impact Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-background-surface border border-charcoal-border rounded-xl p-4 shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-light text-accent flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal">{completedCount}</p>
            <p className="text-xs text-charcoal-muted">Completed Objects</p>
          </div>
        </div>

        <div className="bg-background-surface border border-charcoal-border rounded-xl p-4 shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-background-warm text-charcoal flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal">{inProgressCount}</p>
            <p className="text-xs text-charcoal-muted">In Progress</p>
          </div>
        </div>

        <div className="bg-background-surface border border-charcoal-border rounded-xl p-4 shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-background-warm text-charcoal flex items-center justify-center flex-shrink-0">
            <Leaf className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal">
              {(projects.length * 0.85).toFixed(1)} kg
            </p>
            <p className="text-xs text-charcoal-muted">Estimated CO₂ Avoided</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-charcoal-border pb-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-charcoal text-white'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-background-warm'
          }`}
        >
          All ({projects.length})
        </button>
        <button
          onClick={() => setActiveFilter('In Progress')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeFilter === 'In Progress'
              ? 'bg-charcoal text-white'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-background-warm'
          }`}
        >
          In Progress ({inProgressCount})
        </button>
        <button
          onClick={() => setActiveFilter('Completed')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeFilter === 'Completed'
              ? 'bg-charcoal text-white'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-background-warm'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-charcoal-muted">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-background-surface border border-charcoal-border rounded-xl p-12 text-center space-y-4">
          <p className="text-base font-semibold text-charcoal">
            No projects in this view yet.
          </p>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            Ready to give an everyday object a second identity? Snap a photo to get started.
          </p>
          <button
            onClick={() => setActivePage('workspace')}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-md shadow-subtle inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Start with an Object</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            const isCompleted = project.status === 'Completed';

            return (
              <div
                key={project.id}
                className="bg-background-surface border border-charcoal-border rounded-xl p-5 shadow-card hover:shadow-hover transition-shadow space-y-4"
              >
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-charcoal-subtle">
                      Created {formattedDate}
                    </span>
                    <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
                      <span>{project.originalObject}</span>
                      <span className="text-charcoal-subtle font-normal">→</span>
                      <span className="text-accent-dark">{project.newProduct}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Status Badge Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(project)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1.5 transition-colors ${
                        isCompleted
                          ? 'bg-accent-light border-accent text-accent-dark hover:bg-accent hover:text-white'
                          : 'bg-background-warm border-charcoal-border text-charcoal hover:bg-charcoal hover:text-white'
                      }`}
                      title="Click to toggle status"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{project.status}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1.5 rounded text-charcoal-subtle hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body Row: Images & Progress */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Before / After Thumbnail Pair */}
                  <div className="md:col-span-5 flex items-center gap-2">
                    <div className="w-1/2 aspect-[4/3] rounded-lg overflow-hidden border border-charcoal-border bg-charcoal relative">
                      <img
                        src={project.imageBefore}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-charcoal/80 text-white text-[9px] px-1 rounded">
                        Original
                      </span>
                    </div>

                    <span className="text-charcoal-subtle font-mono text-sm">→</span>

                    <div className="w-1/2 aspect-[4/3] rounded-lg overflow-hidden border border-charcoal-border bg-charcoal relative">
                      <img
                        src={project.imageAfter}
                        alt="New Product"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-accent text-white text-[9px] px-1 rounded">
                        New Identity
                      </span>
                    </div>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="md:col-span-7 space-y-3">
                    <p className="text-xs text-charcoal-muted leading-relaxed">
                      {project.tagline || 'Creative reuse transformation extending product lifecycle.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-subtle">
                      <span><strong>Material:</strong> {project.material}</span>
                      <span>•</span>
                      <span><strong>Time:</strong> {project.estimatedTime}</span>
                      <span>•</span>
                      <span><strong>Difficulty:</strong> {project.difficulty}</span>
                    </div>

                    {/* Step Progress Tracker */}
                    {project.steps && project.steps.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-charcoal-muted font-mono">
                          <span>Instructions Progress:</span>
                          <span>
                            {project.steps.filter(s => s.completed).length} / {project.steps.length} Steps
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-background-warm overflow-hidden border border-charcoal-borderLight">
                          <div
                            className="h-full bg-accent transition-all duration-300"
                            style={{
                              width: `${(project.steps.filter(s => s.completed).length / project.steps.length) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveProjectGuide(project)}
                        className="px-3 py-1.5 rounded bg-background-warm hover:bg-charcoal hover:text-white border border-charcoal-border text-charcoal text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Project Blueprint</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteId(project.id);
                          setTempNoteText(project.userNotes || '');
                        }}
                        className="px-3 py-1.5 rounded text-charcoal-muted hover:text-charcoal text-xs font-medium flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{project.userNotes ? 'Edit Notes' : 'Add Notes'}</span>
                      </button>
                    </div>

                  </div>

                </div>

                {/* User Notes Preview or Edit Box */}
                {editingNoteId === project.id ? (
                  <div className="p-3 rounded-lg bg-background-warm border border-charcoal-border space-y-2 text-xs">
                    <label className="font-semibold text-charcoal block">Personal Notes:</label>
                    <textarea
                      rows={2}
                      value={tempNoteText}
                      onChange={(e) => setTempNoteText(e.target.value)}
                      placeholder="Add personal notes, materials used, placement..."
                      className="w-full p-2 rounded border border-charcoal-border bg-white text-charcoal text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2.5 py-1 text-xs text-charcoal-muted"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNote(project.id)}
                        className="px-3 py-1 rounded bg-accent text-white text-xs font-semibold"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                ) : project.userNotes ? (
                  <div className="p-2.5 rounded-lg bg-background-warm/60 border border-charcoal-borderLight text-xs text-charcoal-muted italic">
                    <strong className="text-charcoal not-italic">Notes: </strong>
                    “{project.userNotes}”
                  </div>
                ) : null}

              </div>
            );
          })}
        </div>
      )}

      {/* PROJECT BLUEPRINT MODAL */}
      {activeProjectGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-deep/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-background-surface w-full max-w-2xl rounded-xl shadow-modal border border-charcoal-border overflow-hidden space-y-4 max-h-[90vh] overflow-y-auto p-6">
            
            <div className="flex items-center justify-between border-b border-charcoal-borderLight pb-3">
              <div>
                <span className="text-[11px] font-mono text-accent font-semibold uppercase">
                  Project Guide
                </span>
                <h3 className="font-bold text-xl text-charcoal">
                  MAKE YOUR {activeProjectGuide.newProduct}
                </h3>
              </div>
              <button
                onClick={() => setActiveProjectGuide(null)}
                className="text-xs px-3 py-1 rounded border border-charcoal-border hover:bg-background-warm text-charcoal font-medium"
              >
                Close
              </button>
            </div>

            {/* Checklist of Materials */}
            {activeProjectGuide.materialsNeeded && (
              <div className="p-4 rounded-lg bg-background-warm border border-charcoal-border space-y-2">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  What you'll need:
                </h4>
                <ul className="list-disc pl-5 text-xs text-charcoal space-y-1">
                  {activeProjectGuide.materialsNeeded.map((mat, idx) => (
                    <li key={idx}>{mat}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Numbered Instructions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-charcoal tracking-tight">
                Instructions:
              </h4>
              {(activeProjectGuide.steps || []).map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-charcoal-borderLight bg-white flex items-start gap-3 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-charcoal text-white flex items-center justify-center text-[10px] font-mono flex-shrink-0">
                    {step.step || idx + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-charcoal">{step.title}</h5>
                    <p className="text-charcoal-muted mt-0.5 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Safety notes */}
            {activeProjectGuide.safetyNotes && activeProjectGuide.safetyNotes.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold uppercase tracking-wider text-[10px] text-amber-950">Safety Notes:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {activeProjectGuide.safetyNotes.map((sn, idx) => (
                    <li key={idx}>{sn}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveProjectGuide(null)}
                className="px-4 py-2 bg-charcoal text-white text-xs font-semibold rounded-md"
              >
                Done Reading
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
