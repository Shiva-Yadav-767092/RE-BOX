import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial realistic seed data for projects
const INITIAL_PROJECTS = [
  {
    id: "proj_seed_01",
    originalObject: "1L Clear PET Plastic Bottle",
    material: "PET Plastic (Code 1)",
    condition: "Reusable, Clean",
    newProduct: "Self-Watering Botanical Planter",
    tagline: "Sub-irrigation planter that keeps moisture balanced for herbs.",
    difficulty: "Easy",
    estimatedTime: "20–30 mins",
    status: "Completed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    imageBefore: "https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=600&q=80",
    imageAfter: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
    materialsNeeded: [
      "Empty 1L plastic bottle",
      "Cotton wick or clean strip of old T-shirt (20cm)",
      "Potting soil mix",
      "Small basil or mint seedling",
      "Box cutter or kitchen scissors"
    ],
    safetyNotes: [
      "Smooth cut plastic edges with sandpaper or cover with paper tape to prevent sharp scrapes.",
      "Always cut away from yourself on a stable cutting board."
    ],
    steps: [
      { step: 1, title: "Clean & Delabel", text: "Wash bottle thoroughly with warm soapy water and peel off adhesive labels using warm water soak.", completed: true },
      { step: 2, title: "Measure & Cut in Half", text: "Cut the bottle horizontally approximately 10cm from the top neck, creating an inverted funnel top and water reservoir base.", completed: true },
      { step: 3, title: "Thread the Wick", text: "Drill or pierce a 5mm hole in the bottle cap. Thread the cotton strip halfway through so it wicks moisture upwards.", completed: true },
      { step: 4, title: "Invert & Assemble", text: "Screw the cap back on and invert the funnel cone into the lower base reservoir.", completed: true },
      { step: 5, title: "Plant & Hydrate", text: "Fill the top chamber with potting soil, plant your herb seedling, and fill bottom reservoir with fresh water.", completed: true }
    ],
    completedStepsCount: 5,
    totalStepsCount: 5,
    userNotes: "Placed on kitchen windowsill. Basil started sprouting new leaves after 4 days! No watering needed for a week."
  },
  {
    id: "proj_seed_02",
    originalObject: "Corrugated Shipping Box (Medium)",
    material: "Recycled Kraft Corrugated Cardboard",
    condition: "Intact, Dry",
    newProduct: "Modular Desktop Stationery & Cable Organizer",
    tagline: "Sturdy tiered compartment organizer with bespoke slots.",
    difficulty: "Medium",
    estimatedTime: "35–45 mins",
    status: "In Progress",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    imageBefore: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    imageAfter: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    materialsNeeded: [
      "1 Corrugated shipping box",
      "Utility knife & metal ruler",
      "Non-toxic craft glue or hot glue",
      "Kraft paper tape",
      "Pencil"
    ],
    safetyNotes: [
      "Use a cutting mat to protect work surfaces.",
      "Keep spare fingers well behind the metal ruler when scoring."
    ],
    steps: [
      { step: 1, title: "Flatten & Disassemble", text: "Gently slice along taped seams to lay the cardboard box flat into workable panels.", completed: true },
      { step: 2, title: "Measure Base & Outer Walls", text: "Mark a 24x16cm base plate and 8cm high outer perimeter walls.", completed: true },
      { step: 3, title: "Score Dividers", text: "Cut 4 internal slot dividers with interlocking half-notches (comb joint style).", completed: true },
      { step: 4, title: "Assemble Grid", text: "Interlock the internal grid pieces and affix them to the base plate using craft glue.", completed: false },
      { step: 5, title: "Edge Finishing", text: "Cover exposed flute edges with kraft paper tape for a clean, furniture-grade finish.", completed: false }
    ],
    completedStepsCount: 3,
    totalStepsCount: 5,
    userNotes: "Finished the internal interlocking grid. Just need to glue the outer rim and tape the raw edges."
  }
];

// Initialize storage
export function initDB() {
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(INITIAL_PROJECTS, null, 2), 'utf-8');
  }
}

export function getAllProjects() {
  initDB();
  try {
    const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading projects:', err);
    return INITIAL_PROJECTS;
  }
}

export function getProjectById(id) {
  const projects = getAllProjects();
  return projects.find(p => p.id === id) || null;
}

export function createProject(projectData) {
  const projects = getAllProjects();
  const newProject = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    completedAt: projectData.status === 'Completed' ? new Date().toISOString() : null,
    completedStepsCount: projectData.steps ? projectData.steps.filter(s => s.completed).length : 0,
    totalStepsCount: projectData.steps ? projectData.steps.length : 0,
    ...projectData,
  };
  projects.unshift(newProject);
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  return newProject;
}

export function updateProject(id, updates) {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;

  const current = projects[index];
  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (updates.steps) {
    updated.completedStepsCount = updates.steps.filter(s => s.completed).length;
    updated.totalStepsCount = updates.steps.length;
    if (updated.completedStepsCount === updated.totalStepsCount && updated.totalStepsCount > 0) {
      updated.status = 'Completed';
      if (!updated.completedAt) updated.completedAt = new Date().toISOString();
    }
  }

  if (updates.status === 'Completed' && !updated.completedAt) {
    updated.completedAt = new Date().toISOString();
  }

  projects[index] = updated;
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  return updated;
}

export function deleteProject(id) {
  const projects = getAllProjects();
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
