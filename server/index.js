import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { analyzeObject, generateBlueprint, chatWithAssistant } from './aiService.js';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'RE:BOX',
    version: '1.0.0',
    aiEngine: process.env.GEMINI_API_KEY ? 'gemini-vision-enabled' : 'smart-taxonomy-engine',
    timestamp: new Date().toISOString()
  });
});

// Object Analysis API (Step 1 -> Step 2 & 3)
app.post('/api/analyze-object', async (req, res) => {
  try {
    const { imageBase64, description, fileName } = req.body;

    // Validate that either an image or a description is provided
    if (!imageBase64 && (!description || description.trim().length === 0)) {
      return res.status(400).json({
        error: "We couldn't understand this object. Try uploading a clearer photo or typing a brief description."
      });
    }

    const result = await analyzeObject({ imageBase64, description, fileName });
    res.json(result);
  } catch (error) {
    console.error('Error analyzing object:', error);
    res.status(500).json({
      error: "We couldn't analyze this object right now. Please try again or provide a short description."
    });
  }
});

// Blueprint Generation API (Step 4 -> Step 5)
app.post('/api/generate-blueprint', async (req, res) => {
  try {
    const { ideaId, objectName, material } = req.body;
    const blueprint = await generateBlueprint({ ideaId, objectName, material });
    res.json(blueprint);
  } catch (error) {
    console.error('Error generating blueprint:', error);
    res.status(500).json({
      error: "Failed to generate instructions for this project. Please try again."
    });
  }
});

// Personal AI Assistant Chat API
app.post('/api/assistant-chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Please provide a question or topic." });
    }
    const result = await chatWithAssistant({ message, history });
    res.json(result);
  } catch (error) {
    console.error('Error in assistant chat:', error);
    res.status(500).json({
      reply: "I'm having trouble connecting right now, but feel free to explore our step-by-step guides or check the materials section!",
      source: 'fallback'
    });
  }
});

// Mock Auth Database / User Sessions
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
function getUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUser = [
      {
        id: "usr_google_default",
        name: "Alex Green",
        email: "alex.green@gmail.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        provider: "google",
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        bio: "Upcycling enthusiast & zero-waste home maker.",
        stats: {
          itemsUpcycled: 6,
          co2AvoidedKg: 5.4,
          projectsCompleted: 3,
          hoursCrafted: 8.5
        }
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUser, null, 2), 'utf-8');
    return defaultUser;
  }
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// Google Account Login / Registration
app.post('/api/auth/google-login', (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    const users = getUsers();
    
    // Check if user exists
    let user = users.find(u => u.email === (email || "alex.green@gmail.com"));
    
    if (!user) {
      user = {
        id: `usr_google_${Date.now()}`,
        name: name || "Google User",
        email: email || "alex.green@gmail.com",
        avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        provider: "google",
        joinedAt: new Date().toISOString(),
        bio: "Passionate about circular design and creative reuse.",
        stats: {
          itemsUpcycled: 1,
          co2AvoidedKg: 0.9,
          projectsCompleted: 1,
          hoursCrafted: 1.5
        }
      };
      users.push(user);
      saveUsers(users);
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: "Failed to authenticate with Google." });
  }
});

// Standard Email/Password Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });
    
    const users = getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Auto-create for friendly demo experience
      user = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        provider: "email",
        joinedAt: new Date().toISOString(),
        bio: "Creative reuse maker.",
        stats: {
          itemsUpcycled: 1,
          co2AvoidedKg: 0.85,
          projectsCompleted: 1,
          hoursCrafted: 1.0
        }
      };
      users.push(user);
      saveUsers(users);
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Failed to sign in." });
  }
});

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });
    
    const users = getUsers();
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name || email}`,
      provider: "email",
      joinedAt: new Date().toISOString(),
      bio: "New upcycling creator.",
      stats: {
        itemsUpcycled: 0,
        co2AvoidedKg: 0,
        projectsCompleted: 0,
        hoursCrafted: 0
      }
    };
    users.push(newUser);
    saveUsers(users);
    
    res.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: "Failed to register account." });
  }
});

// Projects API
app.get('/api/projects', (req, res) => {
  try {
    const projects = getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: "Failed to load projects." });
  }
});

app.get('/api/projects/:id', (req, res) => {
  try {
    const project = getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: "Failed to fetch project." });
  }
});

app.post('/api/projects', (req, res) => {
  try {
    const projectData = req.body;
    if (!projectData.newProduct || !projectData.originalObject) {
      return res.status(400).json({ error: "Missing required project details." });
    }
    const created = createProject(projectData);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: "Failed to save project." });
  }
});

app.patch('/api/projects/:id', (req, res) => {
  try {
    const updated = updateProject(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Project not found." });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: "Failed to update project." });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  try {
    const success = deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Project not found." });
    }
    res.json({ success: true, message: "Project deleted." });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: "Failed to delete project." });
  }
});

// Explore Inspiration API
app.get('/api/explore', (req, res) => {
  try {
    const exploreFile = path.join(__dirname, 'data', 'exploreData.json');
    let items = [];
    if (fs.existsSync(exploreFile)) {
      items = JSON.parse(fs.readFileSync(exploreFile, 'utf-8'));
    }

    const { category, search } = req.query;

    if (category && category !== 'all') {
      items = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      items = items.filter(item =>
        item.originalObject.toLowerCase().includes(q) ||
        item.newProduct.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }

    res.json(items);
  } catch (error) {
    console.error('Error fetching explore items:', error);
    res.status(500).json({ error: "Failed to fetch inspiration catalog." });
  }
});

// Serve static files from Vite build in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`RE:BOX backend server running on http://localhost:${PORT}`);
});
