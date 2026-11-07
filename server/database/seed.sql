-- ==============================================================================
-- EDULEARN LMS SEED DATA
-- Default accounts (Passwords hashed with bcrypt for 'Password123!')
-- BCrypt hash for 'Password123!' : $2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa
-- ==============================================================================

-- 1. INSERT INITIAL PROFILES
INSERT INTO profiles (id, email, password_hash, full_name, role, avatar_url, phone, bio, status) VALUES
-- Super Admin
('00000000-0000-0000-0000-000000000001', 'admin@edulearn.com', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Marcus Sterling (Super Admin)', 'superadmin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+1-800-555-0101', 'Platform Super Administrator with complete institutional oversight.', 'active'),

-- Tutors
('00000000-0000-0000-0000-000000000002', 'dr.sarah@edulearn.com', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Dr. Sarah Jenkins', 'tutor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+1-555-234-5678', 'PhD in Computer Science, 12 years experience teaching Full-Stack Systems & AI.', 'active'),
('00000000-0000-0000-0000-000000000003', 'prof.chen@edulearn.com', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Prof. Michael Chen', 'tutor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+1-555-876-5432', 'Chair of Mathematics, specialized in Linear Algebra, Calculus and Quantum Algorithms.', 'active'),

-- Students
('00000000-0000-0000-0000-000000000004', 'alex.morgan@edulearn.com', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Alex Morgan', 'student', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', '+1-555-111-2233', 'Aspiring software developer passionate about cloud computing and web platforms.', 'active'),
('00000000-0000-0000-0000-000000000005', 'sophia.williams@edulearn.com', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Sophia Williams', 'student', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+1-555-444-5566', 'High school senior preparing for university mathematics and data science competitions.', 'active'),
('00000000-0000-0000-0000-000000000006', 'lucas.patel@edulearn.com', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Lucas Patel', 'student', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+1-555-777-8899', 'Enthusiastic beginner in coding and interactive algorithms.', 'active'),

-- Parents
('00000000-0000-0000-0000-000000000007', 'david.morgan@edulearn.com', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'David Morgan', 'parent', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+1-555-999-0011', 'Parent of Alex Morgan. Monitoring academic performance and attendance.', 'active'),
('00000000-0000-0000-0000-000000000008', 'rachel.williams@edulearn.com', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Rachel Williams', 'parent', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+1-555-888-2244', 'Mother of Sophia Williams.', 'active')
ON CONFLICT (email) DO NOTHING;

-- 2. LINK PARENTS AND STUDENTS
INSERT INTO parent_student_links (parent_id, student_id, relationship, status) VALUES
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', 'Father', 'active'),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', 'Mother', 'active')
ON CONFLICT DO NOTHING;

-- 3. INSERT COURSE CATEGORIES
INSERT INTO course_categories (id, name, slug, description, icon) VALUES
('10000000-0000-0000-0000-000000000001', 'Computer Science & Software', 'computer-science', 'Modern programming languages, web engineering, cloud infrastructure and AI algorithms.', 'Code'),
('10000000-0000-0000-0000-000000000002', 'Mathematics & Analytics', 'mathematics', 'Pure and applied mathematics, statistics, calculus, and machine learning foundations.', 'Calculator'),
('10000000-0000-0000-0000-000000000003', 'Natural Sciences & Physics', 'natural-sciences', 'Physics, chemistry, and experimental sciences with live interactive diagrams.', 'Atom')
ON CONFLICT (slug) DO NOTHING;

-- 4. INSERT COURSES
INSERT INTO courses (id, title, slug, description, category_id, tutor_id, thumbnail_url, level, price, status) VALUES
('20000000-0000-0000-0000-000000000001', 'Mastering Full-Stack Web Architecture', 'mastering-full-stack-web-architecture', 'Comprehensive training in modern frontend React, Node.js backend systems, WebSockets, and cloud deployment.', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Intermediate', 299.00, 'published'),
('20000000-0000-0000-0000-000000000002', 'Linear Algebra & Calculus for Machine Learning', 'linear-algebra-calculus-for-ml', 'Deep dive into vectors, matrices, eigenvalues, gradients, and optimization mathematics for AI.', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600', 'Advanced', 349.00, 'published'),
('20000000-0000-0000-0000-000000000003', 'Data Structures & Algorithms in Practice', 'data-structures-and-algorithms', 'Master trees, graphs, dynamic programming, and complexity analysis for technical excellence.', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'All Levels', 249.00, 'published')
ON CONFLICT (slug) DO NOTHING;

-- 5. COURSE ENROLLMENTS
INSERT INTO course_enrollments (course_id, student_id, status, progress_pct) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'enrolled', 65),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'enrolled', 80),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'enrolled', 30),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'enrolled', 15)
ON CONFLICT DO NOTHING;

-- 6. SCHEDULED & LIVE CLASSES
INSERT INTO classes (id, course_id, tutor_id, title, description, scheduled_at, duration_minutes, status, meeting_room_id, presentation_url, presentation_pages) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Live Workshop: Real-Time WebSockets & Interactive Canvases', 'Building real-time bi-directional collaborative canvas tools with WebSockets and React.', NOW() + INTERVAL '1 hour', 75, 'scheduled', 'ROOM-CS101-LIVE', '/slides/sample-presentation.pdf', 6),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Eigenvalues & Matrix Decomposition Deep Dive', 'Exploring SVD and principal components with real-world interactive whiteboard derivations.', NOW() + INTERVAL '1 day', 90, 'scheduled', 'ROOM-MATH301-LIVE', '/slides/sample-presentation.pdf', 8),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Foundations of Modern Node.js Architecture', 'Recorded class covering event loops, asynchronous streams and Express middleware.', NOW() - INTERVAL '3 days', 60, 'completed', 'ROOM-CS101-REC1', '/slides/sample-presentation.pdf', 5)
ON CONFLICT DO NOTHING;

-- 7. LEARNING MATERIALS
INSERT INTO learning_materials (course_id, class_id, uploader_id, title, file_url, file_type, file_size, is_presentation) VALUES
('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'WebSocket Architecture & Canvas Sync Slides.pdf', '/slides/sample-presentation.pdf', 'pdf', 3145728, true),
('20000000-0000-0000-0000-000000000001', NULL, '00000000-0000-0000-0000-000000000002', 'Full-Stack Developer Cheat Sheet.pdf', '/materials/fullstack-cheatsheet.pdf', 'pdf', 1048576, false),
('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Linear Algebra Lecture Notes.pdf', '/slides/math-notes.pdf', 'pdf', 2097152, true)
ON CONFLICT DO NOTHING;

-- 8. CLASS RECORDINGS
INSERT INTO class_recordings (class_id, title, recording_url, duration_seconds, file_size, is_published) VALUES
('30000000-0000-0000-0000-000000000003', 'Foundations of Modern Node.js Architecture - Session Recording', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 3600, 245000000, true)
ON CONFLICT DO NOTHING;

-- 9. NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type, link) VALUES
('00000000-0000-0000-0000-000000000004', 'Upcoming Class in 1 Hour', 'Your live session "Real-Time WebSockets & Interactive Canvases" starts soon.', 'class', '/classroom/ROOM-CS101-LIVE'),
('00000000-0000-0000-0000-000000000005', 'New Material Uploaded', 'Prof. Chen added "Linear Algebra Lecture Notes.pdf" to your course.', 'course', '/student/materials'),
('00000000-0000-0000-0000-000000000007', 'Student Class Reminder', 'Alex Morgan has an upcoming live session at 4:30 PM.', 'attendance', '/parent/attendance');

-- 10. ANNOUNCEMENTS
INSERT INTO announcements (sender_id, title, content, target_role) VALUES
('00000000-0000-0000-0000-000000000001', 'Welcome to the New Academic Semester on EduLearn', 'We are pleased to introduce the upgraded real-time virtual classroom with slide annotation and whiteboard capabilities.', 'all'),
('00000000-0000-0000-0000-000000000002', 'CS101: Presentation Materials Updated', 'Please download the lecture notes before attending todays session.', 'student');

-- 11. PLATFORM SETTINGS
INSERT INTO platform_settings (key, value, description) VALUES
('platform_name', 'EduLearn Global LMS', 'Platform branding title'),
('contact_email', 'support@edulearn.com', 'Primary institutional contact email'),
('currency', 'USD', 'Default billing currency'),
('allow_public_registration', 'true', 'Whether new students/parents can register without invite'),
('enable_recordings', 'true', 'Global recording enablement flag')
ON CONFLICT (key) DO NOTHING;
