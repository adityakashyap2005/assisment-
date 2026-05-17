-- This policy allows Global Admins (users with the 'Admin' role in the profiles table) 
-- to create, view, update, and delete ANY task in ANY project, 
-- regardless of whether they are explicitly added to the project_members table.

CREATE POLICY "Global admins can manage all tasks" ON tasks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'Admin'
    )
  );

-- Also ensure Admins can view all task comments
CREATE POLICY "Global admins can manage all comments" ON task_comments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'Admin'
    )
  );
