-- ==============================================================================
-- BEACON BRIDGE ACADEMICS LMS SEED DATA (PRODUCTION — NO DEMO USERS OR TEST DATA)
-- Only seeds official course categories, official courses, and non-sensitive settings.
-- Superadmin credentials are synced dynamically via SUPERADMIN_EMAIL & SUPERADMIN_PASSWORD.
-- ==============================================================================

-- 1. INSERT OFFICIAL COURSE CATEGORIES
INSERT INTO course_categories (id, name, slug, description, icon) VALUES
('10000000-0000-0000-0000-000000000001', 'UK GCSE & Exam Preparation', 'gcse-uk', 'Core UK GCSE subjects (AQA, Edexcel, OCR, WJEC) and IELTS Academic & UKVI exam preparation.', 'BookOpen'),
('10000000-0000-0000-0000-000000000002', 'UK A-Levels', 'a-levels-uk', 'In-depth 3-subject mastery for UK Year 12 & 13 students targeting Grades A*–B and top university admissions.', 'GraduationCap'),
('10000000-0000-0000-0000-000000000003', 'Canada Senior Secondary (Grade 11/12 & AP)', 'canada-secondary', 'Provincial curriculum alignment (Ontario OSSD, British Columbia) and Advanced Placement acceleration.', 'Globe'),
('10000000-0000-0000-0000-000000000004', 'US High School Advanced & AP', 'us-ap', 'College Board AP exam mastery and GPA enhancement in core STEM & Humanities subjects.', 'Award'),
('10000000-0000-0000-0000-000000000005', 'Key Stage 2 & Key Stage 3 Foundations', 'ks3', 'Primary SATs/11+ foundations (Year 3–6) and KS3 bridge (Year 7–9) building academic confidence before GCSEs.', 'Compass'),
('10000000-0000-0000-0000-000000000006', 'Technology & Digital Arts', 'tech-digital-arts', 'Industry-standard programs in Coding (Software Development) and Professional Graphics Design.', 'Code')
ON CONFLICT (id) DO NOTHING;

-- 2. INSERT OFFICIAL COURSES (NO DEMO TUTORS ASSIGNED; TUTORS ASSIGNED PER STUDENT)
INSERT INTO courses (id, title, slug, description, category_id, tutor_id, thumbnail_url, level, price, currency, status) VALUES
('20000000-0000-0000-0000-000000000009', 'Key Stage 2 Foundation & SATs (Year 3–6)', 'ks2-foundation-sats', 'Primary Numeracy, English Reading & Writing, and 11+ / SATs mastery for Year 3–6 students.', '10000000-0000-0000-0000-000000000005', NULL, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600', 'KS2 (Year 3–6)', 149.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000005', 'Key Stage 3 Foundation Bridge (Year 7–9)', 'ks3-foundation-bridge', 'Closing foundational curriculum gaps across KS3 Maths, English, and Combined Science to prepare students for GCSE readiness. (£249/month or £40/hour).', '10000000-0000-0000-0000-000000000005', NULL, 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600', 'KS3 (Year 7–9)', 249.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000001', 'GCSE 5-Subject Core Bundle (Maths, English, Chem, Bio, Physics)', 'gcse-5-subject-core-bundle', 'All 5 core subjects: Mathematics, English Language & Literature, Chemistry, Biology, and Physics. (£299/month or £40/hour per subject Year 7–11).', '10000000-0000-0000-0000-000000000001', NULL, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600', 'GCSE (Year 10–11)', 299.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000002', 'UK A-Level 3-Subject Specialist Program', 'uk-a-level-3-subject-program', 'Choose your 3 A-Level subjects from Mathematics, Further Maths, English Literature, Chemistry, Physics, Biology, Economics, History, and Computer Science. (£320/month or £45/hour).', '10000000-0000-0000-0000-000000000002', NULL, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600', 'A-Level (Year 12–13)', 320.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000003', 'Canada Senior Secondary & AP Program (Grade 11/12)', 'canada-senior-secondary-program', 'Choose 3 courses: Advanced Functions (MHF4U), Calculus & Vectors (MCV4U), English (ENG4U), Chemistry (SCH4U), Physics (SPH4U), Biology (SBI4U), World Issues (CGW4U). (£320/month).', '10000000-0000-0000-0000-000000000003', NULL, 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600', 'Canada Grade 11–12', 320.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000004', 'US High School Advanced & AP Mastery Program', 'us-high-school-ap-mastery', 'Choose 3 subjects: AP Calculus AB/BC, AP English Language, AP Chemistry, AP Physics 1/C, AP Biology, AP US History, AP Computer Science A. (£320/month or £45/hour).', '10000000-0000-0000-0000-000000000004', NULL, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'US High School / AP', 320.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000006', 'Coding (Software Development)', 'software-development', 'Industry-standard Coding (Software Development) program at £340/month (£35/hour). Choose Frontend or Backend specialization.', '10000000-0000-0000-0000-000000000006', NULL, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600', 'Professional / Tech', 340.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000007', 'Graphics Design', 'graphics-design', 'Comprehensive Visual & Graphics Design (£200/month or £20/hour): Figma UI/UX prototyping, brand identity, typography, Adobe Photoshop/Illustrator, and portfolio development.', '10000000-0000-0000-0000-000000000006', NULL, 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600', 'Creative / Digital Arts', 200.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000008', 'IELTS Academic & UKVI Exam Preparation', 'ielts-academic-exam-preparation', 'Target Band 7.5+ for UK University & Visa (UKVI) admissions (£100/month). Intensive 1-to-1 coaching in IELTS Academic Writing (Task 1 & 2), Speaking fluency, Reading speed, and Listening.', '10000000-0000-0000-0000-000000000001', NULL, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600', 'English Language Proficiency (IELTS)', 100.00, 'GBP', 'published')
ON CONFLICT (id) DO NOTHING;

-- 3. NON-SENSITIVE PLATFORM SETTINGS
INSERT INTO platform_settings (key, value, description) VALUES
('platform_name', 'Beacon Bridge Academics', 'Official institution name'),
('contact_email', 'info@beaconbridgeacademics.co.uk', 'Primary contact email'),
('currency', 'GBP', 'Default billing currency'),
('currency_symbol', '£', 'Default currency symbol'),
('allow_public_registration', 'true', 'Enable student and parent registration'),
('enable_recordings', 'true', 'Enable virtual classroom recordings'),
('enable_whiteboard', 'true', 'Enable digital whiteboard and slide annotations'),
('maintenance_mode', 'false', 'Maintenance mode toggle')
ON CONFLICT (key) DO NOTHING;
