// src/data/mockData.ts
// TaskFlow — Mock Data matching Dashboard, ProjectDetails, and TeamManagement components
 
// ============================================================
// TYPES
// ============================================================
 
export type Activity = {
  id: number;
  title: string;
  project: string;
  status: 'Completed' | 'In Progress' | 'Blocked' | 'Pending';
  timestamp: string;
  assignee: {
    name: string;
    color: string;
  };
};
 
export type Milestone = {
  id: number;
  title: string;
  dueDate: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Pending';
};
 
export type TeamMember = {
  id: number;
  name: string;
  role: string;
  status: 'Online' | 'In Meeting' | 'Focus Mode' | 'Offline';
  lastActive: string;
  color: string;
};
 
export type DashboardMetrics = {
  activeTasks: number;
  tasksDelta: number;
  systemLoad: number;
  networkSync: number;
};
 
// ============================================================
// DASHBOARD METRICS
// Used in: Dashboard.tsx — metric cards
// ============================================================
 
export const DASHBOARD_METRICS: DashboardMetrics = {
  activeTasks: 24,
  tasksDelta: 12,
  systemLoad: 68,
  networkSync: 99,
};
 
// ============================================================
// ACTIVITIES (Global Activity Stream)
// Used in: Dashboard.tsx — activity feed list
// Colors must be CSS vars: 'var(--primary)', 'var(--secondary)', 'var(--tertiary)'
// ============================================================
 
export const ACTIVITIES: Activity[] = [
  {
    id: 1,
    title: 'Homepage redesign mockup finalized',
    project: 'Nebula Sync',
    status: 'Completed',
    timestamp: '2 min ago',
    assignee: { name: 'Alice Johnson', color: 'var(--primary)' },
  },
  {
    id: 2,
    title: 'API rate limiting implementation',
    project: 'Aether Core',
    status: 'In Progress',
    timestamp: '18 min ago',
    assignee: { name: 'Bob Williams', color: 'var(--tertiary)' },
  },
  {
    id: 3,
    title: 'Mobile navigation fix on iOS Safari',
    project: 'Nebula Sync',
    status: 'Blocked',
    timestamp: '45 min ago',
    assignee: { name: 'Carlos Rivera', color: 'var(--secondary)' },
  },
  {
    id: 4,
    title: 'Database schema migration v2.4',
    project: 'Orbital DB',
    status: 'Completed',
    timestamp: '1 hr ago',
    assignee: { name: 'Diana Chen', color: 'var(--tertiary)' },
  },
  {
    id: 5,
    title: 'Push notification integration',
    project: 'Aether Core',
    status: 'In Progress',
    timestamp: '3 hrs ago',
    assignee: { name: 'Aryan Sharma', color: 'var(--primary)' },
  },
  {
    id: 6,
    title: 'SEO meta tags audit',
    project: 'Nebula Sync',
    status: 'Pending',
    timestamp: '5 hrs ago',
    assignee: { name: 'Elena Patel', color: 'var(--secondary)' },
  },
];
 
// ============================================================
// MILESTONES
// Used in: ProjectDetails.tsx — milestone cards + count badge
// progress: 0–100 (percentage for progress bar)
// ============================================================
 
export const MILESTONES: Milestone[] = [
  {
    id: 1,
    title: 'Core Attributions',
    dueDate: 'May 10, 2025',
    progress: 100,
    status: 'Completed',
  },
  {
    id: 2,
    title: 'Neural Integration',
    dueDate: 'May 18, 2025',
    progress: 72,
    status: 'In Progress',
  },
  {
    id: 3,
    title: 'Spatial Migration',
    dueDate: 'May 28, 2025',
    progress: 45,
    status: 'In Progress',
  },
  {
    id: 4,
    title: 'Reality Expansion',
    dueDate: 'Jun 10, 2025',
    progress: 10,
    status: 'Pending',
  },
  {
    id: 5,
    title: 'Nebula Expansion',
    dueDate: 'Jun 25, 2025',
    progress: 0,
    status: 'Pending',
  },
  {
    id: 6,
    title: 'Quantum Deploy',
    dueDate: 'Jul 5, 2025',
    progress: 0,
    status: 'Pending',
  },
];
 
// ============================================================
// TEAM MEMBERS
// Used in: TeamManagement.tsx (all cards) + ProjectDetails.tsx (first 4)
// role values match getRoleIcon() in TeamManagement.tsx:
//   'Workspace Admin' | 'Lead Dev' | 'Backend' | 'Frontend' | 'Designer' | 'Product'
// status values match status dot colors:
//   'Online' | 'In Meeting' | 'Focus Mode' | 'Offline'
// color: 'var(--primary)' | 'var(--secondary)' | 'var(--tertiary)'
// ============================================================
 
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: 'Aryan Sharma',
    role: 'Workspace Admin',
    status: 'Online',
    lastActive: 'Just now',
    color: 'var(--primary)',
  },
  {
    id: 2,
    name: 'Alice Johnson',
    role: 'Lead Dev',
    status: 'Online',
    lastActive: '5 min ago',
    color: 'var(--secondary)',
  },
  {
    id: 3,
    name: 'Bob Williams',
    role: 'Backend',
    status: 'Focus Mode',
    lastActive: '20 min ago',
    color: 'var(--tertiary)',
  },
  {
    id: 4,
    name: 'Diana Chen',
    role: 'Frontend',
    status: 'In Meeting',
    lastActive: '1 hr ago',
    color: 'var(--primary)',
  },
  {
    id: 5,
    name: 'Carlos Rivera',
    role: 'Designer',
    status: 'Online',
    lastActive: '30 min ago',
    color: 'var(--secondary)',
  },
  {
    id: 6,
    name: 'Elena Patel',
    role: 'Product',
    status: 'Offline',
    lastActive: '3 hrs ago',
    color: 'var(--tertiary)',
  },
];
