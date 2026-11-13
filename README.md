# Beacon Bridge Academics — UK & International Virtual Classroom & LMS Platform

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-emerald.svg)](#)
[![Domain](https://img.shields.io/badge/Domain-beaconbridgeacademics.co.uk-blue.svg)](https://beaconbridgeacademics.co.uk)
[![License](https://img.shields.io/badge/License-Proprietary-slate.svg)](#)

Beacon Bridge Academics is an enterprise-grade, multi-role web-based Learning Management System and Live Virtual Classroom built for UK and International curricula (GCSE, UK A-Levels, North American AP, Canada Senior Secondary Grade 11/12, and Key Stage 3 Foundations).

It features real-time interactive virtual classrooms with WebRTC audio/video conferencing, whiteboard & slide annotations with normalized UV coordinate math, PowerPoint & PDF presentation sharing, student attendance tracking, dual-account joint registration (Student + Parent), manual UK bank tuition verification (GBP £), and role-governed portals.

---

## 🌟 Key Platform Capabilities

### 1. Interactive Live Virtual Classroom
- **Real-Time Video/Audio**: Low-latency WebRTC communications with participant spotlight, grid views, and tutor mute controls.
- **Slide Presentation Engine**: Slide navigation synchronized across all participants in real time.
- **Normalized Vector Whiteboard & Annotations**:
  - Pen, Highlighter, Eraser, Line, Arrow, Rectangle, Circle, and Color Palettes.
  - **Normalized UV Coordinate Engine (0.0 to 1.0)**: Broadcasts stroke coordinates as resolution-independent fractions, guaranteeing identical pixel-perfect alignment across mobile, tablet, and 4K displays.
  - Mid-session join replay delivering complete vector histories to late arrivals.
- **Screen Sharing**: High-resolution display and application sharing with audio pass-through.
- **Interactive Student Engagement**: Real-time chat, hand-raising queue with educator notifications, and session timers.
- **Automated Attendance Logging**: Captures entry time, duration, and participation status.

### 2. Four Dedicated Role Portals
- **Super Administrator Portal**: Platform metrics (students, tutors, parents, verified tuition), user management (create, suspend, activate), course catalog management, live class monitoring, broadcast announcements, security audit logs, platform settings, and manual UK bank payment verification with proof slip inspection.
- **Tutor / Educator Portal**: Assigned course manager, live class scheduler, learning materials uploader (PDF, revision packs, slides), student attendance sheets, coursework grading, and session recording archives.
- **Student Learning Portal**: Course progress tracking, timetable of upcoming live classes with 1-click room entry, lecture materials library, assignments & coursework submission, and attendance history.
- **Parent & Guardian Portal**: Dual-linked child account oversight, live class schedule visibility, attendance logs, coursework progress tracking, and tutor communication.

### 3. Public Website & Institutional Enrollment
- Modern UK academic design with Deep Royal Navy (`#050167`), Electric Neo-Mint (`#40ffa7`), and Ice Tint (`#f0faff`).
- Responsive Navigation with sticky offset jumping to `#about`, `#courses`, `#how-it-works`, `#faculty`, and `#faq`.
- Institutional Contact details: `info@beaconbridgeacademics.co.uk` and London UK postal coordinates.
- **Joint Registration Flow**: Creates both Student and Parent accounts simultaneously, issuing a unique UK bank payment reference (`BARC-WIRE-...`).
- Accounts remain securely locked with status `pending_verification` until the Super Administrator reviews and confirms the bank transfer slip.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Lucide Icons, Axios, Socket.IO Client |
| **Backend** | Node.js (v22), Express.js, Socket.IO, JWT, BCrypt, Morgan, Multer |
| **Database & Storage** | Supabase (PostgreSQL 15+), Supabase Storage / High-Performance Dual-Mode Store |
| **Real-Time Gateway** | WebRTC signaling, WebSocket event streaming (Rooms, Chat, Whiteboard) |
| **Production Targets**| Frontend: **Vercel** &bull; Backend: **Railway / Render** &bull; Database: **Supabase** &bull; Domain & Email: **Hostinger** |

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- Node.js v18+ or v22+
- npm v9+

### 2. Installation
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

### 3. Running the Platform
Start both server and client concurrently from the project root:
```bash
npm run dev:server    # Starts backend API & Socket.IO on http://localhost:5000
npm run dev:client    # Starts Vite React frontend on http://localhost:5173
```
Open **`http://localhost:5173`** in your browser.

---

## 🔑 Initial Production Administration Account

The database initializes with the Super Administrator credential:

| Role | Email | Initial Password | Notes |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@beaconbridgeacademics.co.uk` | `Password123!` | Change upon first client login via Settings |
| **Faculty Tutor** | `dr.sarah@beaconbridgeacademics.co.uk` | `Password123!` | Head of Mathematics & Physics |
| **Faculty Tutor** | `prof.chen@beaconbridgeacademics.co.uk` | `Password123!` | Head of Science & STEM |

*Note: All student, parent, enrollment, and payment tables are clean and ready for real customer registrations.*

---

## ☁️ Production Deployment Guide

### A. Push Codebase to GitHub
Run from Git Bash in the project root:
```bash
git add .
git commit -m "Production release: Beacon Bridge Academics LMS"
git branch -M main
git remote add origin https://github.com/YOUR_ORGANIZATION/beacon-bridge-academics.git
git push -u origin main
```

### B. Deploy Frontend to Vercel
1. In [Vercel](https://vercel.com), click **Add New > Project** and import the GitHub repository.
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
3. Add Environment Variables:
   - `VITE_API_URL`: `https://api.beaconbridgeacademics.co.uk/api` (or your Render/Railway backend URL)
   - `VITE_SOCKET_URL`: `https://api.beaconbridgeacademics.co.uk` (or your Render/Railway backend URL)
4. Click **Deploy**.

### C. Connect Hostinger Domain (`beaconbridgeacademics.co.uk`)
1. In Vercel, navigate to **Project Settings > Domains** and add:
   - `beaconbridgeacademics.co.uk`
   - `www.beaconbridgeacademics.co.uk`
2. Open your **Hostinger hPanel** > **DNS Zone**:
   - `A` Record: Name `@` &rarr; Points to `76.76.21.21`
   - `CNAME` Record: Name `www` &rarr; Points to `cname.vercel-dns.com`
3. SSL certificates will automatically provision via Vercel within minutes.

### D. Hostinger Institutional Email (`info@beaconbridgeacademics.co.uk`)
1. In Hostinger hPanel &rarr; **Emails** &rarr; `beaconbridgeacademics.co.uk`.
2. Create `info@beaconbridgeacademics.co.uk` and `admin@beaconbridgeacademics.co.uk`.
3. Set up **Email Forwarding** to the client's preferred Gmail account.
4. In Gmail &rarr; **Settings > Accounts and Import > Send mail as**:
   - Add `info@beaconbridgeacademics.co.uk`
   - SMTP Server: `smtp.hostinger.com` | Port: `465` (SSL)
   - Enter your Hostinger email password to send institutional emails directly from Gmail.

---

&copy; 2026 Beacon Bridge Academics Ltd. All rights reserved. Registered in England & Wales.
