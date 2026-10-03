# RE:BOX — Give Old Things a New Identity

> “An object doesn't become useless just because its first purpose is over.  
> RE:BOX helps people discover what everyday unwanted objects can become by combining creative reuse, visualization and simple making instructions.”

---

## 🌿 Overview

People frequently discard everyday household objects—plastic bottles, worn T-shirts, cardboard boxes, tins, jars, and timber offcuts—simply because their initial utility is over. While recycling focuses primarily on disposal, downcycling, and industrial processing, **RE:BOX** is dedicated to **CREATIVE REUSE (Upcycling)**.

The central question of RE:BOX is:  
**“What can this become?”**

RE:BOX guides users through the complete human-designed journey:  
`OLD OBJECT → IDEAS → VISUALIZATION → CHOOSE → MAKE → NEW PRODUCT`

---

## ✨ Design Philosophy

- **Aesthetic**: Clean, human-designed startup prototype. No generic AI templates, no neon gradients, no glassmorphism.
- **Palette**: Warm off-white canvas (`#FAF8F5`), charcoal text (`#22252A`), and thoughtful natural green accents (`#2E6F40`).
- **Typography**: DM Sans / Inter with clean tracking and hierarchy.
- **Components**: Moderate rounded corners, subtle shadows, realistic spacing, and restrained transitions.

---

## 🚀 Key Features

### 1. Landing Page
- **Hero**: *“What if old things aren't really useless?”*
- **Supporting**: *“Turn everyday unwanted objects into useful products through creative reuse.”*
- **Interactive Before/After Slider**: Real-time slider comparing everyday waste to designed upcycled utility (e.g., Plastic Bottle → Desk Lamp, T-Shirt → Tote Bag, Cardboard Box → Desktop Organizer, Tin Can → Herb Planter).
- **Core Journey Explanation**: Capture → Discover → Visualize → Make.
- **Brand Manifesto**: *“Don't just throw it away. Give it a new identity.”*

### 2. The 6-Step Transformation Studio (Core Feature)
- **Step 1 — Capture**: Upload photos, drag-and-drop, take live camera snapshots, or pick 1-click curated everyday samples. Optional user description input.
- **Step 2 — Understand**: Displays recognized object, exact material (e.g., PET #1 Plastic, Woven Cotton), reusability rating, and structural properties.
- **Step 3 — Ideas**: Generates 3–5 practical reuse concepts with difficulty badges, estimated build times, and required tools.
- **Step 4 — Visualize**: Shows clear transformation between original object and the new identity with side-by-side or interactive split-screen comparison.
- **Step 5 — Make**: Complete practical project guide with checklist of required materials, highlighted safety precautions, and numbered step-by-step instructions with interactive progress tracking.
- **Step 6 — Save Project**: Saves project to user's portfolio with status (*In Progress* or *Completed*), personal build notes, and celebratory confetti.

### 3. Explore Catalog
- Categorized inspiration across **Plastic**, **Fabric**, **Cardboard**, **Metal**, **Glass**, and **Wood**.
- Search by keyword or filter by difficulty.
- Interactive modal to inspect transformations and launch immediately into making them.

### 4. My Projects
- Full portfolio tracking of all saved projects with *In Progress* / *Completed* badges.
- Step-by-step completion progress bar.
- Personal build notes editor and delete controls.
- Environmental impact summary (objects saved, estimated CO₂ avoided).

### 5. About Page
- Deep dive into the Creative Reuse philosophy vs. conventional downcycling.
- Material handling and workshop safety standards.

---

## 🛠 Architecture & Tech Stack

```text
Frontend (React 18 + Vite + Tailwind CSS + Lucide Icons)
      ↓
Backend API (Express REST API with JSON Database)
      ↓
AI Service Layer (Google Gemini Vision API + Smart Taxonomy Engine Fallback)
      ↓
Persistent Storage (Local JSON DB at server/data/projects.json)
```

- **Frontend**: React 18, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend API**: Node.js Express server on port 3001.
- **Database**: Local file-backed database layer (`server/db.js` & `server/data/`).
- **AI Service**: `server/aiService.js` supporting both live Gemini Vision API (via `GEMINI_API_KEY`) and an offline-resilient smart taxonomy heuristic engine covering all major material families.

---

## 🏃 Running the Application

### Option A: Standalone Server (Production Mode)
```bash
npm start
# Server starts on http://localhost:3001 serving both API and the pre-built React frontend
```

### Option B: Development Mode (Vite Hot-Reload + Backend)
In one terminal:
```bash
npm run server
# Starts Express API on http://localhost:3001
```

In a second terminal:
```bash
npm run dev
# Starts Vite dev server on http://localhost:5173 with automatic /api proxy to port 3001
```

---

## 🔒 Optional: Enabling Live Gemini API
To connect directly to Google Gemini Vision for arbitrary photo recognition:
1. Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```
2. Restart the server. If no key is set, the application automatically uses the embedded taxonomy engine so that all demos work seamlessly offline.
