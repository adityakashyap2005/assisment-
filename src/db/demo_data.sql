-- ============================================================
-- TASKFLOW — HEAVY DEMO DATA
-- ============================================================
-- HOW TO USE:
--   1. Go to Supabase Dashboard → Authentication → Users
--   2. Click "Add User" → create these 10 users with any password:
--        aryan@taskflow.dev
--        alice@taskflow.dev
--        bob@taskflow.dev
--        diana@taskflow.dev
--        carlos@taskflow.dev
--        elena@taskflow.dev
--        marcus@taskflow.dev
--        priya@taskflow.dev
--        james@taskflow.dev
--        sara@taskflow.dev
--   3. Copy each user's UUID from the Auth Users table
--   4. Paste the UUIDs below replacing the placeholder values
--   5. Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

DO $$
DECLARE

  -- ── PASTE YOUR REAL UUIDs HERE ──────────────────────────
  uid_aryan   UUID := '71aad12d-90cb-4a90-8247-828cc11821f6';
  uid_alice   UUID := '79079f84-2578-492e-8059-1f68a16ae1ed';
  uid_bob     UUID := '62471d34-a65f-40b7-80de-ff8aa2557818';
  uid_adi     UUID := '5520bb98-aa5d-469b-a6e6-2cb3d72ed96f';
  uid_carlos  UUID := 'c2efcb4b-c85e-4cc8-ad35-e0b0c0b0894c';
  uid_elena   UUID := '397f6df4-83e7-412b-8e25-7f6282770412';
  uid_marcus  UUID := 'f086a4c3-7a91-4088-8bb8-60367e2eb167';
  uid_priya   UUID := '9a630952-9073-4344-abb0-075daf9511d5';
  uid_james   UUID := '076d8d62-52b5-4174-8023-aabdad289322';
  uid_sara    UUID := '8297db48-909c-418f-933a-5b6235bbcbb5';
  -- ────────────────────────────────────────────────────────

  -- Project IDs
  p1 UUID := gen_random_uuid();  -- Nebula Sync
  p2 UUID := gen_random_uuid();  -- Aether Core
  p3 UUID := gen_random_uuid();  -- Orbital DB
  p4 UUID := gen_random_uuid();  -- Phantom UI
  p5 UUID := gen_random_uuid();  -- Helix Mobile

  -- Task IDs (tasks table — add via new_migrations.sql first)
  t01 UUID := gen_random_uuid();
  t02 UUID := gen_random_uuid();
  t03 UUID := gen_random_uuid();
  t04 UUID := gen_random_uuid();
  t05 UUID := gen_random_uuid();
  t06 UUID := gen_random_uuid();
  t07 UUID := gen_random_uuid();
  t08 UUID := gen_random_uuid();
  t09 UUID := gen_random_uuid();
  t10 UUID := gen_random_uuid();
  t11 UUID := gen_random_uuid();
  t12 UUID := gen_random_uuid();
  t13 UUID := gen_random_uuid();
  t14 UUID := gen_random_uuid();
  t15 UUID := gen_random_uuid();
  t16 UUID := gen_random_uuid();
  t17 UUID := gen_random_uuid();
  t18 UUID := gen_random_uuid();
  t19 UUID := gen_random_uuid();
  t20 UUID := gen_random_uuid();
  t21 UUID := gen_random_uuid();
  t22 UUID := gen_random_uuid();
  t23 UUID := gen_random_uuid();
  t24 UUID := gen_random_uuid();
  t25 UUID := gen_random_uuid();
  t26 UUID := gen_random_uuid();
  t27 UUID := gen_random_uuid();
  t28 UUID := gen_random_uuid();
  t29 UUID := gen_random_uuid();
  t30 UUID := gen_random_uuid();

BEGIN

-- ============================================================
-- 1. PROFILES
-- Matches user_role and user_status enums exactly
-- ============================================================
INSERT INTO profiles (id, name, role, status, avatar_color) VALUES
  (uid_aryan,  'Aryan Sharma',   'Workspace Admin',  'Online',      'var(--primary)'),
  (uid_alice,  'Alice Johnson',  'Lead Dev',         'Online',      'var(--secondary)'),
  (uid_bob,    'Bob Williams',   'Developer',        'In Meeting',  'var(--tertiary)'),
  (uid_adi,  'Adi Kashyap',     'Designer',         'Online',      'var(--primary)'),
  (uid_carlos, 'Carlos Rivera',  'Developer',        'Offline',     'var(--secondary)'),
  (uid_elena,  'Elena Patel',    'Product',          'Online',      'var(--tertiary)'),
  (uid_marcus, 'Marcus Brown',   'Developer',        'In Meeting',  'var(--primary)'),
  (uid_priya,  'Priya Nair',     'Designer',         'Online',      'var(--secondary)'),
  (uid_james,  'James O''Brien', 'Project Member',   'Offline',     'var(--tertiary)'),
  (uid_sara,   'Sara Müller',    'Product',          'Online',      'var(--primary)')
ON CONFLICT (id) DO UPDATE SET
  name         = EXCLUDED.name,
  role         = EXCLUDED.role,
  status       = EXCLUDED.status,
  avatar_color = EXCLUDED.avatar_color;


-- ============================================================
-- 2. PROJECTS  (5 projects)
-- ============================================================
INSERT INTO projects (id, name, description) VALUES
  (p1, 'Nebula Sync',
    'Real-time spatial data synchronization protocol and high-frequency state management for Aether OS.'),
  (p2, 'Aether Core',
    'Core infrastructure, API gateway, and authentication services for the Aether platform.'),
  (p3, 'Orbital DB',
    'High-performance distributed database with automatic sharding and zero-downtime migrations.'),
  (p4, 'Phantom UI',
    'Next-generation design system and component library powering all Aether OS interfaces.'),
  (p5, 'Helix Mobile',
    'Cross-platform mobile application built with React Native for iOS and Android.');


-- ============================================================
-- 3. PROJECT MEMBERS
-- Every project has an admin + a realistic set of members
-- ============================================================

-- Nebula Sync — Aryan leads, Alice + Bob + Diana + Carlos
INSERT INTO project_members (project_id, user_id, role) VALUES
  (p1, uid_aryan,  'Admin'),
  (p1, uid_alice,  'Member'),
  (p1, uid_bob,    'Member'),
  (p1, uid_adi,  'Member'),
  (p1, uid_carlos, 'Member');

-- Aether Core — Alice leads, Bob + Marcus + James + Sara
INSERT INTO project_members (project_id, user_id, role) VALUES
  (p2, uid_alice,  'Admin'),
  (p2, uid_aryan,  'Member'),
  (p2, uid_bob,    'Member'),
  (p2, uid_marcus, 'Member'),
  (p2, uid_james,  'Member'),
  (p2, uid_sara,   'Member');

-- Orbital DB — Diana leads, Bob + Carlos + Marcus
INSERT INTO project_members (project_id, user_id, role) VALUES
  (p3, uid_adi,  'Admin'),
  (p3, uid_aryan,  'Member'),
  (p3, uid_bob,    'Member'),
  (p3, uid_carlos, 'Member'),
  (p3, uid_marcus, 'Member');

-- Phantom UI — Elena leads, Diana + Priya + Sara
INSERT INTO project_members (project_id, user_id, role) VALUES
  (p4, uid_elena,  'Admin'),
  (p4, uid_adi,  'Member'),
  (p4, uid_priya,  'Member'),
  (p4, uid_sara,   'Member'),
  (p4, uid_alice,  'Member');

-- Helix Mobile — Marcus leads, Carlos + James + Priya + Elena
INSERT INTO project_members (project_id, user_id, role) VALUES
  (p5, uid_marcus, 'Admin'),
  (p5, uid_carlos, 'Member'),
  (p5, uid_james,  'Member'),
  (p5, uid_priya,  'Member'),
  (p5, uid_elena,  'Member'),
  (p5, uid_aryan,  'Member');


-- ============================================================
-- 4. MILESTONES — 5 per project = 25 total
-- Covers all 3 milestone_status enum values
-- ============================================================

-- Nebula Sync milestones
INSERT INTO milestones (project_id, title, status, progress_percentage) VALUES
  (p1, 'Core Architecture Design',       'Completed',   100),
  (p1, 'Neural Integration Layer',       'Completed',   100),
  (p1, 'Spatial Data Migration',         'In Progress',  72),
  (p1, 'Real-time Sync Engine',          'In Progress',  45),
  (p1, 'Production Deployment',          'Pending',       0);

-- Aether Core milestones
INSERT INTO milestones (project_id, title, status, progress_percentage) VALUES
  (p2, 'API Gateway Setup',              'Completed',   100),
  (p2, 'Auth Service Integration',       'Completed',   100),
  (p2, 'Rate Limiting & Security',       'In Progress',  60),
  (p2, 'Microservices Refactor',         'In Progress',  30),
  (p2, 'Load Testing & Hardening',       'Pending',       0);

-- Orbital DB milestones
INSERT INTO milestones (project_id, title, status, progress_percentage) VALUES
  (p3, 'Schema v1 Design',              'Completed',   100),
  (p3, 'Sharding Implementation',       'Completed',   100),
  (p3, 'Index Optimization Pass',       'In Progress',  85),
  (p3, 'Replication & Failover',        'In Progress',  40),
  (p3, 'Disaster Recovery Testing',     'Pending',       5);

-- Phantom UI milestones
INSERT INTO milestones (project_id, title, status, progress_percentage) VALUES
  (p4, 'Design Token System',           'Completed',   100),
  (p4, 'Core Component Library',        'Completed',   100),
  (p4, 'Accessibility Audit',           'In Progress',  55),
  (p4, 'Dark / Light Theme Engine',     'In Progress',  70),
  (p4, 'Documentation Site',            'Pending',      10);

-- Helix Mobile milestones
INSERT INTO milestones (project_id, title, status, progress_percentage) VALUES
  (p5, 'Project Scaffold & CI/CD',      'Completed',   100),
  (p5, 'Onboarding Flow (3 screens)',   'Completed',   100),
  (p5, 'Push Notification Setup',       'In Progress',  50),
  (p5, 'Offline Mode & Sync',           'In Progress',  20),
  (p5, 'App Store Submission',          'Pending',       0);


-- ============================================================
-- 5. ACTIVITIES — 30 entries spread across all projects
-- Covers all status values used in Dashboard activity feed
-- ============================================================
INSERT INTO activities (title, assignee_id, status, created_at) VALUES

  -- Recent (last 24 hrs)
  ('Homepage redesign mockup finalized',          uid_alice,  'Completed',   NOW() - INTERVAL '2 minutes'),
  ('API rate limiting middleware deployed',        uid_bob,    'Completed',   NOW() - INTERVAL '18 minutes'),
  ('Mobile nav fix blocked on iOS Safari 17',     uid_carlos, 'Blocked',     NOW() - INTERVAL '45 minutes'),
  ('Database schema migration v2.4 complete',     uid_adi,  'Completed',   NOW() - INTERVAL '1 hour'),
  ('Push notification FCM integration started',   uid_aryan,  'In Progress', NOW() - INTERVAL '2 hours'),
  ('SEO meta tags audit assigned',                uid_elena,  'Pending',     NOW() - INTERVAL '3 hours'),
  ('Accessibility audit — button contrast fixes', uid_priya,  'In Progress', NOW() - INTERVAL '4 hours'),
  ('Offline sync architecture review',            uid_marcus, 'In Progress', NOW() - INTERVAL '5 hours'),

  -- Yesterday
  ('Design token export pipeline completed',      uid_priya,  'Completed',   NOW() - INTERVAL '1 day 1 hour'),
  ('Sharding key conflict resolved in Orbital',   uid_adi,  'Completed',   NOW() - INTERVAL '1 day 3 hours'),
  ('Auth token refresh flow implemented',         uid_alice,  'Completed',   NOW() - INTERVAL '1 day 5 hours'),
  ('Onboarding screen 3 shipped to staging',      uid_marcus, 'Completed',   NOW() - INTERVAL '1 day 8 hours'),
  ('Rate limiter unit tests written',             uid_bob,    'Completed',   NOW() - INTERVAL '1 day 10 hours'),
  ('Component library Storybook deployed',        uid_elena,  'Completed',   NOW() - INTERVAL '1 day 12 hours'),
  ('Helix CI/CD pipeline green on all branches',  uid_james,  'Completed',   NOW() - INTERVAL '1 day 14 hours'),

  -- 2 days ago
  ('Nebula sync engine stress test — 92% pass',   uid_alice,  'In Progress', NOW() - INTERVAL '2 days 2 hours'),
  ('Orbital index optimization — 3 of 8 done',    uid_carlos, 'In Progress', NOW() - INTERVAL '2 days 4 hours'),
  ('Helix push notification token storage',       uid_marcus, 'Blocked',     NOW() - INTERVAL '2 days 6 hours'),
  ('Phantom dark theme — base tokens done',       uid_adi,  'Completed',   NOW() - INTERVAL '2 days 8 hours'),
  ('Aether microservices spec document drafted',  uid_sara,   'Completed',   NOW() - INTERVAL '2 days 10 hours'),

  -- 3-5 days ago
  ('Replication failover test — primary node',    uid_bob,    'Blocked',     NOW() - INTERVAL '3 days 1 hour'),
  ('SEO canonical tag audit — 40 pages done',     uid_elena,  'In Progress', NOW() - INTERVAL '3 days 6 hours'),
  ('Nebula spatial migration scripts drafted',    uid_aryan,  'In Progress', NOW() - INTERVAL '4 days 2 hours'),
  ('Aether load test — 500 RPS baseline set',     uid_james,  'Completed',   NOW() - INTERVAL '4 days 5 hours'),
  ('Helix offline mode — SQLite schema ready',    uid_carlos, 'In Progress', NOW() - INTERVAL '5 days 1 hour'),
  ('Phantom accessibility — form labels fixed',   uid_priya,  'Completed',   NOW() - INTERVAL '5 days 4 hours'),

  -- 1-2 weeks ago
  ('Orbital disaster recovery runbook written',   uid_adi,  'Pending',     NOW() - INTERVAL '8 days'),
  ('App Store metadata & screenshots prepared',   uid_marcus, 'Pending',     NOW() - INTERVAL '10 days'),
  ('Aether service mesh evaluation report',       uid_alice,  'Completed',   NOW() - INTERVAL '12 days'),
  ('Nebula production deployment plan approved',  uid_aryan,  'Pending',     NOW() - INTERVAL '14 days');


-- ============================================================
-- 6. TASKS — 30 tasks across all 5 projects
-- NOTE: Run new_migrations.sql first to create the tasks table.
-- If you haven't added the tasks table yet, comment this section out.
-- ============================================================
INSERT INTO tasks (
  id, project_id, title, description,
  status, priority, assignee_id, created_by, due_date
) VALUES

  -- ── Nebula Sync (p1) — 7 tasks ──────────────────────────
  (t01, p1,
    'Fix real-time WebSocket disconnections',
    'Clients drop connection after ~10 min idle. Investigate heartbeat logic in sync engine.',
    'in_progress', 'high', uid_alice, uid_aryan,
    CURRENT_DATE + 2),

  (t02, p1,
    'Write spatial data migration scripts',
    'Migrate 4 legacy tables to new spatial schema. Must be reversible with rollback.',
    'in_progress', 'high', uid_bob, uid_aryan,
    CURRENT_DATE + 5),

  (t03, p1,
    'Stress test sync engine at 1000 concurrent users',
    'Use k6 to simulate 1000 concurrent connections. Target: < 150ms p99 latency.',
    'todo', 'medium', uid_alice, uid_aryan,
    CURRENT_DATE + 8),

  (t04, p1,
    'Document WebSocket API endpoints',
    'Write OpenAPI spec for all WS message types. Add to Notion.',
    'todo', 'low', uid_carlos, uid_aryan,
    CURRENT_DATE + 12),

  (t05, p1,
    'Update core sync module to v3 protocol',
    'Breaking change in protocol v3. Coordinate with Aether Core team.',
    'done', 'high', uid_alice, uid_aryan,
    CURRENT_DATE - 5),

  (t06, p1,
    'SEO meta tags — all landing pages',
    'Add og:image, og:title, canonical tags to all 12 public pages.',
    'todo', 'medium', uid_elena, uid_aryan,
    CURRENT_DATE - 2),   -- ← OVERDUE

  (t07, p1,
    'Mobile navigation bug on iOS Safari 17',
    'Hamburger menu z-index breaks on Safari 17. Test on iPhone 13 and 15.',
    'todo', 'high', uid_carlos, uid_alice,
    CURRENT_DATE - 1),   -- ← OVERDUE

  -- ── Aether Core (p2) — 7 tasks ──────────────────────────
  (t08, p2,
    'Implement per-user API rate limiting',
    'Redis-backed rate limiter. Limit: 1000 req/min per user, 100 req/min per IP.',
    'in_progress', 'high', uid_bob, uid_alice,
    CURRENT_DATE + 3),

  (t09, p2,
    'Silent auth token refresh (Supabase)',
    'Handle token expiry gracefully. Retry queue for failed requests.',
    'done', 'high', uid_marcus, uid_alice,
    CURRENT_DATE - 3),

  (t10, p2,
    'Microservices split — user service',
    'Extract user management into its own service. Define gRPC contract.',
    'in_progress', 'medium', uid_james, uid_alice,
    CURRENT_DATE + 10),

  (t11, p2,
    'Load test at 500 RPS — identify bottlenecks',
    'Run Locust test. Document any endpoint > 300ms under load.',
    'todo', 'high', uid_bob, uid_alice,
    CURRENT_DATE + 7),

  (t12, p2,
    'Set up structured logging (JSON) across all services',
    'Replace console.log with pino. Add correlation IDs to every request.',
    'done', 'medium', uid_marcus, uid_aryan,
    CURRENT_DATE - 10),

  (t13, p2,
    'Security audit — OWASP top 10 checklist',
    'Go through OWASP checklist. File GitHub issues for each finding.',
    'todo', 'high', uid_sara, uid_alice,
    CURRENT_DATE - 3),   -- ← OVERDUE

  (t14, p2,
    'Add request tracing with OpenTelemetry',
    'Instrument all HTTP handlers. Export traces to Grafana Tempo.',
    'todo', 'low', uid_james, uid_alice,
    CURRENT_DATE + 20),

  -- ── Orbital DB (p3) — 5 tasks ───────────────────────────
  (t15, p3,
    'Optimize slow queries — index pass #3',
    'EXPLAIN ANALYZE the 8 slowest queries identified in last profiling session.',
    'in_progress', 'high', uid_carlos, uid_adi,
    CURRENT_DATE + 1),

  (t16, p3,
    'Replication lag alert — configure PagerDuty',
    'Alert if replica lag > 30s. Integrate with existing PagerDuty workspace.',
    'todo', 'medium', uid_bob, uid_adi,
    CURRENT_DATE + 4),

  (t17, p3,
    'Disaster recovery runbook — write and test',
    'Document full DR procedure. Do a dry-run restore from last Friday backup.',
    'todo', 'high', uid_adi, uid_adi,
    CURRENT_DATE - 4),   -- ← OVERDUE

  (t18, p3,
    'Partition large events table by month',
    'events table at 80M rows. Partition by created_at month for query performance.',
    'in_progress', 'medium', uid_marcus, uid_adi,
    CURRENT_DATE + 6),

  (t19, p3,
    'Schema migration v2.4 — add spatial indexes',
    'Add PostGIS GIST indexes to location columns. Test with spatial query suite.',
    'done', 'high', uid_adi, uid_adi,
    CURRENT_DATE - 7),

  -- ── Phantom UI (p4) — 6 tasks ───────────────────────────
  (t20, p4,
    'Dark theme — finalize all color tokens',
    'Complete the dark mode token set in tokens.json. 47 tokens remaining.',
    'in_progress', 'high', uid_priya, uid_elena,
    CURRENT_DATE + 3),

  (t21, p4,
    'Button component — all 6 variants + states',
    'Primary, secondary, ghost, danger, link, icon. Include hover, focus, disabled.',
    'done', 'high', uid_adi, uid_elena,
    CURRENT_DATE - 8),

  (t22, p4,
    'Accessibility audit — WCAG 2.1 AA pass',
    'Run axe-core on all 38 components. Fix all critical and serious violations.',
    'in_progress', 'high', uid_priya, uid_elena,
    CURRENT_DATE + 2),

  (t23, p4,
    'Modal and drawer component',
    'Animated modal with focus trap and ESC to close. Drawer with slide animation.',
    'todo', 'medium', uid_adi, uid_elena,
    CURRENT_DATE + 9),

  (t24, p4,
    'Storybook — write stories for all components',
    'Every component needs Default, Variants, and Interactive story.',
    'in_progress', 'low', uid_sara, uid_elena,
    CURRENT_DATE + 15),

  (t25, p4,
    'Publish @phantom/ui to npm registry',
    'Set up changesets, CI publish pipeline, and npm org scope.',
    'todo', 'medium', uid_alice, uid_elena,
    CURRENT_DATE + 30),

  -- ── Helix Mobile (p5) — 5 tasks ─────────────────────────
  (t26, p5,
    'Push notification — FCM token storage',
    'Store FCM token in profiles table on login. Refresh on app resume.',
    'in_progress', 'high', uid_marcus, uid_marcus,
    CURRENT_DATE + 2),

  (t27, p5,
    'Offline mode — SQLite sync queue',
    'Queue mutations locally when offline. Replay on reconnect with conflict resolution.',
    'in_progress', 'high', uid_carlos, uid_marcus,
    CURRENT_DATE + 14),

  (t28, p5,
    'Onboarding flow — analytics events',
    'Fire Amplitude events on each onboarding step. Track drop-off per screen.',
    'todo', 'medium', uid_james, uid_marcus,
    CURRENT_DATE + 6),

  (t29, p5,
    'App Store screenshots — all 5 required sizes',
    'Generate screenshots for iPhone 6.7", 6.1", iPad 12.9". Use Fastlane.',
    'todo', 'medium', uid_priya, uid_marcus,
    CURRENT_DATE - 1),   -- ← OVERDUE

  (t30, p5,
    'Crash reporting — integrate Sentry',
    'Add Sentry React Native SDK. Set up alerts for crash rate > 0.1%.',
    'done', 'high', uid_marcus, uid_marcus,
    CURRENT_DATE - 6);


-- ============================================================
-- 7. TASK COMMENTS — realistic threaded conversations
-- ============================================================
INSERT INTO task_comments (task_id, user_id, content, created_at) VALUES

  -- t01: WebSocket disconnections
  (t01, uid_carlos, 'Reproduced consistently. Happens exactly at 10 min idle. Looks like the server-side ping timeout.',                  NOW() - INTERVAL '3 hours'),
  (t01, uid_alice,  'Check the heartbeat interval in sync-engine/config.ts line 84. I think it''s set to 9 min.',                         NOW() - INTERVAL '2 hours 30 minutes'),
  (t01, uid_bob,    'Confirmed. Changed to 3 min ping interval in my branch. Running soak test now.',                                     NOW() - INTERVAL '1 hour'),
  (t01, uid_aryan,  'Good catch. Make sure we also handle the client-side reconnect with exponential backoff.',                            NOW() - INTERVAL '30 minutes'),

  -- t02: Migration scripts
  (t02, uid_adi,  'Can we get a staging environment clone of prod DB for testing these? Don''t want surprises.',                         NOW() - INTERVAL '1 day 4 hours'),
  (t02, uid_aryan,  'Already requested from infra team. Should be ready by EOD.',                                                          NOW() - INTERVAL '1 day 3 hours'),
  (t02, uid_bob,    'Scripts done for tables 1 and 2. Tables 3 and 4 have FK dependencies I need to resolve first.',                       NOW() - INTERVAL '6 hours'),

  -- t07: iOS Safari bug
  (t07, uid_carlos, 'Reproduced on iPhone 13 (Safari 17.2) and iPhone 15 Pro (Safari 17.4). z-index issue in the nav overlay wrapper.',   NOW() - INTERVAL '2 days 2 hours'),
  (t07, uid_alice,  'Can you share a Loom recording? I need to see if it also breaks on iPad.',                                            NOW() - INTERVAL '2 days 1 hour'),
  (t07, uid_carlos, 'Recording sent to Slack. iPad not affected — only happens in portrait mode on phone.',                                NOW() - INTERVAL '1 day 20 hours'),
  (t07, uid_adi,  'I think it''s the `position: fixed` on the nav interacting with `-webkit-overflow-scrolling`. Try isolation.',       NOW() - INTERVAL '1 day 12 hours'),

  -- t08: Rate limiting
  (t08, uid_bob,    'Redis configured in staging. Writing the Express middleware now.',                                                     NOW() - INTERVAL '1 day 8 hours'),
  (t08, uid_marcus, 'Make sure the rate limit headers (X-RateLimit-Remaining, Retry-After) are included in the response.',                 NOW() - INTERVAL '1 day 6 hours'),
  (t08, uid_bob,    'Good call. Also adding a rate limit exceeded webhook so we can monitor abuse in real time.',                          NOW() - INTERVAL '20 hours'),
  (t08, uid_alice,  'Unit tests for the middleware please — happy path and the 429 path both.',                                            NOW() - INTERVAL '4 hours'),

  -- t13: Security audit
  (t13, uid_sara,   'Started with injection and broken auth sections. Found 2 medium issues in the password reset flow.',                  NOW() - INTERVAL '4 days 2 hours'),
  (t13, uid_alice,  'File GitHub issues for each finding with CVSS score. Label them security.',                                           NOW() - INTERVAL '4 days 1 hour'),
  (t13, uid_sara,   'Done. Issues #234 and #235 filed. The password reset token doesn''t expire — that''s the bigger one.',               NOW() - INTERVAL '3 days 18 hours'),

  -- t17: DR runbook
  (t17, uid_adi,  'Dry-run restore failed — backup from 3 days ago had corrupt WAL segment. Escalating to infra.',                      NOW() - INTERVAL '3 days 5 hours'),
  (t17, uid_bob,    'Infra team says the backup agent had a misconfiguration for 2 weeks. Fixed now but we lost those backups.',           NOW() - INTERVAL '3 days 2 hours'),
  (t17, uid_adi,  'This is a P0 now. I''m writing the incident report. We need a backup verification cron ASAP.',                       NOW() - INTERVAL '2 days 22 hours'),
  (t17, uid_aryan,  'Agreed. Let''s do a post-mortem on Friday. Loop in Marcus for the cron job.',                                         NOW() - INTERVAL '2 days 20 hours'),

  -- t22: Accessibility audit
  (t22, uid_priya,  '18 critical violations found. Mostly missing aria-labels on icon buttons and low contrast on disabled states.',       NOW() - INTERVAL '1 day 16 hours'),
  (t22, uid_elena,  'Let''s prioritize the icon button fixes first — those affect keyboard users most.',                                    NOW() - INTERVAL '1 day 14 hours'),
  (t22, uid_priya,  'All icon buttons fixed. Moving to form inputs now — placeholder contrast is the main issue.',                         NOW() - INTERVAL '8 hours'),

  -- t26: Push notifications
  (t26, uid_carlos, 'FCM setup done on Android. iOS requires additional APNs certificate — waiting on Apple Developer access.',            NOW() - INTERVAL '2 days'),
  (t26, uid_marcus, 'James has the Apple Dev account access. James can you add Carlos?',                                                   NOW() - INTERVAL '1 day 22 hours'),
  (t26, uid_james,  'Done. Carlos you should have access now. The cert expires in 90 days so add a renewal reminder.',                     NOW() - INTERVAL '1 day 20 hours'),

  -- t27: Offline mode
  (t27, uid_carlos, 'SQLite schema designed. Using a mutations_queue table with operation type (insert/update/delete) + payload JSON.',    NOW() - INTERVAL '3 days 4 hours'),
  (t27, uid_marcus, 'Good approach. For conflict resolution let''s go with last-write-wins for now and revisit if users complain.',        NOW() - INTERVAL '3 days 2 hours'),
  (t27, uid_carlos, 'Makes sense. I''ll add a `synced_at` timestamp so we can detect drift.',                                              NOW() - INTERVAL '2 days 6 hours');


-- ============================================================
-- 8. NOTIFICATIONS — pre-seeded for uid_aryan (logged-in admin)
-- ============================================================
INSERT INTO notifications (user_id, title, message, type, is_read, link, created_at) VALUES

  (uid_aryan, 'Task assigned to you',
    'Alice assigned "Nebula production deployment plan" to you.',
    'task_assigned', false, '/tasks', NOW() - INTERVAL '10 minutes'),

  (uid_aryan, 'Task overdue',
    '"SEO meta tags — all landing pages" was due 2 days ago.',
    'due_soon', false, '/tasks', NOW() - INTERVAL '2 days'),

  (uid_aryan, 'Task overdue',
    '"Mobile navigation bug on iOS Safari 17" was due yesterday.',
    'due_soon', false, '/tasks', NOW() - INTERVAL '1 day'),

  (uid_aryan, 'Carlos commented on a task',
    'Carlos Rivera: "Reproduced on iPhone 13 and iPhone 15 Pro..."',
    'comment', false, '/tasks', NOW() - INTERVAL '2 days 2 hours'),

  (uid_aryan, 'New member joined Helix Mobile',
    'Priya Nair joined the Helix Mobile project.',
    'member_joined', true, '/team-management', NOW() - INTERVAL '5 days'),

  (uid_aryan, 'Milestone completed',
    'Neural Integration Layer milestone marked complete in Nebula Sync.',
    'task_assigned', true, '/project-details', NOW() - INTERVAL '7 days'),

  (uid_alice, 'Task assigned to you',
    'Aryan assigned "Fix real-time WebSocket disconnections" to you.',
    'task_assigned', false, '/tasks', NOW() - INTERVAL '3 hours'),

  (uid_alice, 'Task overdue',
    '"Security audit — OWASP top 10 checklist" was due 3 days ago.',
    'due_soon', false, '/tasks', NOW() - INTERVAL '3 days'),

  (uid_bob, 'Task assigned to you',
    'Alice assigned "API rate limiting middleware" to you.',
    'task_assigned', false, '/tasks', NOW() - INTERVAL '1 day 8 hours'),

  (uid_adi, 'Task overdue',
    '"Disaster recovery runbook" was due 4 days ago.',
    'due_soon', false, '/tasks', NOW() - INTERVAL '4 days'),

  (uid_carlos, 'Task assigned to you',
    'Marcus assigned "Offline mode SQLite sync queue" to you.',
    'task_assigned', false, '/tasks', NOW() - INTERVAL '2 days'),

  (uid_priya, 'Task assigned to you',
    'Elena assigned "Accessibility audit — WCAG 2.1 AA pass" to you.',
    'task_assigned', true, '/tasks', NOW() - INTERVAL '3 days'),

  (uid_marcus, 'Task overdue',
    '"App Store screenshots" was due yesterday.',
    'due_soon', false, '/tasks', NOW() - INTERVAL '1 day'),

  (uid_james, 'New member joined Aether Core',
    'Sara Müller joined the Aether Core project.',
    'member_joined', true, '/team-management', NOW() - INTERVAL '6 days');

END $$;
