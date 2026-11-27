import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pg from 'pg';
import dotenv from 'dotenv';
import { isUuid } from '../utils/validators.js';

dotenv.config();

const { Pool } = pg;
const databaseUrl = (process.env.DATABASE_URL || '').trim();

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000
    })
  : null;

const SUPERADMIN_ID = '00000000-0000-0000-0000-000000000001';
const SUPERADMIN_EMAIL = (process.env.SUPERADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@beaconbridgeacademics.co.uk').trim().toLowerCase();
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD;
const SUPERADMIN_HASH = SUPERADMIN_PASSWORD
  ? bcrypt.hashSync(SUPERADMIN_PASSWORD, 10)
  : null;

const IELTS_COURSE_ID = '20000000-0000-0000-0000-000000000008';

// Official Course Categories (seeded idempotently into PostgreSQL — no demo users/payments)
const OFFICIAL_CATEGORIES = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'UK GCSE & Exam Preparation',
    slug: 'gcse-uk',
    description: 'Core UK GCSE subjects (AQA, Edexcel, OCR, WJEC) and IELTS Academic & UKVI exam preparation.',
    icon: 'BookOpen'
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'UK A-Levels',
    slug: 'a-levels-uk',
    description: 'In-depth 3-subject mastery for UK Year 12 & 13 students targeting Grades A*–B and top university admissions.',
    icon: 'GraduationCap'
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    name: 'Canada Senior Secondary (Grade 11/12 & AP)',
    slug: 'canada-secondary',
    description: 'Provincial curriculum alignment (Ontario OSSD, British Columbia) and Advanced Placement acceleration.',
    icon: 'Globe'
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    name: 'US High School Advanced & AP',
    slug: 'us-ap',
    description: 'College Board AP exam mastery and GPA enhancement in core STEM & Humanities subjects.',
    icon: 'Award'
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    name: 'Key Stage 2 & Key Stage 3 Foundations',
    slug: 'ks3',
    description: 'Primary SATs/11+ foundations (Year 3–6) and KS3 bridge (Year 7–9) building academic confidence before GCSEs.',
    icon: 'Compass'
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    name: 'Technology & Digital Arts',
    slug: 'tech-digital-arts',
    description: 'Industry-standard programs in Coding (Software Development) and Professional Graphics Design.',
    icon: 'Code'
  }
];

// Official Beacon Bridge Academics Course Catalog (synced idempotently into PostgreSQL)
const OFFICIAL_COURSES = [
  {
    id: '20000000-0000-0000-0000-000000000009',
    title: 'Key Stage 2 Foundation & SATs (Year 3–6)',
    slug: 'ks2-foundation-sats',
    description: 'Primary Numeracy, English Reading & Writing, and 11+ / SATs mastery for Year 3–6 students.',
    category_id: '10000000-0000-0000-0000-000000000005',
    thumbnail_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
    level: 'KS2 (Year 3–6)',
    price: 149.00,
    discount_from: 199.00,
    hourly_rate: null,
    hourly_note: null,
    pricing_type: 'monthly',
    currency: 'GBP',
    status: 'published'
  },
  {
    id: '20000000-0000-0000-0000-000000000005',
    title: 'Key Stage 3 Foundation Bridge (Year 7–9)',
    slug: 'ks3-foundation-bridge',
    description: 'Closing foundational curriculum gaps across KS3 Maths, English, and Combined Science to prepare students for GCSE readiness. (£249/month or £40/hour).',
    category_id: '10000000-0000-0000-0000-000000000005',
    thumbnail_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600',
    level: 'KS3 (Year 7–9)',
    price: 249.00,
    discount_from: 299.00,
    hourly_rate: 40.00,
    hourly_note: '£40/hour per subject (Year 7–11)',
    pricing_type: 'monthly',
    currency: 'GBP',
    status: 'published'
  },
  {
    id: '20000000-0000-0000-0000-000000000001',
    title: 'GCSE 5-Subject Core Bundle (Maths, English, Chem, Bio, Physics)',
    slug: 'gcse-5-subject-core-bundle',
    description: 'All 5 core subjects: Mathematics, English Language & Literature, Chemistry, Biology, and Physics. (£299/month or £40/hour per subject Year 7–11).',
    category_id: '10000000-0000-0000-0000-000000000001',
    thumbnail_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
    level: 'GCSE (Year 10–11)',
    price: 299.00,
    discount_from: 380.00,
    hourly_rate: 40.00,
    hourly_note: '£40/hour per subject (Year 7–11)',
    pricing_type: 'monthly',
    currency: 'GBP',
    status: 'published'
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    title: 'UK A-Level 3-Subject Specialist Program',
    slug: 'uk-a-level-3-subject-program',
    description: 'Choose your 3 A-Level subjects from Mathematics, Further Maths, English Literature, Chemistry, Physics, Biology, Economics, History, and Computer Science. (£320/month or £45/hour).',
    category_id: '10000000-0000-0000-0000-000000000002',
    thumbnail_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
    level: 'A-Level (Year 12–13)',
    price: 320.00,
    discount_from: 399.00,
    hourly_rate: 45.00,
    hourly_note: '£45/hour per A-Level subject',
    pricing_type: 'monthly',
    currency: 'GBP',
    status: 'published'
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    title: 'Canada Senior Secondary & AP Program (Grade 11/12)',
    slug: 'canada-senior-secondary-program',
    description: 'Choose 3 courses: Advanced Functions (MHF4U), Calculus & Vectors (MCV4U), English (ENG4U), Chemistry (SCH4U), Physics (SPH4U), Biology (SBI4U), World Issues (CGW4U). (£320/month).',
    category_id: '10000000-0000-0000-0000-000000000003',
    thumbnail_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
    level: 'Canada Grade 11–12',
    price: 320.00,
    discount_from: 399.00,
    hourly_rate: 45.00,
    hourly_note: '£45/hour per subject',
    pricing_type: 'monthly',
    currency: 'GBP',
    status: 'published'
  },
  {
    id: '20000000-0000-0000-0000-000000000004',
    title: 'US High School Advanced & AP Mastery Program',
    slug: 'us-high-school-ap-mastery',
    description: 'Choose 3 subjects: AP Calculus AB/BC, AP English Language, AP Chemistry, AP Physics 1/C, AP Biology, AP US History, AP Computer Science A. (£320/month or £45/hour).',
    category_id: '10000000-0000-0000-0000-000000000004',
    thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
    level: 'US High School / AP',
    price: 320.00,
    discount_from: 399.00,
    hourly_rate: 45.00,
    hourly_note: '£45/hour per subject',
    pricing_type: 'monthly',
    currency: 'GBP',
    status: 'published'
  },
  {
    id: '20000000-0000-0000-0000-000000000006',
    title: 'Coding (Software Development)',
    slug: 'software-development',
    description: 'Industry-standard Coding (Software Development) program at £340/month (£35/hour). Choose Frontend or Backend specialization.',
    category_id: '10000000-0000-0000-0000-000000000006',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
    level: 'Professional / Tech',
    price: 340.00,
    discount_from: 420.00,
    hourly_rate: 35.00,
    hourly_note: '£35/hour flexible coaching',
    pricing_type: 'monthly',
    currency: 'GBP',
    status: 'published'
  },
  {
    id: '20000000-0000-0000-0000-000000000007',
    title: 'Graphics Design',
    slug: 'graphics-design',
    description: 'Comprehensive Visual & Graphics Design (£200/month or £20/hour): Figma UI/UX prototyping, brand identity, typography, Adobe Photoshop/Illustrator, and portfolio development.',
    category_id: '10000000-0000-0000-0000-000000000006',
    thumbnail_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600',
    level: 'Creative / Digital Arts',
    price: 200.00,
    discount_from: 260.00,
    hourly_rate: 20.00,
    hourly_note: '£20/hour studio coaching',
    pricing_type: 'monthly',
    currency: 'GBP',
    status: 'published'
  },
  {
    id: IELTS_COURSE_ID,
    title: 'IELTS Academic & UKVI Exam Preparation',
    slug: 'ielts-academic-exam-preparation',
    description: 'Target Band 7.5+ for UK University & Visa (UKVI) admissions (£100/month). Intensive 1-to-1 coaching in IELTS Academic Writing (Task 1 & 2), Speaking fluency, Reading speed, and Listening.',
    category_id: '10000000-0000-0000-0000-000000000001',
    thumbnail_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
    level: 'English Language Proficiency (IELTS)',
    price: 100.00,
    discount_from: 150.00,
    hourly_rate: null,
    hourly_note: null,
    pricing_type: 'monthly',
    currency: 'GBP',
    status: 'published'
  }
];

const DEFAULT_PLATFORM_SETTINGS = {
  platform_name: 'Beacon Bridge Academics',
  contact_email: 'info@beaconbridgeacademics.co.uk',
  currency: 'GBP',
  currency_symbol: '£',
  allow_public_registration: 'true',
  enable_recordings: 'true',
  enable_whiteboard: 'true',
  maintenance_mode: 'false',
  default_tuition_fee: '£299.00 GBP / month'
};

// Always strip password_hash from any nested or joined profile object
const stripPassword = (profile) => {
  if (!profile || typeof profile !== 'object') return null;
  const { password_hash, ...safe } = profile;
  return safe;
};

const requireDb = () => {
  if (!pool) {
    const err = new Error('PostgreSQL database connection (DATABASE_URL) is not configured.');
    err.statusCode = 503;
    throw err;
  }
  return pool;
};

// Auto-ensure schema, columns, superadmin sync, official course catalog, and self-heal
let dbInitPromise = null;

export const ensureDatabaseReady = () => {
  if (!pool) return Promise.resolve(false);
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = (async () => {
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connection pool initialized (100% database-backed mode, no in-memory store).');

    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('superadmin', 'admin', 'tutor', 'student', 'parent')),
        avatar_url TEXT,
        phone VARCHAR(50),
        bio TEXT,
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending', 'pending_verification')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
      CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
      CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

      CREATE TABLE IF NOT EXISTS parent_student_links (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        relationship VARCHAR(100) DEFAULT 'Parent',
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(parent_id, student_id)
      );

      CREATE TABLE IF NOT EXISTS course_categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(100) DEFAULT 'BookOpen',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        category_id UUID REFERENCES course_categories(id) ON DELETE SET NULL,
        tutor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
        thumbnail_url TEXT,
        level VARCHAR(100) DEFAULT 'All Levels',
        price DECIMAL(10, 2) DEFAULT 0.00,
        discount_from DECIMAL(10, 2),
        hourly_rate DECIMAL(10, 2),
        hourly_note VARCHAR(255),
        pricing_type VARCHAR(50) DEFAULT 'monthly',
        currency VARCHAR(10) DEFAULT 'GBP',
        status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS course_enrollments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        course_track VARCHAR(255),
        status VARCHAR(50) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
        progress_pct INTEGER DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
        enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(course_id, student_id)
      );

      CREATE TABLE IF NOT EXISTS classes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
        tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
        duration_minutes INTEGER NOT NULL DEFAULT 60,
        status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
        meeting_room_id VARCHAR(255) UNIQUE NOT NULL,
        presentation_url TEXT,
        presentation_pages INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS class_attendance (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        left_at TIMESTAMP WITH TIME ZONE,
        duration_minutes INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'present' CHECK (status IN ('present', 'late', 'absent'))
      );

      CREATE TABLE IF NOT EXISTS learning_materials (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
        class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
        uploader_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(100),
        file_size BIGINT DEFAULT 0,
        is_presentation BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS class_recordings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        recording_url TEXT NOT NULL,
        duration_seconds INTEGER DEFAULT 0,
        file_size BIGINT DEFAULT 0,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'system',
        link TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

      CREATE TABLE IF NOT EXISTS assignments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date TIMESTAMP WITH TIME ZONE NOT NULL,
        max_score INTEGER DEFAULT 100,
        file_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS assignment_submissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
        student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        submission_text TEXT,
        file_url TEXT,
        score INTEGER,
        feedback TEXT,
        status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late')),
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        graded_at TIMESTAMP WITH TIME ZONE,
        UNIQUE(assignment_id, student_id)
      );

      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
        course_track VARCHAR(255),
        course_name VARCHAR(255),
        selected_subjects JSONB,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'GBP',
        bank_reference VARCHAR(100),
        proof_url TEXT,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
        admin_notes TEXT,
        verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        verified_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS announcements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        target_role VARCHAR(50) DEFAULT 'all' CHECK (target_role IN ('all', 'tutor', 'student', 'parent')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
        action VARCHAR(255) NOT NULL,
        entity_type VARCHAR(100),
        entity_id VARCHAR(255),
        ip_address VARCHAR(100),
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS platform_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        description TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tutor_applications (
        id VARCHAR(100) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        location VARCHAR(255),
        highest_qualification VARCHAR(255),
        years_experience VARCHAR(50),
        current_position VARCHAR(255),
        selected_subjects JSONB,
        bio TEXT,
        teaching_approach TEXT,
        video_url TEXT,
        video_duration VARCHAR(50),
        video_filename VARCHAR(255),
        cv_url TEXT,
        degree_certificate_url TEXT,
        teaching_licence_url TEXT,
        safeguarding_acknowledged BOOLEAN DEFAULT FALSE,
        safeguarding_version VARCHAR(100),
        safeguarding_signature VARCHAR(255),
        safeguarding_signed_at TIMESTAMP WITH TIME ZONE,
        dbs_status VARCHAR(255),
        dbs_certificate_number VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
        admin_notes TEXT,
        reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
        reviewed_by_name VARCHAR(255),
        reviewed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS consultations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        parent_name VARCHAR(255) NOT NULL,
        student_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        curriculum VARCHAR(100) NOT NULL,
        subjects VARCHAR(255),
        exam_board VARCHAR(100),
        current_grade VARCHAR(50),
        target_grade VARCHAR(50),
        consultation_day VARCHAR(50) NOT NULL,
        consultation_time VARCHAR(50) NOT NULL,
        consultation_date VARCHAR(50),
        consultant_name VARCHAR(255) DEFAULT 'Mr. Gideon Babs',
        mode VARCHAR(100) DEFAULT 'Live Interactive Video',
        notes TEXT,
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS blog_posts (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100) DEFAULT 'GCSE Mastery',
        type VARCHAR(50) DEFAULT 'article',
        excerpt TEXT,
        content TEXT,
        flyer_image_url TEXT,
        author_name VARCHAR(255) DEFAULT 'Beacon Bridge Academics',
        author_role VARCHAR(255) DEFAULT 'Curriculum Specialist',
        read_time VARCHAR(50) DEFAULT '5 min read',
        tags TEXT[] DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'published',
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_type ON blog_posts(type);
    `);

    // Safe additive schema migrations for existing Railway PostgreSQL databases
    const safeAlters = [
      `ALTER TABLE courses ADD COLUMN IF NOT EXISTS discount_from DECIMAL(10, 2)`,
      `ALTER TABLE courses ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2)`,
      `ALTER TABLE courses ADD COLUMN IF NOT EXISTS hourly_note VARCHAR(255)`,
      `ALTER TABLE courses ADD COLUMN IF NOT EXISTS pricing_type VARCHAR(50) DEFAULT 'monthly'`,
      `ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS course_track VARCHAR(255)`,
      `ALTER TABLE payments ADD COLUMN IF NOT EXISTS course_track VARCHAR(255)`,
      `ALTER TABLE payments ADD COLUMN IF NOT EXISTS course_name VARCHAR(255)`,
      `ALTER TABLE payments ADD COLUMN IF NOT EXISTS selected_subjects JSONB`,
      `ALTER TABLE payments ALTER COLUMN parent_id DROP NOT NULL`,
      `ALTER TABLE payments ALTER COLUMN student_id DROP NOT NULL`,
      `ALTER TABLE tutor_applications ADD COLUMN IF NOT EXISTS degree_certificate_url TEXT`,
      `ALTER TABLE tutor_applications ADD COLUMN IF NOT EXISTS teaching_licence_url TEXT`,
      `ALTER TABLE tutor_applications ADD COLUMN IF NOT EXISTS safeguarding_version VARCHAR(100)`,
      `ALTER TABLE tutor_applications ADD COLUMN IF NOT EXISTS reviewed_by_name VARCHAR(255)`
    ];
    for (const stmt of safeAlters) {
      try {
        await pool.query(stmt);
      } catch (altErr) {
        console.warn('[DB Migration Notice]:', altErr.message);
      }
    }

    // 1. Sync Super Administrator from environment variables
    if (SUPERADMIN_HASH) {
      await pool.query(
        `
        INSERT INTO profiles (id, email, password_hash, full_name, role, status)
        VALUES ($1, $2, $3, 'Platform Administrator', 'superadmin', 'active')
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash,
          role = 'superadmin',
          status = 'active',
          updated_at = NOW();
        `,
        [SUPERADMIN_ID, SUPERADMIN_EMAIL, SUPERADMIN_HASH]
      );
      console.log(`🔐 [AUTH] Super Administrator synchronized in PostgreSQL (${SUPERADMIN_EMAIL}).`);
    }

    // 2. Seed official course categories
    for (const cat of OFFICIAL_CATEGORIES) {
      try {
        await pool.query(
          `
          INSERT INTO course_categories (id, name, slug, description, icon, is_active)
          VALUES ($1, $2, $3, $4, $5, TRUE)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            slug = EXCLUDED.slug,
            description = EXCLUDED.description,
            icon = EXCLUDED.icon;
          `,
          [cat.id, cat.name, cat.slug, cat.description, cat.icon]
        );
      } catch (catErr) {
        console.warn(`[CATEGORY SYNC NOTICE] ${cat.slug}:`, catErr.message);
      }
    }

    // 3. Seed/sync official courses catalog & live pricing
    for (const c of OFFICIAL_COURSES) {
      try {
        await pool.query(
          `
          INSERT INTO courses (id, title, slug, description, category_id, thumbnail_url, level, price, discount_from, hourly_rate, hourly_note, pricing_type, currency, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            slug = EXCLUDED.slug,
            description = EXCLUDED.description,
            category_id = EXCLUDED.category_id,
            level = EXCLUDED.level,
            price = EXCLUDED.price,
            discount_from = EXCLUDED.discount_from,
            hourly_rate = EXCLUDED.hourly_rate,
            hourly_note = EXCLUDED.hourly_note,
            pricing_type = EXCLUDED.pricing_type,
            updated_at = NOW();
          `,
          [
            c.id, c.title, c.slug, c.description, c.category_id, c.thumbnail_url,
            c.level, c.price, c.discount_from, c.hourly_rate, c.hourly_note,
            c.pricing_type, c.currency, c.status
          ]
        );
      } catch (cErr) {
        console.warn(`[COURSES SYNC NOTICE] ${c.slug}:`, cErr.message);
      }
    }

    // 4. Seed default non-sensitive platform settings (remove any legacy bank credentials from settings table)
    await pool.query(
      `DELETE FROM platform_settings WHERE key IN ('account_number', 'sort_code', 'iban', 'swift_bic', 'bank_account_number', 'bank_swift_bic', 'bank_routing_sort', 'bank_iban')`
    ).catch(() => {});

    for (const [key, value] of Object.entries(DEFAULT_PLATFORM_SETTINGS)) {
      await pool.query(
        `
        INSERT INTO platform_settings (key, value, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (key) DO NOTHING;
        `,
        [key, String(value)]
      ).catch(() => {});
    }

    // 5. Auto-heal any profile stuck in pending_verification that already has a verified payment
    const healed = await pool.query(`
      UPDATE profiles
      SET status = 'active', updated_at = NOW()
      WHERE status = 'pending_verification'
        AND id IN (
          SELECT student_id FROM payments WHERE status = 'verified' AND student_id IS NOT NULL
          UNION
          SELECT parent_id FROM payments WHERE status = 'verified' AND parent_id IS NOT NULL
        )
      RETURNING email, role;
    `);
    if (healed.rowCount > 0) {
      console.log(`✅ [AUTH] Auto-activated ${healed.rowCount} verified profile(s) from payments ledger.`);
    }

    return true;
  })().catch((err) => {
    console.error('❌ PostgreSQL initialization error:', err.message);
    dbInitPromise = null;
    throw err;
  });

  return dbInitPromise;
};

if (pool) {
  ensureDatabaseReady().catch((err) => {
    console.error('❌ Database startup failed:', err.message);
  });
} else {
  console.warn('⚠️ DATABASE_URL is not set. Database operations require a configured PostgreSQL DATABASE_URL.');
}

// Strict column allowlists for dynamic UPDATE operations (prevents SQL identifier injection)
const PROFILE_UPDATE_COLS = new Set(['email', 'password_hash', 'full_name', 'role', 'avatar_url', 'phone', 'bio', 'status']);
const COURSE_UPDATE_COLS = new Set(['title', 'slug', 'description', 'category_id', 'tutor_id', 'thumbnail_url', 'level', 'price', 'discount_from', 'hourly_rate', 'hourly_note', 'pricing_type', 'currency', 'status']);
const CLASS_UPDATE_COLS = new Set(['course_id', 'tutor_id', 'title', 'description', 'scheduled_at', 'duration_minutes', 'status', 'presentation_url', 'presentation_pages']);
const ATTENDANCE_UPDATE_COLS = new Set(['left_at', 'duration_minutes', 'status']);

// ============================================================================
// 100% POSTGRESQL DATA REPOSITORY (NO IN-MEMORY FALLBACK)
// ============================================================================
export const store = {
  // ----------------------------
  // PROFILES / USERS
  // ----------------------------
  getProfiles: async () => {
    const db = requireDb();
    const res = await db.query('SELECT * FROM profiles ORDER BY created_at ASC');
    return res.rows;
  },

  getProfileById: async (id) => {
    if (!isUuid(id)) return null;
    const db = requireDb();
    const res = await db.query('SELECT * FROM profiles WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  getProfileByEmail: async (email) => {
    if (!email || typeof email !== 'string') return null;
    const db = requireDb();
    const normalized = email.toLowerCase().trim();
    const res = await db.query('SELECT * FROM profiles WHERE LOWER(email) = LOWER($1)', [normalized]);
    if (res.rows[0]) return res.rows[0];

    if (!normalized.includes('@')) {
      const prefixRes = await db.query(
        "SELECT * FROM profiles WHERE LOWER(split_part(email, '@', 1)) = LOWER($1) LIMIT 1",
        [normalized]
      );
      return prefixRes.rows[0] || null;
    }
    return null;
  },

  createProfile: async (profileData) => {
    const db = requireDb();
    const id = isUuid(profileData.id) ? profileData.id : uuidv4();
    const email = String(profileData.email || '').toLowerCase().trim();
    const now = new Date().toISOString();

    const res = await db.query(
      `
      INSERT INTO profiles (id, email, password_hash, full_name, role, avatar_url, phone, bio, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        avatar_url = EXCLUDED.avatar_url,
        phone = EXCLUDED.phone,
        bio = EXCLUDED.bio,
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at
      RETURNING *
      `,
      [
        id,
        email,
        profileData.password_hash,
        profileData.full_name,
        profileData.role,
        profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.full_name || 'User')}`,
        profileData.phone || '',
        profileData.bio || '',
        profileData.status || 'active',
        now,
        now
      ]
    );
    return res.rows[0];
  },

  updateProfile: async (id, updates) => {
    if (!isUuid(id)) return null;
    const db = requireDb();
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, val] of Object.entries(updates || {})) {
      if (!PROFILE_UPDATE_COLS.has(key) || val === undefined) continue;
      fields.push(`${key} = $${i}`);
      values.push(key === 'email' ? String(val).toLowerCase().trim() : val);
      i++;
    }
    if (fields.length === 0) return store.getProfileById(id);

    fields.push(`updated_at = $${i}`);
    values.push(new Date().toISOString());
    i++;
    values.push(id);

    const res = await db.query(
      `UPDATE profiles SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return res.rows[0] || null;
  },

  deleteProfile: async (id) => {
    if (!isUuid(id)) return false;
    const db = requireDb();
    await db.query('DELETE FROM profiles WHERE id = $1', [id]);
    return true;
  },

  // ----------------------------
  // COURSES & CATEGORIES
  // ----------------------------
  getCategories: async () => {
    const db = requireDb();
    const res = await db.query('SELECT * FROM course_categories WHERE is_active = TRUE ORDER BY created_at ASC');
    return res.rows;
  },

  getCourses: async () => {
    const db = requireDb();
    const res = await db.query(`
      SELECT c.*,
        row_to_json(cat.*) AS category,
        row_to_json(p.*) AS tutor
      FROM courses c
      LEFT JOIN course_categories cat ON c.category_id = cat.id
      LEFT JOIN profiles p ON c.tutor_id = p.id
      ORDER BY c.created_at ASC
    `);
    return res.rows.map((r) => ({
      ...r,
      price: Number(r.price ?? 0),
      discount_from: r.discount_from !== null && r.discount_from !== undefined ? Number(r.discount_from) : null,
      hourly_rate: r.hourly_rate !== null && r.hourly_rate !== undefined ? Number(r.hourly_rate) : null,
      tutor: stripPassword(r.tutor)
    }));
  },

  getCourseById: async (idOrSlug) => {
    if (!idOrSlug || typeof idOrSlug !== 'string') return null;
    const db = requireDb();
    const query = isUuid(idOrSlug)
      ? `SELECT c.*, row_to_json(cat.*) AS category, row_to_json(p.*) AS tutor
         FROM courses c
         LEFT JOIN course_categories cat ON c.category_id = cat.id
         LEFT JOIN profiles p ON c.tutor_id = p.id
         WHERE c.id = $1`
      : `SELECT c.*, row_to_json(cat.*) AS category, row_to_json(p.*) AS tutor
         FROM courses c
         LEFT JOIN course_categories cat ON c.category_id = cat.id
         LEFT JOIN profiles p ON c.tutor_id = p.id
         WHERE c.slug = $1`;
    const res = await db.query(query, [idOrSlug]);
    if (!res.rows[0]) return null;
    const r = res.rows[0];
    return { ...r, price: Number(r.price ?? 0), tutor: stripPassword(r.tutor) };
  },

  createCourse: async (courseData) => {
    const db = requireDb();
    const id = uuidv4();
    const now = new Date().toISOString();
    const res = await db.query(
      `
      INSERT INTO courses (id, title, slug, description, category_id, tutor_id, thumbnail_url, level, price, discount_from, hourly_rate, hourly_note, pricing_type, currency, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
      `,
      [
        id,
        courseData.title,
        courseData.slug,
        courseData.description || '',
        isUuid(courseData.category_id) ? courseData.category_id : null,
        isUuid(courseData.tutor_id) ? courseData.tutor_id : null,
        courseData.thumbnail_url || null,
        courseData.level || 'All Levels',
        Number(courseData.price) || 0,
        courseData.discount_from !== undefined && courseData.discount_from !== null ? Number(courseData.discount_from) : null,
        courseData.hourly_rate !== undefined && courseData.hourly_rate !== null ? Number(courseData.hourly_rate) : null,
        courseData.hourly_note || null,
        courseData.pricing_type || 'monthly',
        courseData.currency || 'GBP',
        courseData.status || 'published',
        now,
        now
      ]
    );
    return res.rows[0];
  },

  updateCourse: async (id, updates) => {
    if (!isUuid(id)) return null;
    const db = requireDb();
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, val] of Object.entries(updates || {})) {
      if (!COURSE_UPDATE_COLS.has(key) || val === undefined) continue;
      if ((key === 'category_id' || key === 'tutor_id') && val !== null && !isUuid(val)) continue;
      fields.push(`${key} = $${i}`);
      values.push(val);
      i++;
    }
    if (fields.length === 0) return store.getCourseById(id);

    fields.push(`updated_at = $${i}`);
    values.push(new Date().toISOString());
    i++;
    values.push(id);

    const res = await db.query(
      `UPDATE courses SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return res.rows[0] || null;
  },

  deleteCourse: async (id) => {
    if (!isUuid(id)) return false;
    const db = requireDb();
    await db.query('DELETE FROM courses WHERE id = $1', [id]);
    return true;
  },

  // ----------------------------
  // ENROLLMENTS
  // ----------------------------
  getEnrollments: async () => {
    const db = requireDb();
    const res = await db.query(`
      SELECT e.*,
        row_to_json(c.*) AS course,
        row_to_json(p.*) AS student
      FROM course_enrollments e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN profiles p ON e.student_id = p.id
      ORDER BY e.enrolled_at DESC
    `);
    return res.rows.map((r) => ({ ...r, student: stripPassword(r.student) }));
  },

  createEnrollment: async (enrollmentData) => {
    const db = requireDb();
    if (!isUuid(enrollmentData.course_id) || !isUuid(enrollmentData.student_id)) {
      const err = new Error('Valid course_id and student_id are required.');
      err.statusCode = 400;
      throw err;
    }
    const id = uuidv4();
    const now = new Date().toISOString();
    const res = await db.query(
      `
      INSERT INTO course_enrollments (id, course_id, student_id, course_track, status, progress_pct, enrolled_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (course_id, student_id) DO UPDATE SET
        status = EXCLUDED.status,
        course_track = COALESCE(EXCLUDED.course_track, course_enrollments.course_track)
      RETURNING *
      `,
      [
        id,
        enrollmentData.course_id,
        enrollmentData.student_id,
        enrollmentData.course_track || null,
        enrollmentData.status || 'enrolled',
        parseInt(enrollmentData.progress_pct, 10) || 0,
        now
      ]
    );
    return res.rows[0];
  },

  // ----------------------------
  // CLASSES
  // ----------------------------
  getClasses: async () => {
    const db = requireDb();
    const res = await db.query(`
      SELECT cl.*,
        row_to_json(c.*) AS course,
        row_to_json(p.*) AS tutor
      FROM classes cl
      LEFT JOIN courses c ON cl.course_id = c.id
      LEFT JOIN profiles p ON cl.tutor_id = p.id
      ORDER BY cl.scheduled_at ASC
    `);
    return res.rows.map((r) => ({ ...r, tutor: stripPassword(r.tutor) }));
  },

  getClassById: async (idOrRoom) => {
    if (!idOrRoom || typeof idOrRoom !== 'string') return null;
    const db = requireDb();
    const query = isUuid(idOrRoom)
      ? `SELECT cl.*, row_to_json(c.*) AS course, row_to_json(p.*) AS tutor
         FROM classes cl
         LEFT JOIN courses c ON cl.course_id = c.id
         LEFT JOIN profiles p ON cl.tutor_id = p.id
         WHERE cl.id = $1`
      : `SELECT cl.*, row_to_json(c.*) AS course, row_to_json(p.*) AS tutor
         FROM classes cl
         LEFT JOIN courses c ON cl.course_id = c.id
         LEFT JOIN profiles p ON cl.tutor_id = p.id
         WHERE UPPER(cl.meeting_room_id) = UPPER($1)`;
    const res = await db.query(query, [idOrRoom.trim()]);
    if (!res.rows[0]) return null;
    return { ...res.rows[0], tutor: stripPassword(res.rows[0].tutor) };
  },

  createClass: async (classData) => {
    const db = requireDb();
    const id = uuidv4();
    const meetingRoomId = classData.meeting_room_id || `ROOM-${Date.now().toString(36).toUpperCase()}`;
    const res = await db.query(
      `
      INSERT INTO classes (id, course_id, tutor_id, title, description, scheduled_at, duration_minutes, meeting_room_id, presentation_url, presentation_pages, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      [
        id,
        isUuid(classData.course_id) ? classData.course_id : null,
        classData.tutor_id,
        classData.title,
        classData.description || '',
        classData.scheduled_at || new Date().toISOString(),
        parseInt(classData.duration_minutes, 10) || 60,
        meetingRoomId,
        classData.presentation_url || '/slides/sample-presentation.pdf',
        parseInt(classData.presentation_pages, 10) || 5,
        classData.status || 'scheduled'
      ]
    );
    return res.rows[0];
  },

  updateClass: async (idOrRoom, updates) => {
    if (!idOrRoom || typeof idOrRoom !== 'string') return null;
    const db = requireDb();
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, val] of Object.entries(updates || {})) {
      if (!CLASS_UPDATE_COLS.has(key) || val === undefined) continue;
      if ((key === 'course_id' || key === 'tutor_id') && val !== null && !isUuid(val)) continue;
      fields.push(`${key} = $${i}`);
      values.push(val);
      i++;
    }
    if (fields.length === 0) return store.getClassById(idOrRoom);

    fields.push(`updated_at = NOW()`);
    values.push(idOrRoom.trim());

    const whereClause = isUuid(idOrRoom) ? `id = $${i}` : `UPPER(meeting_room_id) = UPPER($${i})`;
    const res = await db.query(`UPDATE classes SET ${fields.join(', ')} WHERE ${whereClause} RETURNING *`, values);
    return res.rows[0] || null;
  },

  // ----------------------------
  // ATTENDANCE
  // ----------------------------
  getAttendance: async () => {
    const db = requireDb();
    const res = await db.query(`
      SELECT a.*,
        row_to_json(cl.*) AS class,
        row_to_json(p.*) AS user
      FROM class_attendance a
      LEFT JOIN classes cl ON a.class_id = cl.id
      LEFT JOIN profiles p ON a.user_id = p.id
      ORDER BY a.joined_at DESC
    `);
    return res.rows.map((r) => ({ ...r, user: stripPassword(r.user) }));
  },

  logAttendance: async (attendanceData) => {
    const db = requireDb();
    if (!isUuid(attendanceData.class_id) || !isUuid(attendanceData.user_id)) return null;
    const id = uuidv4();
    const res = await db.query(
      `
      INSERT INTO class_attendance (id, class_id, user_id, role, joined_at, duration_minutes, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        id,
        attendanceData.class_id,
        attendanceData.user_id,
        attendanceData.role || 'student',
        attendanceData.joined_at || new Date().toISOString(),
        parseInt(attendanceData.duration_minutes, 10) || 0,
        attendanceData.status || 'present'
      ]
    );
    return res.rows[0];
  },

  updateAttendance: async (id, updates) => {
    if (!isUuid(id)) return null;
    const db = requireDb();
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, val] of Object.entries(updates || {})) {
      if (!ATTENDANCE_UPDATE_COLS.has(key) || val === undefined) continue;
      fields.push(`${key} = $${i}`);
      values.push(val);
      i++;
    }
    if (fields.length === 0) return null;
    values.push(id);

    const res = await db.query(
      `UPDATE class_attendance SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return res.rows[0] || null;
  },

  // ----------------------------
  // LEARNING MATERIALS
  // ----------------------------
  getMaterials: async () => {
    const db = requireDb();
    const res = await db.query(`
      SELECT m.*,
        row_to_json(c.*) AS course,
        row_to_json(p.*) AS uploader
      FROM learning_materials m
      LEFT JOIN courses c ON m.course_id = c.id
      LEFT JOIN profiles p ON m.uploader_id = p.id
      ORDER BY m.created_at DESC
    `);
    return res.rows.map((r) => ({ ...r, uploader: stripPassword(r.uploader) }));
  },

  createMaterial: async (materialData) => {
    const db = requireDb();
    const id = uuidv4();
    const res = await db.query(
      `
      INSERT INTO learning_materials (id, course_id, class_id, uploader_id, title, file_url, file_type, file_size, is_presentation, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
      `,
      [
        id,
        isUuid(materialData.course_id) ? materialData.course_id : null,
        isUuid(materialData.class_id) ? materialData.class_id : null,
        materialData.uploader_id,
        materialData.title,
        materialData.file_url,
        materialData.file_type || 'application/octet-stream',
        parseInt(materialData.file_size, 10) || 0,
        Boolean(materialData.is_presentation)
      ]
    );
    return res.rows[0];
  },

  deleteMaterial: async (id) => {
    if (!isUuid(id)) return false;
    const db = requireDb();
    await db.query('DELETE FROM learning_materials WHERE id = $1', [id]);
    return true;
  },

  // ----------------------------
  // RECORDINGS
  // ----------------------------
  getRecordings: async () => {
    const db = requireDb();
    const res = await db.query(`
      SELECT r.*,
        row_to_json(cl.*) AS class
      FROM class_recordings r
      LEFT JOIN classes cl ON r.class_id = cl.id
      ORDER BY r.created_at DESC
    `);
    return res.rows;
  },

  createRecording: async (recordingData) => {
    const db = requireDb();
    const id = uuidv4();
    const res = await db.query(
      `
      INSERT INTO class_recordings (id, class_id, title, recording_url, duration_seconds, file_size, is_published, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
      `,
      [
        id,
        recordingData.class_id,
        recordingData.title,
        recordingData.recording_url,
        parseInt(recordingData.duration_seconds, 10) || 0,
        parseInt(recordingData.file_size, 10) || 0,
        recordingData.is_published !== undefined ? Boolean(recordingData.is_published) : true
      ]
    );
    return res.rows[0];
  },

  deleteRecording: async (id) => {
    if (!isUuid(id)) return null;
    const db = requireDb();
    const res = await db.query('DELETE FROM class_recordings WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] || null;
  },

  // ----------------------------
  // PARENT-STUDENT LINKS
  // ----------------------------
  getParentStudentLinks: async () => {
    const db = requireDb();
    const res = await db.query(`
      SELECT l.*,
        row_to_json(par.*) AS parent,
        row_to_json(stu.*) AS student
      FROM parent_student_links l
      LEFT JOIN profiles par ON l.parent_id = par.id
      LEFT JOIN profiles stu ON l.student_id = stu.id
      ORDER BY l.created_at DESC
    `);
    return res.rows.map((r) => ({
      ...r,
      parent: stripPassword(r.parent),
      student: stripPassword(r.student)
    }));
  },

  createParentStudentLink: async (linkData) => {
    const db = requireDb();
    const id = uuidv4();
    const res = await db.query(
      `
      INSERT INTO parent_student_links (id, parent_id, student_id, relationship, status, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (parent_id, student_id) DO UPDATE SET
        relationship = EXCLUDED.relationship,
        status = EXCLUDED.status
      RETURNING *
      `,
      [id, linkData.parent_id, linkData.student_id, linkData.relationship || 'Parent', linkData.status || 'active']
    );
    return res.rows[0];
  },

  // ----------------------------
  // NOTIFICATIONS
  // ----------------------------
  getNotifications: async (userId) => {
    const db = requireDb();
    if (userId) {
      if (!isUuid(userId)) return [];
      const res = await db.query(
        'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
        [userId]
      );
      return res.rows;
    }
    const res = await db.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100');
    return res.rows;
  },

  createNotification: async (notifData) => {
    const db = requireDb();
    if (!isUuid(notifData.user_id)) return null;
    const id = uuidv4();
    const res = await db.query(
      `
      INSERT INTO notifications (id, user_id, title, message, type, link, is_read, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, FALSE, NOW())
      RETURNING *
      `,
      [
        id,
        notifData.user_id,
        notifData.title || 'Notification',
        notifData.message || '',
        notifData.type || 'system',
        notifData.link || null
      ]
    );
    return res.rows[0];
  },

  markNotificationAsRead: async (id, userId = null) => {
    if (!isUuid(id)) return false;
    const db = requireDb();
    if (userId && isUuid(userId)) {
      await db.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [id, userId]);
    } else {
      await db.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [id]);
    }
    return true;
  },

  deleteNotification: async (id, userId) => {
    if (!isUuid(id)) return false;
    const db = requireDb();
    if (userId && isUuid(userId)) {
      const res = await db.query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [id, userId]);
      return res.rowCount > 0;
    }
    const res = await db.query('DELETE FROM notifications WHERE id = $1', [id]);
    return res.rowCount > 0;
  },

  clearAllNotifications: async (userId) => {
    if (!isUuid(userId)) return false;
    const db = requireDb();
    await db.query('DELETE FROM notifications WHERE user_id = $1', [userId]);
    return true;
  },

  // ----------------------------
  // ANNOUNCEMENTS
  // ----------------------------
  getAnnouncements: async () => {
    const db = requireDb();
    const res = await db.query(`
      SELECT a.*,
        row_to_json(p.*) AS sender
      FROM announcements a
      LEFT JOIN profiles p ON a.sender_id = p.id
      ORDER BY a.created_at DESC
    `);
    return res.rows.map((r) => ({
      ...r,
      sender: stripPassword(r.sender),
      sender_name: r.sender?.full_name || 'Administration'
    }));
  },

  createAnnouncement: async (annData) => {
    const db = requireDb();
    const id = uuidv4();
    const res = await db.query(
      `
      INSERT INTO announcements (id, sender_id, title, content, target_role, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
      `,
      [id, annData.sender_id, annData.title, annData.content, annData.target_role || 'all']
    );
    return res.rows[0];
  },

  // ----------------------------
  // AUDIT LOGS
  // ----------------------------
  getAuditLogs: async () => {
    const db = requireDb();
    const res = await db.query(`
      SELECT al.*,
        p.email AS user_email,
        row_to_json(p.*) AS user
      FROM audit_logs al
      LEFT JOIN profiles p ON al.user_id = p.id
      ORDER BY al.created_at DESC
      LIMIT 200
    `);
    return res.rows.map((r) => ({
      ...r,
      user_email: r.user_email || 'System',
      user: stripPassword(r.user)
    }));
  },

  logAudit: async (auditData) => {
    const db = requireDb();
    try {
      const id = uuidv4();
      const userId = isUuid(auditData.user_id) ? auditData.user_id : null;
      const res = await db.query(
        `
        INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, ip_address, details, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *
        `,
        [
          id,
          userId,
          auditData.action || 'UNKNOWN_ACTION',
          auditData.entity_type || auditData.resource || 'SYSTEM',
          String(auditData.entity_id || auditData.resource_id || ''),
          auditData.ip_address || 'unknown',
          auditData.details ? JSON.stringify(auditData.details) : null
        ]
      );
      return res.rows[0];
    } catch (err) {
      console.warn('[audit_logs write notice]:', err.message);
      return null;
    }
  },

  // ----------------------------
  // PLATFORM SETTINGS
  // ----------------------------
  getSettings: async () => {
    const db = requireDb();
    const res = await db.query('SELECT key, value FROM platform_settings');
    const merged = { ...DEFAULT_PLATFORM_SETTINGS };
    for (const row of res.rows) {
      merged[row.key] = row.value;
    }
    return merged;
  },

  updateSettings: async (newSettings) => {
    const db = requireDb();
    const ALLOWED_SETTINGS_KEYS = new Set([
      'platform_name',
      'contact_email',
      'currency',
      'currency_symbol',
      'allow_public_registration',
      'enable_recordings',
      'enable_whiteboard',
      'maintenance_mode',
      'default_tuition_fee'
    ]);

    for (const [key, value] of Object.entries(newSettings || {})) {
      if (!ALLOWED_SETTINGS_KEYS.has(key)) continue;
      await db.query(
        `
        INSERT INTO platform_settings (key, value, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
        `,
        [key, String(value)]
      );
    }
    return store.getSettings();
  },

  // ----------------------------
  // JOINT FAMILY REGISTRATION (PostgreSQL-only)
  // ----------------------------
  registerJoint: async ({ student, parent, course_id, course_track, selected_subjects, payment_proof_url, bank_reference, amount }) => {
    const db = requireDb();
    const existingStudent = await store.getProfileByEmail(student.email);
    const existingParent = await store.getProfileByEmail(parent.email);
    const chosenCourse = course_id ? await store.getCourseById(course_id) : null;
    const resolvedCourseId = chosenCourse ? chosenCourse.id : '20000000-0000-0000-0000-000000000001';
    const courseNameWithTrack = course_track
      ? `${chosenCourse?.title || 'Academic Program'} (${course_track})`
      : (chosenCourse?.title || 'Academic Program');
    const subjectsList = Array.isArray(selected_subjects) && selected_subjects.length > 0
      ? selected_subjects.join(', ')
      : (student.grade || 'Curriculum Program');

    // Idempotent re-submission if both profiles already exist and are pending_verification
    if (
      existingStudent &&
      existingParent &&
      existingStudent.status === 'pending_verification' &&
      existingParent.status === 'pending_verification'
    ) {
      const pgPay = await db.query(
        'SELECT * FROM payments WHERE student_id = $1 OR parent_id = $2 ORDER BY created_at DESC LIMIT 1',
        [existingStudent.id, existingParent.id]
      );
      let existingPayment = pgPay.rows[0] || null;

      if (existingPayment) {
        const updatedNotes = `Payment proof updated. Bank Ref: ${bank_reference || existingPayment.bank_reference}. Awaiting bursar confirmation.`;
        const upd = await db.query(
          `UPDATE payments
           SET proof_url = COALESCE($1, proof_url),
               bank_reference = COALESCE($2, bank_reference),
               amount = COALESCE($3, amount),
               admin_notes = $4
           WHERE id = $5
           RETURNING *`,
          [
            payment_proof_url || null,
            bank_reference || null,
            amount ? parseFloat(amount) : null,
            updatedNotes,
            existingPayment.id
          ]
        );
        existingPayment = upd.rows[0] || existingPayment;
      } else {
        const ins = await db.query(
          `INSERT INTO payments (id, parent_id, student_id, course_id, course_track, course_name, selected_subjects, amount, currency, bank_reference, proof_url, status, admin_notes, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'GBP', $9, $10, 'pending', $11, NOW())
           RETURNING *`,
          [
            uuidv4(),
            existingParent.id,
            existingStudent.id,
            resolvedCourseId,
            course_track || null,
            courseNameWithTrack,
            JSON.stringify(selected_subjects || []),
            parseFloat(amount) || Number(chosenCourse?.price || 299),
            bank_reference || `BBA-${Date.now().toString(36).toUpperCase()}`,
            payment_proof_url || '',
            `Program: ${courseNameWithTrack}. Subjects: ${subjectsList}. Monthly tuition awaiting bursar confirmation.`
          ]
        );
        existingPayment = ins.rows[0];
      }

      await store.createParentStudentLink({
        parent_id: existingParent.id,
        student_id: existingStudent.id,
        relationship: parent.relationship || 'Parent'
      });
      await store.createEnrollment({
        course_id: resolvedCourseId,
        course_track: course_track || null,
        student_id: existingStudent.id,
        status: 'enrolled',
        progress_pct: 0
      });

      return { student: existingStudent, parent: existingParent, payment: existingPayment, idempotent: true };
    }

    if (existingStudent) {
      const err = new Error(`Student email '${student.email}' is already registered.`);
      err.statusCode = 409;
      throw err;
    }
    if (existingParent) {
      const err = new Error(`Parent email '${parent.email}' is already registered.`);
      err.statusCode = 409;
      throw err;
    }

    const studentHash = await bcrypt.hash(student.password, 10);
    const parentHash = await bcrypt.hash(parent.password, 10);

    const studentProfile = await store.createProfile({
      email: student.email,
      password_hash: studentHash,
      full_name: student.full_name,
      role: 'student',
      phone: student.phone || '',
      bio: `Program: ${courseNameWithTrack} | Grade/Level: ${student.grade || 'Student'} | Subjects: ${subjectsList}`,
      status: 'pending_verification',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.full_name)}`
    });

    const parentProfile = await store.createProfile({
      email: parent.email,
      password_hash: parentHash,
      full_name: parent.full_name,
      role: 'parent',
      phone: parent.phone || '',
      bio: `Parent/Guardian of ${student.full_name} (${parent.relationship || 'Parent'})`,
      status: 'pending_verification',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(parent.full_name)}`
    });

    const link = await store.createParentStudentLink({
      parent_id: parentProfile.id,
      student_id: studentProfile.id,
      relationship: parent.relationship || 'Parent'
    });

    const payRes = await db.query(
      `INSERT INTO payments (id, parent_id, student_id, course_id, course_track, course_name, selected_subjects, amount, currency, bank_reference, proof_url, status, admin_notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'GBP', $9, $10, 'pending', $11, NOW())
       RETURNING *`,
      [
        uuidv4(),
        parentProfile.id,
        studentProfile.id,
        resolvedCourseId,
        course_track || null,
        courseNameWithTrack,
        JSON.stringify(selected_subjects || []),
        parseFloat(amount) || Number(chosenCourse?.price || 299),
        bank_reference || `BBA-${Date.now().toString(36).toUpperCase()}`,
        payment_proof_url || '',
        `Program: ${courseNameWithTrack}. Subjects: ${subjectsList}. Monthly tuition awaiting bursar confirmation.`
      ]
    );
    const paymentRecord = payRes.rows[0];

    await store.createEnrollment({
      course_id: resolvedCourseId,
      course_track: course_track || null,
      student_id: studentProfile.id,
      status: 'enrolled',
      progress_pct: 0
    });

    const adminsRes = await db.query("SELECT id FROM profiles WHERE role IN ('superadmin', 'admin')");
    for (const admin of adminsRes.rows) {
      await store.createNotification({
        user_id: admin.id,
        title: 'New Student & Parent Registration',
        message: `New registration: ${student.full_name} (Student) & ${parent.full_name} for ${courseNameWithTrack}. Monthly tuition £${paymentRecord.amount} GBP.`,
        type: 'payment',
        link: '/admin/payments'
      });
    }

    return { student: studentProfile, parent: parentProfile, payment: paymentRecord, link };
  },

  // ----------------------------
  // IELTS CANDIDATE REGISTRATION (PostgreSQL-only)
  // ----------------------------
  registerIelts: async ({ candidate, ielts_track, target_band, exam_date, focus_modules, payment_proof_url, bank_reference, amount }) => {
    const db = requireDb();
    const existingCandidate = await store.getProfileByEmail(candidate.email);
    const trackLabel = ielts_track || 'IELTS Academic';
    const bandStr = target_band ? `Target Band ${target_band}` : 'Target Band 7.5+';
    const courseName = `IELTS Academic & UKVI Exam Preparation (${trackLabel})`;

    if (existingCandidate && existingCandidate.status === 'pending_verification') {
      const pgPay = await db.query(
        'SELECT * FROM payments WHERE student_id = $1 ORDER BY created_at DESC LIMIT 1',
        [existingCandidate.id]
      );
      let existingPayment = pgPay.rows[0] || null;

      if (existingPayment) {
        const upd = await db.query(
          `UPDATE payments
           SET proof_url = COALESCE($1, proof_url),
               bank_reference = COALESCE($2, bank_reference),
               amount = COALESCE($3, amount),
               admin_notes = $4
           WHERE id = $5
           RETURNING *`,
          [
            payment_proof_url || null,
            bank_reference || null,
            amount ? parseFloat(amount) : null,
            `IELTS Candidate proof updated. Track: ${trackLabel}. Bank Ref: ${bank_reference || existingPayment.bank_reference}.`,
            existingPayment.id
          ]
        );
        existingPayment = upd.rows[0] || existingPayment;
      } else {
        const ins = await db.query(
          `INSERT INTO payments (id, parent_id, student_id, course_id, course_track, course_name, selected_subjects, amount, currency, bank_reference, proof_url, status, admin_notes, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'GBP', $9, $10, 'pending', $11, NOW())
           RETURNING *`,
          [
            uuidv4(),
            existingCandidate.id,
            existingCandidate.id,
            IELTS_COURSE_ID,
            trackLabel,
            courseName,
            JSON.stringify(focus_modules || ['Speaking', 'Writing Task 1 & 2', 'Reading', 'Listening']),
            parseFloat(amount) || 100.00,
            bank_reference || `IELTS-${Date.now().toString(36).toUpperCase()}`,
            payment_proof_url || '',
            `IELTS Candidate: ${candidate.full_name} (${trackLabel}, ${bandStr}). Monthly £100 GBP awaiting verification.`
          ]
        );
        existingPayment = ins.rows[0];
      }

      return { student: existingCandidate, payment: existingPayment, idempotent: true };
    }

    if (existingCandidate) {
      const err = new Error(`Candidate email '${candidate.email}' is already registered.`);
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(candidate.password, 10);
    const modulesStr = Array.isArray(focus_modules) && focus_modules.length > 0
      ? focus_modules.join(', ')
      : 'All 4 IELTS Modules';

    const studentProfile = await store.createProfile({
      email: candidate.email,
      password_hash: passwordHash,
      full_name: candidate.full_name,
      role: 'student',
      phone: candidate.phone || '',
      bio: `Program: ${trackLabel} (£100/month) | ${bandStr} | Focus: ${modulesStr}${exam_date ? ` | Exam Date: ${exam_date}` : ''}`,
      status: 'pending_verification',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(candidate.full_name)}`
    });

    const payRes = await db.query(
      `INSERT INTO payments (id, parent_id, student_id, course_id, course_track, course_name, selected_subjects, amount, currency, bank_reference, proof_url, status, admin_notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'GBP', $9, $10, 'pending', $11, NOW())
       RETURNING *`,
      [
        uuidv4(),
        studentProfile.id,
        studentProfile.id,
        IELTS_COURSE_ID,
        trackLabel,
        courseName,
        JSON.stringify(focus_modules || ['Speaking', 'Writing Task 1 & 2', 'Reading', 'Listening']),
        parseFloat(amount) || 100.00,
        bank_reference || `IELTS-${Date.now().toString(36).toUpperCase()}`,
        payment_proof_url || '',
        `IELTS Candidate: ${candidate.full_name} (${trackLabel}, ${bandStr}). Monthly £100 GBP awaiting verification.`
      ]
    );
    const paymentRecord = payRes.rows[0];

    await store.createEnrollment({
      course_id: IELTS_COURSE_ID,
      course_track: trackLabel,
      student_id: studentProfile.id,
      status: 'enrolled',
      progress_pct: 0
    });

    const adminsRes = await db.query("SELECT id FROM profiles WHERE role IN ('superadmin', 'admin')");
    for (const admin of adminsRes.rows) {
      await store.createNotification({
        user_id: admin.id,
        title: 'New IELTS Candidate Registration',
        message: `IELTS registration: ${candidate.full_name} (${trackLabel}, ${bandStr}). Monthly tuition £${paymentRecord.amount} GBP.`,
        type: 'payment',
        link: '/admin/payments'
      });
    }

    return { student: studentProfile, payment: paymentRecord };
  },

  // ----------------------------
  // PAYMENTS & VERIFICATION
  // ----------------------------
  getPayments: async () => {
    const db = requireDb();
    const res = await db.query(`
      SELECT pay.*,
        row_to_json(par.*) AS parent,
        row_to_json(stu.*) AS student,
        row_to_json(c.*) AS course,
        row_to_json(ver.*) AS verifier
      FROM payments pay
      LEFT JOIN profiles par ON pay.parent_id = par.id
      LEFT JOIN profiles stu ON pay.student_id = stu.id
      LEFT JOIN courses c ON pay.course_id = c.id
      LEFT JOIN profiles ver ON pay.verified_by = ver.id
      ORDER BY pay.created_at DESC
    `);

    return res.rows.map((p) => {
      const courseTitle = p.course_name || (p.course_track ? `${p.course?.title || 'Program'} (${p.course_track})` : (p.course?.title || 'Selected Program'));
      return {
        ...p,
        amount: Number(p.amount ?? 0),
        course_display_name: courseTitle,
        parent: stripPassword(p.parent),
        student: stripPassword(p.student),
        verifier: stripPassword(p.verifier)
      };
    });
  },

  submitPaymentProof: async ({ parent_id, student_id, course_id, course_track, amount, bank_reference, proof_url, notes }) => {
    const db = requireDb();
    const chosenCourse = course_id ? await store.getCourseById(course_id) : null;
    const courseNameWithTrack = course_track
      ? `${chosenCourse?.title || 'Academic Program'} (${course_track})`
      : (chosenCourse?.title || 'Academic Program');

    const res = await db.query(
      `INSERT INTO payments (id, parent_id, student_id, course_id, course_track, course_name, amount, currency, bank_reference, proof_url, status, admin_notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'GBP', $8, $9, 'pending', $10, NOW())
       RETURNING *`,
      [
        uuidv4(),
        isUuid(parent_id) ? parent_id : null,
        isUuid(student_id) ? student_id : null,
        chosenCourse ? chosenCourse.id : null,
        course_track || null,
        courseNameWithTrack,
        parseFloat(amount) || Number(chosenCourse?.price || 299),
        bank_reference || `WIRE-${Date.now().toString(36).toUpperCase()}`,
        proof_url || '',
        notes || `Monthly proof of payment for ${courseNameWithTrack}`
      ]
    );
    const newPayment = res.rows[0];

    const adminsRes = await db.query("SELECT id FROM profiles WHERE role IN ('superadmin', 'admin')");
    for (const admin of adminsRes.rows) {
      await store.createNotification({
        user_id: admin.id,
        title: 'New Proof of Payment Uploaded',
        message: `New payment proof uploaded for ${courseNameWithTrack} (Ref: ${newPayment.bank_reference}).`,
        type: 'payment',
        link: '/admin/payments'
      });
    }

    return newPayment;
  },

  verifyPayment: async (paymentId, adminId) => {
    if (!isUuid(paymentId)) {
      const err = new Error('Invalid payment ID.');
      err.statusCode = 400;
      throw err;
    }
    const db = requireDb();
    const verifiedAt = new Date().toISOString();
    const adminNotes = 'Payment verified and confirmed by Administrator.';

    const res = await db.query(
      `UPDATE payments
       SET status = 'verified', verified_by = $1, verified_at = $2, admin_notes = $3
       WHERE id = $4
       RETURNING *`,
      [isUuid(adminId) ? adminId : null, verifiedAt, adminNotes, paymentId]
    );
    const payment = res.rows[0];
    if (!payment) {
      const err = new Error('Payment record not found.');
      err.statusCode = 404;
      throw err;
    }

    if (payment.student_id) {
      await store.updateProfile(payment.student_id, { status: 'active' });
    }
    if (payment.parent_id && payment.parent_id !== payment.student_id) {
      await store.updateProfile(payment.parent_id, { status: 'active' });
    }

    // Also unlock any linked family members in parent_student_links
    if (payment.parent_id || payment.student_id) {
      await db.query(
        `UPDATE profiles
         SET status = 'active', updated_at = NOW()
         WHERE status = 'pending_verification'
           AND id IN (
             SELECT student_id FROM parent_student_links WHERE parent_id = $1
             UNION
             SELECT parent_id FROM parent_student_links WHERE student_id = $2
           )`,
        [payment.parent_id || null, payment.student_id || null]
      );
    }

    if (payment.course_id && payment.student_id) {
      await store.createEnrollment({
        course_id: payment.course_id,
        course_track: payment.course_track || null,
        student_id: payment.student_id,
        status: 'enrolled',
        progress_pct: 0
      });
    }

    const student = payment.student_id ? await store.getProfileById(payment.student_id) : null;

    if (payment.student_id) {
      await store.createNotification({
        user_id: payment.student_id,
        title: 'Payment Confirmed & Account Activated!',
        message: 'Your tuition payment has been verified by the administrator. You may now access all classes and materials.',
        type: 'payment',
        link: '/student/dashboard'
      });
    }

    if (payment.parent_id && payment.parent_id !== payment.student_id) {
      await store.createNotification({
        user_id: payment.parent_id,
        title: 'Tuition Payment Confirmed & Child Account Activated',
        message: `Your payment for ${student?.full_name || 'your child'} was verified. Both parent and student portals are now unlocked.`,
        type: 'payment',
        link: '/parent/dashboard'
      });
    }

    return payment;
  },

  rejectPayment: async (paymentId, adminNotes) => {
    if (!isUuid(paymentId)) {
      const err = new Error('Invalid payment ID.');
      err.statusCode = 400;
      throw err;
    }
    const db = requireDb();
    const notes = adminNotes || 'Proof of payment was unclear or could not be verified.';
    const res = await db.query(
      `UPDATE payments SET status = 'rejected', admin_notes = $1 WHERE id = $2 RETURNING *`,
      [notes, paymentId]
    );
    const payment = res.rows[0];
    if (!payment) {
      const err = new Error('Payment record not found.');
      err.statusCode = 404;
      throw err;
    }

    if (payment.parent_id) {
      await store.createNotification({
        user_id: payment.parent_id,
        title: 'Payment Verification Required',
        message: `Payment reference ${payment.bank_reference} could not be confirmed: ${notes}. Please upload a clear receipt.`,
        type: 'payment',
        link: '/payment-proof'
      });
    }

    return payment;
  },

  deletePayment: async (paymentId) => {
    if (!isUuid(paymentId)) return null;
    const db = requireDb();
    const res = await db.query('DELETE FROM payments WHERE id = $1 RETURNING *', [paymentId]);
    return res.rows[0] || { id: paymentId };
  },

  // ----------------------------
  // ASSIGNMENTS & SUBMISSIONS
  // ----------------------------
  getAssignments: async (courseId) => {
    const db = requireDb();
    const params = [];
    let where = '';
    if (courseId && isUuid(courseId)) {
      params.push(courseId);
      where = 'WHERE a.course_id = $1';
    }
    const res = await db.query(
      `SELECT a.*,
        row_to_json(c.*) AS course,
        row_to_json(p.*) AS tutor,
        (SELECT COUNT(*)::int FROM assignment_submissions s WHERE s.assignment_id = a.id) AS "submissionCount"
       FROM assignments a
       LEFT JOIN courses c ON a.course_id = c.id
       LEFT JOIN profiles p ON a.tutor_id = p.id
       ${where}
       ORDER BY a.created_at DESC`,
      params
    );
    return res.rows.map((r) => ({ ...r, tutor: stripPassword(r.tutor) }));
  },

  getAssignmentById: async (id) => {
    if (!isUuid(id)) return null;
    const db = requireDb();
    const res = await db.query(
      `SELECT a.*,
        row_to_json(c.*) AS course,
        row_to_json(p.*) AS tutor
       FROM assignments a
       LEFT JOIN courses c ON a.course_id = c.id
       LEFT JOIN profiles p ON a.tutor_id = p.id
       WHERE a.id = $1`,
      [id]
    );
    if (!res.rows[0]) return null;

    const subsRes = await db.query(
      `SELECT s.*, row_to_json(st.*) AS student
       FROM assignment_submissions s
       LEFT JOIN profiles st ON s.student_id = st.id
       WHERE s.assignment_id = $1
       ORDER BY s.submitted_at DESC`,
      [id]
    );
    return {
      ...res.rows[0],
      tutor: stripPassword(res.rows[0].tutor),
      submissions: subsRes.rows.map((s) => ({ ...s, student: stripPassword(s.student) }))
    };
  },

  createAssignment: async (assignmentData) => {
    const db = requireDb();
    const id = uuidv4();
    const res = await db.query(
      `INSERT INTO assignments (id, course_id, tutor_id, title, description, due_date, max_score, file_url, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [
        id,
        assignmentData.course_id,
        assignmentData.tutor_id,
        assignmentData.title,
        assignmentData.description || '',
        assignmentData.due_date,
        parseInt(assignmentData.max_score, 10) || 100,
        assignmentData.file_url || ''
      ]
    );
    const newAssignment = res.rows[0];

    const course = await store.getCourseById(newAssignment.course_id);
    const enrolledRes = await db.query(
      `SELECT e.student_id, p.full_name FROM course_enrollments e JOIN profiles p ON p.id = e.student_id WHERE e.course_id = $1`,
      [newAssignment.course_id]
    );

    for (const st of enrolledRes.rows) {
      await store.createNotification({
        user_id: st.student_id,
        title: `New Assignment: ${newAssignment.title}`,
        message: `Course: ${course?.title || 'Your Course'}. Due Date: ${new Date(newAssignment.due_date).toLocaleString()}. Max Score: ${newAssignment.max_score} pts.`,
        type: 'assignment',
        link: '/student/assignments'
      });

      const parRes = await db.query(
        `SELECT parent_id FROM parent_student_links WHERE student_id = $1 AND status = 'active'`,
        [st.student_id]
      );
      for (const link of parRes.rows) {
        await store.createNotification({
          user_id: link.parent_id,
          title: `Assignment Notice for ${st.full_name}`,
          message: `New coursework "${newAssignment.title}" was assigned. Deadline is ${new Date(newAssignment.due_date).toLocaleDateString()}.`,
          type: 'assignment',
          link: '/parent/assignments'
        });
      }
    }

    return newAssignment;
  },

  getSubmissions: async ({ assignment_id, student_id } = {}) => {
    const db = requireDb();
    const clauses = [];
    const params = [];
    if (assignment_id && isUuid(assignment_id)) {
      params.push(assignment_id);
      clauses.push(`s.assignment_id = $${params.length}`);
    }
    if (student_id && isUuid(student_id)) {
      params.push(student_id);
      clauses.push(`s.student_id = $${params.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const res = await db.query(
      `SELECT s.*,
        row_to_json(a.*) AS assignment,
        row_to_json(st.*) AS student
       FROM assignment_submissions s
       LEFT JOIN assignments a ON s.assignment_id = a.id
       LEFT JOIN profiles st ON s.student_id = st.id
       ${where}
       ORDER BY s.submitted_at DESC`,
      params
    );
    return res.rows.map((r) => ({ ...r, student: stripPassword(r.student) }));
  },

  submitAssignment: async ({ assignment_id, student_id, submission_text, file_url }) => {
    const db = requireDb();
    const id = uuidv4();
    const res = await db.query(
      `INSERT INTO assignment_submissions (id, assignment_id, student_id, submission_text, file_url, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, 'submitted', NOW())
       ON CONFLICT (assignment_id, student_id) DO UPDATE SET
         submission_text = EXCLUDED.submission_text,
         file_url = EXCLUDED.file_url,
         status = 'submitted',
         submitted_at = NOW()
       RETURNING *`,
      [id, assignment_id, student_id, submission_text || '', file_url || '']
    );
    const sub = res.rows[0];

    const assignment = await store.getAssignmentById(assignment_id);
    const student = await store.getProfileById(student_id);
    if (assignment?.tutor_id) {
      await store.createNotification({
        user_id: assignment.tutor_id,
        title: 'New Student Assignment Submission',
        message: `${student?.full_name || 'A student'} submitted work for "${assignment.title}".`,
        type: 'assignment',
        link: '/tutor/assignments'
      });
    }
    return sub;
  },

  gradeSubmission: async (submissionId, { score, feedback }) => {
    if (!isUuid(submissionId)) {
      const err = new Error('Invalid submission ID.');
      err.statusCode = 400;
      throw err;
    }
    const db = requireDb();
    const res = await db.query(
      `UPDATE assignment_submissions
       SET score = $1, feedback = $2, status = 'graded', graded_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [parseInt(score, 10), feedback || '', submissionId]
    );
    const sub = res.rows[0];
    if (!sub) {
      const err = new Error('Submission not found.');
      err.statusCode = 404;
      throw err;
    }

    const assignment = await store.getAssignmentById(sub.assignment_id);
    const student = await store.getProfileById(sub.student_id);

    if (student) {
      await store.createNotification({
        user_id: student.id,
        title: `Assignment Graded: ${assignment?.title || 'Assignment'}`,
        message: `Your score: ${sub.score}/${assignment?.max_score || 100}. Feedback: "${sub.feedback}"`,
        type: 'assignment',
        link: '/student/assignments'
      });

      const parRes = await db.query(
        `SELECT parent_id FROM parent_student_links WHERE student_id = $1 AND status = 'active'`,
        [student.id]
      );
      for (const link of parRes.rows) {
        await store.createNotification({
          user_id: link.parent_id,
          title: `Grade Report for ${student.full_name}: ${assignment?.title || 'Assignment'}`,
          message: `Scored ${sub.score}/${assignment?.max_score || 100}. Tutor feedback: "${sub.feedback}"`,
          type: 'assignment',
          link: '/parent/assignments'
        });
      }
    }
    return sub;
  },

  checkApproachingDeadlines: async () => {
    if (!pool) return [];
    const remindersSent = [];
    const res = await pool.query(`
      SELECT a.id, a.title, a.due_date, a.course_id, e.student_id, p.full_name AS student_name
      FROM assignments a
      JOIN course_enrollments e ON e.course_id = a.course_id
      JOIN profiles p ON p.id = e.student_id
      LEFT JOIN assignment_submissions s ON s.assignment_id = a.id AND s.student_id = e.student_id
      WHERE s.id IS NULL
        AND a.due_date > NOW()
        AND a.due_date <= NOW() + INTERVAL '48 hours'
    `);

    for (const row of res.rows) {
      const hoursRemaining = Math.max(1, Math.round((new Date(row.due_date).getTime() - Date.now()) / 3600000));
      await store.createNotification({
        user_id: row.student_id,
        title: `Upcoming Deadline: ${row.title}`,
        message: `Reminder: "${row.title}" is due in approximately ${hoursRemaining} hours.`,
        type: 'assignment',
        link: '/student/assignments'
      });
      remindersSent.push({ assignment: row.title, student: row.student_name });
    }
    return remindersSent;
  },

  // ----------------------------
  // TUTOR APPLICATIONS
  // ----------------------------
  getTutorApplications: async ({ status, subject } = {}) => {
    const db = requireDb();
    const params = [];
    const clauses = [];
    if (status && status !== 'all') {
      params.push(status);
      clauses.push(`status = $${params.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const res = await db.query(`SELECT * FROM tutor_applications ${where} ORDER BY created_at DESC`, params);
    let apps = res.rows.map((a) => ({
      ...a,
      current_role: a.current_position || a.current_role || '',
      selected_subjects: Array.isArray(a.selected_subjects) ? a.selected_subjects : []
    }));
    if (subject && subject !== 'all') {
      apps = apps.filter((a) => a.selected_subjects.includes(subject));
    }
    return apps;
  },

  getTutorApplicationById: async (id) => {
    if (!id || typeof id !== 'string') return null;
    const db = requireDb();
    const res = await db.query('SELECT * FROM tutor_applications WHERE id = $1', [id]);
    if (!res.rows[0]) return null;
    const a = res.rows[0];
    return {
      ...a,
      current_role: a.current_position || '',
      selected_subjects: Array.isArray(a.selected_subjects) ? a.selected_subjects : []
    };
  },

  createTutorApplication: async (data) => {
    const db = requireDb();
    const id = `app-${uuidv4()}`;
    const now = new Date().toISOString();
    const subjects = Array.isArray(data.selected_subjects) ? data.selected_subjects : [];

    const res = await db.query(
      `INSERT INTO tutor_applications (
        id, full_name, email, phone, location, highest_qualification, years_experience,
        current_position, selected_subjects, bio, teaching_approach, video_url,
        video_duration, video_filename, cv_url, degree_certificate_url, teaching_licence_url,
        safeguarding_acknowledged, safeguarding_version, safeguarding_signature, safeguarding_signed_at,
        dbs_status, dbs_certificate_number, status, admin_notes, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17,
        $18, $19, $20, $21,
        $22, $23, 'pending', '', $24, $25
      ) RETURNING *`,
      [
        id,
        data.full_name?.trim(),
        data.email?.trim().toLowerCase(),
        data.phone?.trim() || '',
        data.location?.trim() || 'United Kingdom',
        data.highest_qualification?.trim() || '',
        data.years_experience || '1-3 years',
        data.current_role?.trim() || data.current_position?.trim() || '',
        JSON.stringify(subjects),
        data.bio?.trim() || '',
        data.teaching_approach?.trim() || '',
        data.video_url?.trim() || '',
        data.video_duration || 'Approx. 3 minutes',
        data.video_filename || '',
        data.cv_url || null,
        data.degree_certificate_url || null,
        data.teaching_licence_url || null,
        Boolean(data.safeguarding_acknowledged),
        'v2.4-2026-UK-DFE-COMPLIANT',
        data.safeguarding_signature?.trim() || data.full_name?.trim(),
        now,
        data.dbs_status || 'Willing to undergo Enhanced DBS check',
        data.dbs_certificate_number || '',
        now,
        now
      ]
    );
    const newApp = res.rows[0];

    const adminsRes = await db.query("SELECT id FROM profiles WHERE role IN ('superadmin', 'admin')");
    for (const admin of adminsRes.rows) {
      await store.createNotification({
        user_id: admin.id,
        title: 'New Teacher Application Received',
        message: `${newApp.full_name} has applied to teach ${subjects.slice(0, 2).join(', ')}.`,
        type: 'system',
        link: '/admin/tutor-applications'
      });
    }

    return newApp;
  },

  updateTutorApplicationStatus: async (id, { status, admin_notes, reviewed_by, reviewed_by_id, tempPassword }) => {
    const db = requireDb();
    const app = await store.getTutorApplicationById(id);
    if (!app) return null;

    let provisionedCredentials = null;
    if (status === 'approved') {
      const generatedPass = tempPassword || `BBA-Tutor${Math.floor(1000 + Math.random() * 9000)}!`;
      const tempTutorHash = await bcrypt.hash(generatedPass, 10);

      await store.createProfile({
        email: app.email,
        password_hash: tempTutorHash,
        full_name: app.full_name,
        role: 'tutor',
        phone: app.phone || '',
        bio: `${app.highest_qualification || 'Qualified Educator'}. Specialised in ${Array.isArray(app.selected_subjects) ? app.selected_subjects.join(', ') : 'A-Level'}.`,
        status: 'active',
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(app.full_name)}`
      });

      provisionedCredentials = { email: app.email, tempPassword: generatedPass };
    }

    const res = await db.query(
      `UPDATE tutor_applications
       SET status = $1,
           admin_notes = COALESCE($2, admin_notes),
           reviewed_by = $3,
           reviewed_by_name = $4,
           reviewed_at = NOW(),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [
        status,
        admin_notes !== undefined ? admin_notes : null,
        isUuid(reviewed_by_id) ? reviewed_by_id : null,
        typeof reviewed_by === 'string' ? reviewed_by : 'Super Administrator',
        id
      ]
    );

    const updated = res.rows[0];
    return {
      ...updated,
      selected_subjects: Array.isArray(updated.selected_subjects) ? updated.selected_subjects : [],
      provisioned_credentials: provisionedCredentials
    };
  },

  deleteTutorApplication: async (id) => {
    const db = requireDb();
    const res = await db.query('DELETE FROM tutor_applications WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] || null;
  },

  // ----------------------------
  // CONSULTATIONS
  // ----------------------------
  getConsultations: async () => {
    const db = requireDb();
    const res = await db.query('SELECT * FROM consultations ORDER BY created_at DESC');
    return res.rows;
  },

  getConsultationById: async (id) => {
    if (!isUuid(id)) return null;
    const db = requireDb();
    const res = await db.query('SELECT * FROM consultations WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  createConsultation: async (data) => {
    const db = requireDb();
    const id = uuidv4();
    const now = new Date().toISOString();
    const res = await db.query(
      `INSERT INTO consultations (
        id, parent_name, student_name, email, phone, curriculum,
        subjects, exam_board, current_grade, target_grade,
        consultation_day, consultation_time, consultation_date,
        consultant_name, mode, notes, status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13,
        $14, $15, $16, 'confirmed', $17, $18
      ) RETURNING *`,
      [
        id,
        data.parent_name?.trim() || '',
        data.student_name?.trim() || '',
        data.email?.trim().toLowerCase() || '',
        data.phone?.trim() || '',
        data.curriculum || 'GCSE (Year 10-11)',
        data.subjects?.trim() || '',
        data.exam_board?.trim() || 'AQA',
        data.current_grade?.trim() || '',
        data.target_grade?.trim() || '',
        data.consultation_day || 'Tuesday',
        data.consultation_time || '10:00 AM – 10:45 AM (UK GMT)',
        data.consultation_date || '',
        data.consultant_name || 'Mr. Gideon Babs',
        data.mode || 'Live Interactive Video',
        data.notes?.trim() || '',
        now,
        now
      ]
    );
    return res.rows[0];
  },

  updateConsultationStatus: async (id, status, notes) => {
    if (!isUuid(id)) return null;
    const db = requireDb();
    const res = await db.query(
      'UPDATE consultations SET status = $1, notes = COALESCE($2, notes), updated_at = NOW() WHERE id = $3 RETURNING *',
      [status, notes !== undefined ? notes : null, id]
    );
    return res.rows[0] || null;
  },

  // ----------------------------
  // BLOG POSTS & FLYERS
  // ----------------------------
  getBlogPosts: async ({ category, type, status } = {}) => {
    const db = requireDb();
    let query = 'SELECT * FROM blog_posts WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (category && category !== 'All Topics' && category !== 'all') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    if (type && type !== 'all') {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';
    const res = await db.query(query, params);
    return res.rows;
  },

  getBlogPostById: async (id) => {
    if (!id || typeof id !== 'string') return null;
    const db = requireDb();
    const res = await db.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  getBlogPostBySlug: async (slug) => {
    if (!slug || typeof slug !== 'string') return null;
    const db = requireDb();
    const res = await db.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
    return res.rows[0] || null;
  },

  createBlogPost: async (data) => {
    const db = requireDb();
    const id = `blog-${uuidv4()}`;
    const slugBase = (data.slug || data.title || 'post')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = slugBase ? `${slugBase}-${Date.now().toString(36)}` : `post-${Date.now()}`;
    const tags = Array.isArray(data.tags)
      ? data.tags
      : (typeof data.tags === 'string' && data.tags.trim() ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : []);
    const now = new Date().toISOString();

    const res = await db.query(
      `INSERT INTO blog_posts (
        id, title, slug, category, type, excerpt, content, flyer_image_url,
        author_name, author_role, read_time, tags, status, featured, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        id,
        data.title,
        slug,
        data.category || 'GCSE Mastery',
        data.type || 'article',
        data.excerpt || '',
        data.content || '',
        data.flyer_image_url || '',
        data.author_name || 'Beacon Bridge Academics',
        data.author_role || 'Curriculum Specialist',
        data.read_time || (data.type === 'flyer' ? 'Event Notice' : '5 min read'),
        tags,
        data.status || 'published',
        Boolean(data.featured),
        now,
        now
      ]
    );
    return res.rows[0];
  },

  updateBlogPost: async (id, data) => {
    const db = requireDb();
    const tags = data.tags !== undefined
      ? (Array.isArray(data.tags) ? data.tags : String(data.tags).split(',').map((t) => t.trim()).filter(Boolean))
      : null;

    const res = await db.query(
      `UPDATE blog_posts SET
        title = COALESCE($2, title),
        slug = COALESCE($3, slug),
        category = COALESCE($4, category),
        type = COALESCE($5, type),
        excerpt = COALESCE($6, excerpt),
        content = COALESCE($7, content),
        flyer_image_url = COALESCE($8, flyer_image_url),
        author_name = COALESCE($9, author_name),
        author_role = COALESCE($10, author_role),
        read_time = COALESCE($11, read_time),
        tags = COALESCE($12, tags),
        status = COALESCE($13, status),
        featured = COALESCE($14, featured),
        updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        id,
        data.title ?? null,
        data.slug ?? null,
        data.category ?? null,
        data.type ?? null,
        data.excerpt ?? null,
        data.content ?? null,
        data.flyer_image_url ?? null,
        data.author_name ?? null,
        data.author_role ?? null,
        data.read_time ?? null,
        tags,
        data.status ?? null,
        data.featured !== undefined ? Boolean(data.featured) : null
      ]
    );
    return res.rows[0] || null;
  },

  deleteBlogPost: async (id) => {
    const db = requireDb();
    await db.query('DELETE FROM blog_posts WHERE id = $1', [id]);
    return { success: true, id };
  }
};
