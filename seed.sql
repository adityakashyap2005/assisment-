-- ============================================================
-- TASKFLOW — SUPABASE SEED DATA
-- Mirrors mockData.ts exactly so your UI works immediately
-- Run in: Supabase Dashboard → SQL Editor → New Query
--
-- BEFORE RUNNING:
--   1. Create 6 users in Auth → Users → Add User
--   2. Replace the 6 UUIDs below with their real IDs
-- ============================================================

DO $$
DECLARE
  -- Replace these with real UUIDs from Supabase Auth → Users
  uid_aryan   UUID := 'aaaaaaaa-0000-0000-0000-000000000001';
  uid_alice   UUID := 'bbbbbbbb-0000-0000-0000-000000000002';
  uid_bob     UUID := 'cccccccc-0000-0000-0000-000000000003';
  uid_diana   UUID := 'dddddddd-0000-0000-0000-000000000004';
  uid_carlos  UUID := 'eeeeeeee-0000-0000-0000-000000000005';
  uid_elena   UUID := 'ffffffff-0000-0000-0000-000000000006';

  proj_nebula UUID := gen_random_uuid();
  proj_aether UUID := gen_random_uuid();
  proj_orbital UUID := gen_random_uuid();

  -- Task IDs (so we can reference them for comments)
  task1 UUID := gen_random_uuid();
  task2 UUID := gen_random_uuid();
  task3 UUID := gen_random_uuid();
  task4 UUID := gen_random_uuid();
  task5 UUID := gen_random_uuid();
  task6 UUID := gen_random_uuid();
  task7 UUID := gen_random_uuid();
  task8 UUID := gen_random_uuid();
  task9 UUID := gen_random_uuid();
  task10 UUID := gen_random_uuid();
BEGIN

  -- -------------------------------------------------------
  -- PROFILES
  -- Matches TEAM_MEMBERS in mockData.ts
  -- -------------------------------------------------------
  INSERT INTO profiles (id, name, email) VALUES
    (uid_aryan,  'Aryan Sharma',   'aryan@taskflow.com'),
    (uid_alice,  'Alice Johnson',  'alice@taskflow.com'),
    (uid_bob,    'Bob Williams',   'bob@taskflow.com'),
    (uid_diana,  'Diana Chen',     'diana@taskflow.com'),
    (uid_carlos, 'Carlos Rivera',  'carlos@taskflow.com'),
    (uid_elena,  'Elena Patel',    'elena@taskflow.com')
  ON CONFLICT (id) DO NOTHING;


  -- -------------------------------------------------------
  -- PROJECTS
  -- Matches project names used in ACTIVITIES mockData
  -- -------------------------------------------------------
  INSERT INTO projects (id, name, description) VALUES
    (proj_nebula,  'Nebula Sync',
      'Real-time spatial data synchronization protocol and high-frequency state management system for Aether OS.'),
    (proj_aether,  'Aether Core',
      'Core infrastructure and API services for the Aether OS platform.'),
    (proj_orbital, 'Orbital DB',
      'High-performance distributed database layer with automatic sharding.');


  -- -------------------------------------------------------
  -- PROJECT MEMBERS + ROLES
  -- Aryan = admin everywhere (Workspace Admin)
  -- Others = member based on TEAM_MEMBERS roles
  -- -------------------------------------------------------

  -- Nebula Sync team
  INSERT INTO project_members (project_id, user_id, role) VALUES
    (proj_nebula, uid_aryan,  'Workspace Admin'),
    (proj_nebula, uid_alice,  'Lead Dev'),
    (proj_nebula, uid_bob,    'Backend'),
    (proj_nebula, uid_carlos, 'Designer'),
    (proj_nebula, uid_elena,  'Product');

  -- Aether Core team
  INSERT INTO project_members (project_id, user_id, role) VALUES
    (proj_aether, uid_aryan,  'Workspace Admin'),
    (proj_aether, uid_bob,    'Backend'),
    (proj_aether, uid_diana,  'Frontend'),
    (proj_aether, uid_carlos, 'Designer');

  -- Orbital DB team
  INSERT INTO project_members (project_id, user_id, role) VALUES
    (proj_orbital, uid_diana,  'Frontend'),
    (proj_orbital, uid_aryan,  'Workspace Admin'),
    (proj_orbital, uid_bob,    'Backend');

END $$;
