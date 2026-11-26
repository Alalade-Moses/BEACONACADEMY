-- ==============================================================================
-- BEACON BRIDGE ACADEMICS LMS SEED DATA (PRODUCTION READY)
-- Default Super Admin & Faculty accounts (BCrypt hashed for 'Password123!')
-- ==============================================================================

-- 1. INSERT INITIAL ADMINISTRATIVE & FACULTY PROFILES
INSERT INTO profiles (id, email, password_hash, full_name, role, avatar_url, phone, bio, status) VALUES
-- Super Admin
('00000000-0000-0000-0000-000000000001', 'admin@beaconbridgeacademics.co.uk', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Platform Administrator', 'superadmin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+44 20 7946 0912', 'Platform Super Administrator with complete institutional oversight for UK and International curricula.', 'active'),

-- Lead Faculty Tutors
('00000000-0000-0000-0000-000000000002', 'dr.sarah@beaconbridgeacademics.co.uk', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Dr. Sarah Jenkins', 'tutor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+44 7700 900143', 'PhD in Pure Mathematics & Physics (Oxford), 12 years UK GCSE and A-Level tutoring experience across AQA, Edexcel, and OCR.', 'active'),
('00000000-0000-0000-0000-000000000003', 'prof.chen@beaconbridgeacademics.co.uk', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Prof. Michael Chen', 'tutor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+44 7700 900288', 'Head of Science & Advanced STEM, specialized in A-Level Chemistry, Biology & North American AP curricula.', 'active'),

-- Sample Enrolled Students
('00000000-0000-0000-0000-000000000004', 'alex.morgan@beaconbridgeacademics.co.uk', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Alex Morgan', 'student', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', '+44 7700 900512', 'Year 11 GCSE Student preparing for AQA & Edexcel Core Science and Higher Tier Mathematics.', 'active'),
('00000000-0000-0000-0000-000000000006', 'liam.chen@beaconbridgeacademics.co.uk', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Liam Chen', 'student', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '+44 7700 900620', 'Coding (Software Development) Student enrolled in Frontend Coding Track (£340/month).', 'active'),

-- Sample Associated Parents
('00000000-0000-0000-0000-000000000005', 'david.morgan@beaconbridgeacademics.co.uk', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'David Morgan', 'parent', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+44 7700 900513', 'Parent of Alex Morgan (Father)', 'active'),
('00000000-0000-0000-0000-000000000007', 'grace.chen@beaconbridgeacademics.co.uk', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Grace Chen', 'parent', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+44 7700 900621', 'Parent of Liam Chen (Mother)', 'active')
ON CONFLICT (email) DO NOTHING;

-- 2. INSERT COURSE CATEGORIES
INSERT INTO course_categories (id, name, slug, description, icon) VALUES
('10000000-0000-0000-0000-000000000001', 'GCSE Core & Sciences (Year 10–11)', 'gcse-core-sciences', 'Complete British GCSE preparation across Mathematics, English Language & Literature, and Triple Sciences.', 'GraduationCap'),
('10000000-0000-0000-0000-000000000002', 'UK A-Levels (Year 12–13)', 'uk-a-levels', 'Rigorous 3-subject A-Level preparation for leading UK Russell Group & Oxford/Cambridge admissions.', 'BookOpen'),
('10000000-0000-0000-0000-000000000003', 'Canada Senior Secondary (Grades 11–12)', 'canada-senior-secondary', 'Grade 11 & 12 university preparatory streams across Ontario and Canadian provincial curricula.', 'Compass'),
('10000000-0000-0000-0000-000000000004', 'US High School & AP Mastery', 'us-high-school-ap', 'Advanced Placement (AP) exam preparation and College Board standardized curriculum support.', 'Award'),
('10000000-0000-0000-0000-000000000005', 'Key Stage 3 Foundations (Year 7–9)', 'ks3-foundations', 'Foundational British curriculum bridge for closing academic gaps before GCSE transitions.', 'Sparkles'),
('10000000-0000-0000-0000-000000000006', 'Technology & Digital Arts', 'tech-digital-arts', 'Industry-standard accredited programs in Coding (Software Development) and Professional Graphics Design.', 'Code')
ON CONFLICT (slug) DO NOTHING;

-- 3. INSERT COURSES (ALL IN BRITISH POUNDS £ GBP)
INSERT INTO courses (id, title, slug, description, category_id, tutor_id, thumbnail_url, level, price, currency, status) VALUES
('20000000-0000-0000-0000-000000000009', 'Key Stage 2 Foundation & SATs (Year 3–6)', 'ks2-foundation-sats', 'Primary Numeracy, English Reading & Writing, and 11+ / SATs mastery for Year 3–6 students.', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600', 'KS2 (Year 3–6)', 149.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000001', 'GCSE 5-Subject Core Bundle', 'gcse-5-subject-bundle', 'Comprehensive GCSE curriculum covering Mathematics, English Language & Literature, Chemistry, Biology, and Physics. (£299/month or £40/hour).', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600', 'GCSE (Year 10–11)', 299.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000002', 'UK A-Level 3-Subject Specialist Program', 'uk-a-level-3-subject-program', 'Choose your 3 A-Level subjects from Pure & Further Maths, Sciences, Economics, English, and Computing. (£320/month or £45/hour).', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600', 'A-Level (Year 12–13)', 320.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000003', 'Canada Senior Secondary & AP Program (Grade 11/12)', 'canada-senior-secondary-program', 'Advanced Functions, Calculus & Vectors, Sciences, and English Grade 12 for university entry. (£320/month).', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600', 'Canada Grade 11–12', 320.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000004', 'US High School Advanced & AP Mastery Program', 'us-high-school-ap-mastery', 'AP Calculus BC, AP Chemistry, AP Physics 1/C, AP Biology, and AP English Literature.', '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'US High School / AP', 320.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000005', 'Key Stage 3 Foundation Bridge (Year 7–9)', 'ks3-foundation-bridge', 'Foundational curriculum bridge across KS3 Maths, English, and Combined Science. (£249/month or £40/hour).', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600', 'KS3 (Year 7–9)', 249.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000006', 'Coding (Software Development)', 'software-development', 'Industry-standard Coding (Software Development) program at £340/month (£35/hour).', '10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600', 'All Levels', 340.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000007', 'Graphics Design', 'graphics-design', 'Comprehensive Visual & Graphic Design at £200/month (£20/hour): Figma UI/UX prototyping, brand identity, typography, Adobe Photoshop/Illustrator, and portfolio development.', '10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600', 'All Levels', 200.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000008', 'IELTS Academic & UKVI Exam Preparation', 'ielts-academic-exam-preparation', 'Target Band 7.5+ for UK University & Visa (UKVI) admissions (£1,000/month). Intensive coaching in IELTS Academic Writing (Task 1 & 2), Speaking fluency, Reading speed, and Listening under exam conditions.', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600', 'All Levels', 1000.00, 'GBP', 'published')
ON CONFLICT (slug) DO NOTHING;

-- 4. PLATFORM SETTINGS (OFFICIAL BARCLAYS UK COORDINATES)
INSERT INTO platform_settings (key, value, description) VALUES
('platform_name', 'Beacon Bridge Academics', 'Official institution name'),
('contact_email', 'info@beaconbridgeacademics.co.uk', 'Primary contact email'),
('currency', 'GBP', 'Default billing currency'),
('currency_symbol', '£', 'Default currency symbol'),
('bank_name', 'Barclays Bank UK PLC', 'Designated tuition wire bank'),
('account_name', 'Beacon Bridge Academics Ltd.', 'Wire transfer beneficiary'),
('account_number', '83920147', 'UK Domestic Account Number'),
('sort_code', '20-45-77', 'UK 6-Digit Sort Code'),
('iban', 'GB29BARC20457783920147', 'International Bank Account Number'),
('swift_bic', 'BARCGB22', 'SWIFT BIC routing identifier'),
('tuition_fee', '£299.00 GBP', 'Standard default tuition fee'),
('allow_public_registration', 'true', 'Enable student and parent registration'),
('enable_recordings', 'true', 'Enable virtual classroom recordings'),
('enable_whiteboard', 'true', 'Enable digital whiteboard and slide annotations')
ON CONFLICT (key) DO NOTHING;

-- 5. PARENT STUDENT LINKS
INSERT INTO parent_student_links (id, parent_id, student_id, relationship, status) VALUES
('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 'Father', 'active'),
('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000006', 'Mother', 'active')
ON CONFLICT (id) DO NOTHING;

-- 6. COURSE ENROLLMENTS
INSERT INTO course_enrollments (id, course_id, student_id, status) VALUES
('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'enrolled'),
('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 'enrolled')
ON CONFLICT (id) DO NOTHING;

-- 7. DEFAULT LIVE & SCHEDULED CLASSES
INSERT INTO classes (id, course_id, tutor_id, title, description, scheduled_at, duration_minutes, meeting_room_id, presentation_url, presentation_pages, status) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'GCSE Higher Mathematics: Quadratic Graphs & Algebraic Fractions', 'Live interactive workshop focusing on quadratic transformations and algebraic fraction simplification with step-by-step whiteboard derivations.', NOW(), 75, 'ROOM-GCSE-MATH-LIVE', '/slides/sample-presentation.pdf', 6, 'live'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'A-Level Pure Mathematics: Calculus & Differential Equations Masterclass', 'Integration techniques, differential equation solving, and Oxford/Cambridge STEP problem-solving heuristics.', NOW() + INTERVAL '2 hours', 90, 'ROOM-ALEVEL-MATH-01', '/slides/sample-presentation.pdf', 8, 'scheduled'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'Coding (Software Development): Full-Stack Architecture & Live Workshop', 'Live interactive coding lecture covering React frontend components, WebSocket bi-directional state, and Node.js microservices.', NOW(), 60, 'ROOM-SOFTDEV-LIVE', '/slides/sample-presentation.pdf', 5, 'live'),
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 'IELTS Academic & UKVI: Writing Task 2 & Live Speaking Mock Clinic', 'Interactive IELTS Band 7.5-8.5 seminar covering Academic Writing Task 1 & 2 rubrics and 1-on-1 Speaking fluency feedback.', NOW() + INTERVAL '90 minutes', 60, 'ROOM-IELTS-LIVE', '/slides/sample-presentation.pdf', 6, 'scheduled')
ON CONFLICT (id) DO NOTHING;
