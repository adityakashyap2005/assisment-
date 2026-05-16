-- tasks table (core feature — does not exist yet)
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('todo','in_progress','done')) DEFAULT 'todo',
  priority TEXT CHECK (priority IN ('low','medium','high')) DEFAULT 'medium',
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- task_comments table
CREATE TABLE task_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT CHECK (type IN ('task_assigned','comment','due_soon','member_joined')) DEFAULT 'task_assigned',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for new tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Project Admins can manage all tasks in their projects
CREATE POLICY "Project admins can manage all tasks" ON tasks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM project_members 
      WHERE project_id = tasks.project_id 
      AND user_id = auth.uid() 
      AND role = 'Admin'
    )
  );

-- Members can view and update their assigned tasks
CREATE POLICY "Members can view assigned tasks" ON tasks
  FOR SELECT
  USING (
    assignee_id = auth.uid() OR created_by = auth.uid()
  );

CREATE POLICY "Members can update assigned tasks" ON tasks
  FOR UPDATE
  USING (
    assignee_id = auth.uid()
  );

-- Members can create tasks in projects they are a part of
CREATE POLICY "Members can insert tasks" ON tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_members 
      WHERE project_id = tasks.project_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can CRUD comments" ON task_comments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can see own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can mark own notifications read" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Reload the PostgREST schema cache so the API recognizes the new tables immediately
NOTIFY pgrst, 'reload schema';
