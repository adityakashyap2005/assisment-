# 🚀 Aethera Task Management

A modern, responsive, and dynamic SaaS Task Management application built with **React**, **TypeScript**, **Vite**, and **Supabase**. Aethera brings a seamless experience to managing projects, tasks, and teams with comprehensive Role-Based Access Control (RBAC).

---

## ✨ Features

- **🔐 Secure Authentication:** Seamless Login, Signup, and Authentication flow powered by Supabase.
- **🎭 Role-Based Access Control (RBAC):** Distinct experiences for Team Members and Administrators. Start with a dedicated Role Selection screen.
- **🛠️ Admin Operations:** Restricted administrative features including project creation and team onboarding available exclusively to Admin users.
- **📊 Interactive Dashboard:** A comprehensive overview of projects, tasks, and team metrics.
- **📋 Kanban Task Management:** Full CRUD workflows for tasks, allowing smooth transitions and state updates.
- **👥 Team Management:** Easily manage your team members, roles, and permissions.
- **⚙️ Settings & Customizations:** Configure account and notification preferences.
- **🌌 Spatial Backgrounds:** Immersive and dynamic UI with modern aesthetics, glassmorphism, and responsive design.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Routing:** React Router DOM
- **Styling:** Vanilla CSS (Modern aesthetic, glassmorphism, dynamic animations)
- **Icons:** Lucide React
- **Backend & Database:** Supabase (PostgreSQL, Auth, Realtime)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone the repository

```bash
git clone <repository-url>
cd ethara.ai-assigment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Supabase project credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

Run the following SQL migration scripts in your Supabase SQL Editor to set up the necessary tables, views, and policies:
- `schema.sql`
- `supabase_setup.sql`
- `seed.sql` (optional, for demo data)

### 5. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the port specified by Vite).

---

## 🏗️ Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components (Dashboard, Tasks, AdminOps, etc.)
│   ├── App.tsx             # Main application component & Routing
│   ├── index.css           # Global styles & design system
│   └── main.tsx            # Application entry point
├── .env.local              # Environment variables
├── package.json            # Project metadata and dependencies
└── ...
```

---

## 📜 License

This project is licensed under the MIT License.
