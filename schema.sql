-- 0. Drop existing tables and types to avoid 'already exists' errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS milestone_status CASCADE;

-- 1. Create custom enum types for roles and statuses
CREATE TYPE user_role AS ENUM ('Admin', 'Workspace Admin', 'Project Member', 'Developer', 'Designer', 'Product', 'Lead Dev');
CREATE TYPE user_status AS ENUM ('Online', 'Offline', 'In Meeting');
CREATE TYPE milestone_status AS ENUM ('Pending', 'In Progress', 'Completed');

-- 2. Create the Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role user_role DEFAULT 'Project Member',
  status user_status DEFAULT 'Offline',
  avatar_color TEXT DEFAULT 'var(--primary)',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_color)
  VALUES (new.id, split_part(new.email, '@', 1), 'var(--primary)');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Create the Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Project Members (Many-to-Many between Projects and Profiles)
CREATE TABLE project_members (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Member',
  PRIMARY KEY (project_id, user_id)
);

-- 5. Create Milestones table
CREATE TABLE milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status milestone_status DEFAULT 'Pending',
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Activities table
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for other tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read and write (simplified for testing)
CREATE POLICY "Allow all authenticated read" ON projects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all authenticated insert" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated read" ON project_members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all authenticated insert" ON project_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated read" ON milestones FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all authenticated insert" ON milestones FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated read" ON activities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all authenticated insert" ON activities FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert Initial Seed Data for UI display
INSERT INTO projects (name, description) VALUES ('Nebula Sync', 'Core Architecture and Data Migration');

-- We can't link to profiles yet because auth.users is empty, but we can seed activities without assignee
INSERT INTO activities (title, status) VALUES 
('Update core modules', 'In Progress'),
('Optimize database queries', 'Pending'),
('Refactor Spatial Dashboard components', 'Completed');

-- Reload the PostgREST schema cache so the API recognizes the new tables immediately
NOTIFY pgrst, 'reload schema';
