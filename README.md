# EduLearn Global — Enterprise Learning Management System (LMS) with Live Virtual Classroom

EduLearn is a production-grade, multi-role web-based Learning Management System designed for educational institutions, training providers, tutors, students, and parents. It features an integrated real-time Live Virtual Classroom supporting WebRTC audio/video, PowerPoint & PDF slide decks, real-time synchronized whiteboard & slide annotations, screen sharing, in-class chat, hand raising, automated attendance tracking, and session recording.

---

## 🌟 Key Capabilities

### 1. Live Virtual Classroom
- **Low-Latency Communication**: Real-time WebRTC audio and video conferencing with mic/camera toggle and participant spotlight.
- **Slide Presentation Deck**: Multi-slide presentation engine rendered directly in canvas. Slide navigation synchronized across all participants.
- **Real-Time Vector Whiteboard & Annotations**:
  - Pen, Highlighter, Eraser, Line, Arrow, Rectangle, Circle, and Color Palettes.
  - **Normalized UV Coordinate Engine (0.0 to 1.0)**: Annotations are broadcast as fractions of stage dimensions, guaranteeing identical alignment regardless of client screen size or resolution.
  - Mid-session join synchronization delivering complete stroke histories to late arrivals.
- **Screen Sharing**: High-resolution application and display sharing with audio track support.
- **Interactive Student Engagement**: Real-time chat stream with timestamps, student hand-raising queue, and tutor remote mute controls.
- **Session Recording**: Integrated MediaRecorder engine capturing presentation canvas and mixed audio into video archives for student re-watching.
- **Automated Attendance Logging**: Captures entry time, duration, and participation status.

### 2. Four Dedicated Portals
- **Super Administrator Portal**: Platform metrics (students, tutors, parents, revenue), user management (CRUD, suspend, activate), course catalog management, live class monitoring, broadcast announcements, security audit logs, and system settings.
- **Tutor Portal**: Assigned course manager, live class scheduler, learning materials uploader (PPTX, PDF, worksheets), student attendance sheets, and session recording archives.
- **Student Portal**: Course progress tracking, timetable of upcoming live classes with 1-click join, course materials library, on-demand video playback player, and attendance history.
- **Parent Portal**: Link child accounts by email, monitor enrolled courses and academic progress, review live attendance logs, and access tutor contact details.

### 3. Public Marketing Website
- High-converting hero section with interactive virtual classroom preview.
- About section, Course catalog viewer, How It Works (4-step workflow), Features & Benefits, Faculty spotlight, Testimonials, FAQ accordion, and Contact form.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Lucide Icons, Axios, Socket.IO Client |
| **Backend** | Node.js (v22), Express.js, Socket.IO, JWT, BCrypt, Morgan, Multer |
| **Database & Storage** | Supabase (PostgreSQL 15+), Supabase Storage / High-Performance Dual-Mode Store |
| **Real-Time Gateway** | WebRTC signaling, WebSocket event streaming (Rooms, Chat, Whiteboard) |
| **Deployment Targets**| Frontend: **Vercel** &bull; Backend: **Railway / Render** &bull; Database: **Supabase** &bull; Domain: **Hostinger** |

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- Node.js v18+ or v22+
- npm v9+

### 2. Installation
From the project root:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configuration
- Server: Inspect `server/.env` (pre-configured with local defaults).
- Client: Inspect `client/.env` (pre-configured with Vite proxy).

### 4. Running the Platform
Start both server and client concurrently from the project root:
```bash
npm run dev:server    # Starts backend API & Socket.IO on http://localhost:5000
npm run dev:client    # Starts Vite React frontend on http://localhost:5173
```
Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Accounts & Test Credentials

The system comes pre-seeded with realistic educational data and pre-hashed passwords. On the Login page (`/login`), you can use the **1-Click Persona Buttons** or enter credentials manually:

| Role | Email | Password | Persona Details |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@edulearn.com` | `Password123!` | Marcus Sterling (Full system authority) |
| **Tutor** | `dr.sarah@edulearn.com` | `Password123!` | Dr. Sarah Jenkins (Computer Science & AI) |
| **Student** | `alex.morgan@edulearn.com` | `Password123!` | Alex Morgan (Enrolled in CS & Algorithms) |
| **Parent** | `david.morgan@edulearn.com` | `Password123!` | David Morgan (Father of Alex Morgan) |

---

## ☁️ Production Deployment Guide

### A. Database Deployment (Supabase)
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `server/database/schema.sql` and click **Run**.
4. Paste the contents of `server/database/seed.sql` and click **Run**.
5. Copy your **Project URL** and **Service Role API Key** from **Project Settings > API**.
6. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your production backend environment variables.

### B. Backend Deployment (Railway or Render)
1. Push this repository to GitHub.
2. In Railway or Render, create a **New Web Service** pointing to the `server/` root directory.
3. Set the build and start commands:
   - Build Command: `npm install`
   - Start Command: `node index.js`
4. Configure Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `<your-random-32-character-secret>`
   - `CLIENT_URL`: `https://your-custom-domain.com`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<your-service-role-key>`

### C. Frontend Deployment (Vercel)
1. In [Vercel](https://vercel.com), import the Git repository.
2. Set the **Root Directory** to `client`.
3. Framework Preset: **Vite**.
4. Set Environment Variables:
   - `VITE_API_URL`: `https://your-backend-service.up.railway.app/api`
   - `VITE_SOCKET_URL`: `https://your-backend-service.up.railway.app`
5. Click **Deploy**.

### D. Custom Domain Setup (Hostinger)
1. In your Hostinger DNS Zone Editor:
   - Add a `CNAME` record for `@` or `www` pointing to `cname.vercel-dns.com`.
   - Add a `CNAME` or `A` record for `api.yourdomain.com` pointing to your Railway/Render backend domain.
2. In Vercel, navigate to **Project Settings > Domains** and add your custom domain.
3. In Railway/Render, add your custom domain under **Networking**.
4. SSL/TLS certificates will automatically provision via Let's Encrypt.
