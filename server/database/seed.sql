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
('00000000-0000-0000-0000-000000000003', 'prof.chen@beaconbridgeacademics.co.uk', '$2a$10$wT8K8U4/c3q5gNvZG1uIkeYQp6Q9Y2k9e9D7l8l5jFkZtq4r1e.Xa', 'Prof. Michael Chen', 'tutor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+44 7700 900288', 'Head of Science & Advanced STEM, specialized in A-Level Chemistry, Biology & North American AP curricula.', 'active')
ON CONFLICT (email) DO NOTHING;

-- 2. INSERT COURSE CATEGORIES
INSERT INTO course_categories (id, name, slug, description, icon) VALUES
('10000000-0000-0000-0000-000000000001', 'GCSE Core & Sciences (Years 10–11)', 'gcse-core-sciences', 'Complete British GCSE preparation across Mathematics, English Language & Literature, and Triple Sciences.', 'GraduationCap'),
('10000000-0000-0000-0000-000000000002', 'UK A-Levels (Years 12–13)', 'uk-a-levels', 'Rigorous 3-subject A-Level preparation for leading UK Russell Group & Oxford/Cambridge admissions.', 'BookOpen'),
('10000000-0000-0000-0000-000000000003', 'Canada Senior Secondary (Grades 11–12)', 'canada-senior-secondary', 'Grade 11 & 12 university preparatory streams across Ontario and Canadian provincial curricula.', 'Compass'),
('10000000-0000-0000-0000-000000000004', 'US High School & AP Mastery', 'us-high-school-ap', 'Advanced Placement (AP) exam preparation and College Board standardized curriculum support.', 'Award'),
('10000000-0000-0000-0000-000000000005', 'Key Stage 3 Foundations (Years 7–9)', 'ks3-foundations', 'Foundational British curriculum bridge for closing academic gaps before GCSE transitions.', 'Sparkles')
ON CONFLICT (slug) DO NOTHING;

-- 3. INSERT COURSES (ALL IN BRITISH POUNDS £ GBP)
INSERT INTO courses (id, title, slug, description, category_id, tutor_id, thumbnail_url, level, price, currency, status) VALUES
('20000000-0000-0000-0000-000000000001', 'GCSE 5-Subject Core Bundle', 'gcse-5-subject-bundle', 'Comprehensive GCSE curriculum covering Mathematics, English Language & Literature, Chemistry, Biology, and Physics. Includes opt-out exceptions.', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600', 'GCSE (Years 10–11)', 299.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000002', 'UK A-Level 3-Subject Specialist Program', 'uk-a-level-3-subject-program', 'Choose your 3 A-Level subjects from Pure & Further Maths, Sciences, Economics, English, and Computing.', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600', 'A-Level (Years 12–13)', 349.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000003', 'Canada Senior Secondary & AP Program (Grade 11/12)', 'canada-senior-secondary-program', 'Advanced Functions, Calculus & Vectors, Sciences, and English Grade 12 for university entry.', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600', 'Canada Grade 11–12', 349.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000004', 'US High School Advanced & AP Mastery Program', 'us-high-school-ap-mastery', 'AP Calculus BC, AP Chemistry, AP Physics 1/C, AP Biology, and AP English Literature.', '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'US High School / AP', 349.00, 'GBP', 'published'),
('20000000-0000-0000-0000-000000000005', 'Key Stage 3 Foundation Bridge (Years 7–9)', 'ks3-foundation-bridge', 'Foundational curriculum bridge across KS3 Maths, English, and Combined Science.', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600', 'KS3 (Years 7–9)', 249.00, 'GBP', 'published')
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
