import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

// Pre-computed hash for 'Password123!'
const DEFAULT_HASH = bcrypt.hashSync('Password123!', 10);

// Default in-memory state seeded with real-world sample data
const memoryData = {
  profiles: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@beaconbridgeacademics.co.uk',
      password_hash: DEFAULT_HASH,
      full_name: 'Platform Administrator',
      role: 'superadmin',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      phone: '+44 20 7946 0912',
      bio: 'Platform Super Administrator with complete institutional oversight for UK and International curricula.',
      status: 'active',
      created_at: new Date('2026-01-01T08:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'dr.sarah@beaconbridgeacademics.co.uk',
      password_hash: DEFAULT_HASH,
      full_name: 'Dr. Sarah Jenkins',
      role: 'tutor',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      phone: '+44 7700 900143',
      bio: 'PhD in Pure Mathematics & Physics (Oxford), 12 years UK GCSE and A-Level tutoring experience across AQA, Edexcel, and OCR.',
      status: 'active',
      created_at: new Date('2026-01-05T09:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      email: 'prof.chen@beaconbridgeacademics.co.uk',
      password_hash: DEFAULT_HASH,
      full_name: 'Prof. Michael Chen',
      role: 'tutor',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      phone: '+44 7700 900288',
      bio: 'Head of Science & Advanced STEM, specialized in A-Level Chemistry, Biology & North American AP curricula.',
      status: 'active',
      created_at: new Date('2026-01-07T10:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      email: 'alex.morgan@beaconbridgeacademics.co.uk',
      password_hash: DEFAULT_HASH,
      full_name: 'Alex Morgan',
      role: 'student',
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      phone: '+44 7700 900512',
      bio: 'Year 11 GCSE Student preparing for AQA & Edexcel Core Science and Higher Tier Mathematics.',
      status: 'active',
      created_at: new Date('2026-01-10T11:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      email: 'david.morgan@beaconbridgeacademics.co.uk',
      password_hash: DEFAULT_HASH,
      full_name: 'David Morgan',
      role: 'parent',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      phone: '+44 7700 900513',
      bio: 'Parent of Alex Morgan (Father)',
      status: 'active',
      created_at: new Date('2026-01-10T11:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      email: 'liam.chen@beaconbridgeacademics.co.uk',
      password_hash: DEFAULT_HASH,
      full_name: 'Liam Chen',
      role: 'student',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      phone: '+44 7700 900620',
      bio: 'Software Development Student enrolled in Frontend Development Track (£300/mo).',
      status: 'active',
      created_at: new Date('2026-02-01T10:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000007',
      email: 'grace.chen@beaconbridgeacademics.co.uk',
      password_hash: DEFAULT_HASH,
      full_name: 'Grace Chen',
      role: 'parent',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      phone: '+44 7700 900621',
      bio: 'Parent of Liam Chen (Mother)',
      status: 'active',
      created_at: new Date('2026-02-01T10:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  parent_student_links: [
    {
      id: 'link-0000-0000-0000-000000000001',
      parent_id: '00000000-0000-0000-0000-000000000005',
      student_id: '00000000-0000-0000-0000-000000000004',
      relationship: 'Father',
      status: 'active',
      created_at: new Date('2026-01-10T11:00:00Z').toISOString()
    },
    {
      id: 'link-0000-0000-0000-000000000002',
      parent_id: '00000000-0000-0000-0000-000000000007',
      student_id: '00000000-0000-0000-0000-000000000006',
      relationship: 'Mother',
      status: 'active',
      created_at: new Date('2026-02-01T10:00:00Z').toISOString()
    }
  ],

  course_categories: [
    {
      id: '10000000-0000-0000-0000-000000000001',
      name: 'GCSE Core & Sciences',
      slug: 'gcse-core',
      description: 'Comprehensive preparation across Mathematics, English, Chemistry, Biology, and Physics matching AQA, Edexcel, OCR, and WJEC.',
      icon: 'BookOpen',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      name: 'UK A-Levels',
      slug: 'a-levels-uk',
      description: 'In-depth 3-subject mastery for UK Year 12 & 13 students targeting Grades A*–B and top university admissions.',
      icon: 'GraduationCap',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      name: 'Canada Senior Secondary (Grade 11/12 & AP)',
      slug: 'canada-secondary',
      description: 'Provincial curriculum alignment (Ontario OSSD, British Columbia) and Advanced Placement acceleration in 3 chosen subjects.',
      icon: 'Globe',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      name: 'US High School Advanced & AP',
      slug: 'us-ap',
      description: 'College Board AP exam mastery and GPA enhancement in 3 core STEM & Humanities subjects.',
      icon: 'Award',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '10000000-0000-0000-0000-000000000005',
      name: 'Key Stage 3 Foundations (Years 7–9)',
      slug: 'ks3',
      description: 'Strengthening academic confidence and closing foundational subject gaps before starting GCSEs.',
      icon: 'Compass',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '10000000-0000-0000-0000-000000000006',
      name: 'Technology & Digital Arts',
      slug: 'tech-digital-arts',
      description: 'Industry-standard accredited programs in Software Development (Frontend & Backend) and Professional Graphic Design.',
      icon: 'Code',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],

  courses: [
    {
      id: '20000000-0000-0000-0000-000000000001',
      title: 'GCSE 5-Subject Core Bundle (Maths, English, Chem, Bio, Physics)',
      slug: 'gcse-5-subject-core-bundle',
      description: 'All 5 core subjects: Mathematics, English Language & Literature, Chemistry, Biology, and Physics. Customisable with opt-out subject exceptions.',
      category_id: '10000000-0000-0000-0000-000000000001',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      thumbnail_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
      level: 'GCSE (Years 10–11)',
      price: 299.00,
      pricing_type: 'monthly',
      currency: 'GBP',
      default_subjects: ['Mathematics', 'English Language & Literature', 'Chemistry', 'Biology', 'Physics'],
      allow_exceptions: true,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '20000000-0000-0000-0000-000000000002',
      title: 'UK A-Level 3-Subject Specialist Program',
      slug: 'uk-a-level-3-subject-program',
      description: 'Choose your 3 A-Level subjects from Mathematics, Further Maths, English Literature, Chemistry, Physics, Biology, Economics, History, and Computer Science.',
      category_id: '10000000-0000-0000-0000-000000000002',
      tutor_id: '00000000-0000-0000-0000-000000000003',
      thumbnail_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
      level: 'A-Level (Years 12–13)',
      price: 349.00,
      pricing_type: 'monthly',
      currency: 'GBP',
      subject_selection_required: true,
      max_subjects: 3,
      available_subjects: [
        'Mathematics',
        'Further Mathematics',
        'English Literature',
        'Chemistry',
        'Biology',
        'Physics',
        'Economics',
        'History',
        'Psychology',
        'Computer Science'
      ],
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '20000000-0000-0000-0000-000000000003',
      title: 'Canada Senior Secondary & AP Program (Grade 11/12)',
      slug: 'canada-senior-secondary-program',
      description: 'Choose 3 courses: Advanced Functions (MHF4U), Calculus & Vectors (MCV4U), English (ENG4U), Chemistry (SCH4U), Physics (SPH4U), Biology (SBI4U), World Issues (CGW4U).',
      category_id: '10000000-0000-0000-0000-000000000003',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      thumbnail_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
      level: 'Canada Grade 11–12',
      price: 349.00,
      pricing_type: 'monthly',
      currency: 'GBP',
      subject_selection_required: true,
      max_subjects: 3,
      available_subjects: [
        'Advanced Functions (MHF4U)',
        'Calculus & Vectors (MCV4U)',
        'English Grade 12 (ENG4U)',
        'Chemistry Grade 12 (SCH4U)',
        'Biology Grade 12 (SBI4U)',
        'Physics Grade 12 (SPH4U)',
        'Canadian & World Issues (CGW4U)'
      ],
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '20000000-0000-0000-0000-000000000004',
      title: 'US High School Advanced & AP Mastery Program',
      slug: 'us-high-school-ap-mastery',
      description: 'Choose 3 subjects: AP Calculus AB/BC, AP English Language, AP Chemistry, AP Physics 1/C, AP Biology, AP US History, AP Computer Science A.',
      category_id: '10000000-0000-0000-0000-000000000004',
      tutor_id: '00000000-0000-0000-0000-000000000003',
      thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      level: 'US High School / AP',
      price: 349.00,
      pricing_type: 'monthly',
      currency: 'GBP',
      subject_selection_required: true,
      max_subjects: 3,
      available_subjects: [
        'AP Calculus AB / BC',
        'AP English Language & Composition',
        'AP Chemistry',
        'AP Physics 1 / C',
        'AP Biology',
        'AP United States History',
        'AP Computer Science A',
        'AP Microeconomics'
      ],
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '20000000-0000-0000-0000-000000000005',
      title: 'Key Stage 3 Foundation Bridge (Years 7–9)',
      slug: 'ks3-foundation-bridge',
      description: 'Closing foundational curriculum gaps across KS3 Maths, English, and Combined Science to prepare students for GCSE readiness.',
      category_id: '10000000-0000-0000-0000-000000000005',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      thumbnail_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600',
      level: 'KS3 (Years 7–9)',
      price: 249.00,
      pricing_type: 'monthly',
      currency: 'GBP',
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '20000000-0000-0000-0000-000000000006',
      title: 'SOFTWARE DEVELOPMENT',
      slug: 'software-development',
      description: 'Industry-standard Software Development program. Choose between Frontend Development (£300/mo) or Backend Development (£420/mo).',
      category_id: '10000000-0000-0000-0000-000000000006',
      tutor_id: '00000000-0000-0000-0000-000000000003',
      thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
      level: 'Professional / Tech',
      price: 300.00,
      pricing_type: 'monthly',
      currency: 'GBP',
      has_subtracks: true,
      subtracks: [
        {
          id: 'frontend',
          name: 'Frontend Development',
          price: 300.00,
          description: 'HTML5, CSS3, Modern JavaScript ES6+, React, Tailwind CSS, Responsive Web Design & Web APIs',
          subjects: ['HTML5 & Responsive CSS', 'Modern JavaScript (ES6+)', 'React Architecture & State', 'Tailwind CSS & UI Components', 'REST API Integration']
        },
        {
          id: 'backend',
          name: 'Backend Development',
          price: 420.00,
          description: 'Node.js, Express, RESTful APIs, Relational (PostgreSQL) & NoSQL (MongoDB), Authentication, Security & Cloud Deployment',
          subjects: ['Node.js & Express Framework', 'RESTful API Engineering', 'PostgreSQL & Database Design', 'MongoDB & ORM Modeling', 'JWT Auth & Server Security']
        }
      ],
      default_subjects: ['Frontend Development (£300.00/mo)', 'Backend Development (£420.00/mo)'],
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '20000000-0000-0000-0000-000000000007',
      title: 'GRAPHICS DESIGN',
      slug: 'graphics-design',
      description: 'Comprehensive Visual & Graphic Design: Figma UI/UX prototyping, brand identity, typography, Adobe Photoshop/Illustrator, and portfolio development.',
      category_id: '10000000-0000-0000-0000-000000000006',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      thumbnail_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600',
      level: 'Creative / Digital Arts',
      price: 300.00,
      pricing_type: 'monthly',
      currency: 'GBP',
      has_subtracks: false,
      default_subjects: ['Visual Design Principles & Typography', 'Brand Identity & Logo Design', 'Vector Illustration & Photoshop', 'Figma UI/UX Prototyping', 'Digital Layout & Portfolio'],
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  course_enrollments: [
    {
      id: 'enr-0000-0000-0000-000000000001',
      course_id: '20000000-0000-0000-0000-000000000001',
      student_id: '00000000-0000-0000-0000-000000000004',
      status: 'enrolled',
      progress_pct: 35,
      created_at: new Date('2026-01-10T11:00:00Z').toISOString()
    },
    {
      id: 'enr-0000-0000-0000-000000000002',
      course_id: '20000000-0000-0000-0000-000000000006',
      student_id: '00000000-0000-0000-0000-000000000006',
      course_track: 'Frontend Development',
      status: 'enrolled',
      progress_pct: 20,
      created_at: new Date('2026-02-01T10:00:00Z').toISOString()
    }
  ],

  classes: [
    {
      id: '30000000-0000-0000-0000-000000000001',
      course_id: '20000000-0000-0000-0000-000000000001',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      title: 'GCSE Higher Mathematics: Quadratic Graphs & Algebraic Fractions',
      description: 'Live interactive workshop focusing on quadratic transformations and algebraic fraction simplification with step-by-step whiteboard derivations.',
      scheduled_at: new Date(Date.now() + 3600000).toISOString(),
      duration_minutes: 75,
      status: 'scheduled',
      meeting_room_id: 'ROOM-GCSE-MATH-LIVE',
      presentation_url: '/slides/sample-presentation.pdf',
      presentation_pages: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '30000000-0000-0000-0000-000000000002',
      course_id: '20000000-0000-0000-0000-000000000002',
      tutor_id: '00000000-0000-0000-0000-000000000003',
      title: 'A-Level Pure Mathematics: Calculus & Differential Equations Masterclass',
      description: 'Exam technique and differentiation by parts, substitution, and differential equation modeling with interactive whiteboard proof sets.',
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      duration_minutes: 90,
      status: 'scheduled',
      meeting_room_id: 'ROOM-ALEVEL-MATH-LIVE',
      presentation_url: '/slides/sample-presentation.pdf',
      presentation_pages: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '30000000-0000-0000-0000-000000000003',
      course_id: '20000000-0000-0000-0000-000000000001',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      title: 'GCSE Triple Science: Organic Chemistry & Reaction Kinetics (Recorded)',
      description: 'Complete review of alkanes, alkenes, cracking, and Maxwell-Boltzmann distribution curves with past paper mark scheme analysis.',
      scheduled_at: new Date(Date.now() - 259200000).toISOString(),
      duration_minutes: 60,
      status: 'completed',
      meeting_room_id: 'ROOM-GCSE-CHEM-REC1',
      presentation_url: '/slides/sample-presentation.pdf',
      presentation_pages: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '30000000-0000-0000-0000-000000000004',
      course_id: '20000000-0000-0000-0000-000000000006',
      tutor_id: '00000000-0000-0000-0000-000000000003',
      title: 'Software Development: Full-Stack Architecture, REST APIs & React Workshop',
      description: 'Hands-on live engineering session: building responsive frontend UIs and backend microservices with real-time code reviews.',
      scheduled_at: new Date(Date.now() + 1800000).toISOString(),
      duration_minutes: 90,
      status: 'scheduled',
      meeting_room_id: 'ROOM-SOFTDEV-LIVE',
      presentation_url: '/slides/sample-presentation.pdf',
      presentation_pages: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '30000000-0000-0000-0000-000000000005',
      course_id: '20000000-0000-0000-0000-000000000007',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      title: 'Graphics Design: Visual Identity, Typography & Figma UI/UX Prototyping',
      description: 'Live studio workshop on visual branding aesthetics, vector illustration, color theory, and interactive Figma prototypes.',
      scheduled_at: new Date(Date.now() + 7200000).toISOString(),
      duration_minutes: 75,
      status: 'scheduled',
      meeting_room_id: 'ROOM-GRAPHICS-LIVE',
      presentation_url: '/slides/sample-presentation.pdf',
      presentation_pages: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  class_attendance: [],

  learning_materials: [
    {
      id: '70000000-0000-0000-0000-000000000001',
      course_id: '20000000-0000-0000-0000-000000000001',
      class_id: '30000000-0000-0000-0000-000000000001',
      uploader_id: '00000000-0000-0000-0000-000000000002',
      title: 'GCSE Higher Mathematics - Quadratic Graphs & Algebraic Fractions Revision Guide.pdf',
      file_url: '/slides/sample-presentation.pdf',
      file_type: 'pdf',
      file_size: 3145728,
      is_presentation: true,
      created_at: new Date().toISOString()
    },
    {
      id: '70000000-0000-0000-0000-000000000002',
      course_id: '20000000-0000-0000-0000-000000000001',
      class_id: null,
      uploader_id: '00000000-0000-0000-0000-000000000002',
      title: 'GCSE Combined Science - Essential Formula & Equation Reference Sheet.pdf',
      file_url: '/materials/gcse-science-equations.pdf',
      file_type: 'pdf',
      file_size: 1048576,
      is_presentation: false,
      created_at: new Date().toISOString()
    },
    {
      id: '70000000-0000-0000-0000-000000000003',
      course_id: '20000000-0000-0000-0000-000000000002',
      class_id: '30000000-0000-0000-0000-000000000002',
      uploader_id: '00000000-0000-0000-0000-000000000003',
      title: 'A-Level Pure Mathematics - Calculus & Differential Equations Study Pack.pdf',
      file_url: '/slides/sample-presentation.pdf',
      file_type: 'pdf',
      file_size: 2097152,
      is_presentation: true,
      created_at: new Date().toISOString()
    }
  ],

  class_recordings: [
    {
      id: '80000000-0000-0000-0000-000000000001',
      class_id: '30000000-0000-0000-0000-000000000003',
      title: 'GCSE Triple Science: Organic Chemistry & Reaction Kinetics - Full Lecture Recording',
      recording_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration_seconds: 3600,
      file_size: 245000000,
      is_published: true,
      created_at: new Date(Date.now() - 250000000).toISOString()
    }
  ],

  notifications: [],

  announcements: [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      sender_id: '00000000-0000-0000-0000-000000000001',
      sender_name: 'Platform Administrator',
      title: 'Welcome to the New Academic Term at Beacon Bridge Academics',
      content: 'We are pleased to introduce our upgraded interactive virtual classroom with live slide annotations, mathematical whiteboard tools, and integrated parent progress tracking.',
      target_role: 'all',
      created_at: new Date().toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      sender_id: '00000000-0000-0000-0000-000000000002',
      sender_name: 'Dr. Sarah Jenkins',
      title: 'GCSE Higher Tier: Formula & Past Paper Materials Updated',
      content: 'Please download the past paper revision packs before attending todays live session.',
      target_role: 'student',
      created_at: new Date().toISOString()
    }
  ],

  audit_logs: [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000001',
      user_email: 'admin@beaconbridgeacademics.co.uk',
      action: 'SYSTEM_BOOT',
      entity_type: 'SYSTEM',
      entity_id: 'INIT',
      ip_address: '127.0.0.1',
      details: { message: 'Beacon Bridge Academics LMS Initialized with UK & International Curricula (GCSE, A-Levels, AP, Canada Grade 11/12)' },
      created_at: new Date().toISOString()
    }
  ],

  assignments: [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      course_id: '20000000-0000-0000-0000-000000000001',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      title: 'GCSE Mathematics: Past Paper Exam Practice (Algebra & Functions)',
      description: 'Complete questions 1 to 15 from the 2025 Edexcel Higher Tier practice paper. Show all mathematical working clearly.',
      due_date: new Date(Date.now() + 172800000).toISOString(),
      max_score: 100,
      file_url: '/materials/gcse-math-pastpaper.pdf',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      course_id: '20000000-0000-0000-0000-000000000002',
      tutor_id: '00000000-0000-0000-0000-000000000003',
      title: 'A-Level Pure Mathematics: Calculus & Proof Problem Set',
      description: 'Complete problem sets 1 through 8 in Chapter 4 on differentiation by parts and differential equation modeling.',
      due_date: new Date(Date.now() + 345600000).toISOString(),
      max_score: 100,
      file_url: '/materials/alevel-calculus-set.pdf',
      created_at: new Date(Date.now() - 43200000).toISOString()
    }
  ],

  assignment_submissions: [],

  payments: [
    {
      id: 'pay-0000-0000-0000-000000000001',
      parent_id: '00000000-0000-0000-0000-000000000007',
      student_id: '00000000-0000-0000-0000-000000000006',
      course_id: '20000000-0000-0000-0000-000000000006',
      course_track: 'Frontend Development',
      course_name: 'SOFTWARE DEVELOPMENT (Frontend Development)',
      amount: 300.00,
      currency: 'GBP',
      selected_subjects: ['HTML5 & Responsive CSS', 'Modern JavaScript (ES6+)', 'React Architecture', 'Tailwind CSS', 'REST APIs'],
      bank_reference: 'WIRE-DEV-984210',
      proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
      status: 'pending',
      admin_notes: 'Software Development (Frontend Track) £300.00/mo. Awaiting bursar verification.',
      verified_by: null,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      verified_at: null
    },
    {
      id: 'pay-0000-0000-0000-000000000002',
      parent_id: '00000000-0000-0000-0000-000000000005',
      student_id: '00000000-0000-0000-0000-000000000004',
      course_id: '20000000-0000-0000-0000-000000000001',
      course_track: null,
      course_name: 'GCSE 5-Subject Core Bundle',
      amount: 299.00,
      currency: 'GBP',
      selected_subjects: ['Mathematics', 'English Language & Literature', 'Chemistry', 'Biology', 'Physics'],
      bank_reference: 'WIRE-GCSE-104928',
      proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
      status: 'verified',
      admin_notes: 'Payment confirmed by Administrator. Student and Parent dashboards unlocked.',
      verified_by: '00000000-0000-0000-0000-000000000001',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      verified_at: new Date(Date.now() - 86400000 * 4).toISOString()
    }
  ],

  tutor_applications: [
    {
      id: 'app-0000-0000-0000-000000000001',
      full_name: 'Dr. Jonathan Hayes',
      email: 'jonathan.hayes.ox@gmail.com',
      phone: '+44 7911 234567',
      location: 'Oxford, United Kingdom',
      highest_qualification: 'DPhil in Pure Mathematics (Oxford); BSc First Class (Hons) Imperial College London',
      years_experience: '8 years',
      current_role: 'Senior A-Level Mathematics Lead & Examiner',
      selected_subjects: ['A-Level Mathematics', 'A-Level Physics'],
      bio: 'Former Oxford researcher with 8+ years tutoring UK sixth-formers to A* grades in Pure Math, Mechanics, and Advanced Physics.',
      teaching_approach: 'I deconstruct complex calculus theorems using dynamic step-by-step whiteboard derivations and focus heavily on Edexcel/AQA mark-scheme analysis. I ensure students build genuine mathematical intuition before drill practice.',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      video_duration: '2m 45s',
      video_filename: 'intro-dr-jonathan-hayes.mp4',
      cv_url: '/materials/sample_academic_cv.pdf',
      safeguarding_acknowledged: true,
      safeguarding_version: 'v2.4-2026-UK-DFE-COMPLIANT',
      safeguarding_signature: 'Dr. Jonathan Richard Hayes',
      safeguarding_signed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      dbs_status: 'Enhanced DBS on Update Service',
      dbs_certificate_number: '001594837201',
      status: 'pending',
      admin_notes: 'Strong academic pedigree. Video demonstrates exceptional visual problem breakdown and patient tone. High-priority candidate for A-Level Math.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'app-0000-0000-0000-000000000002',
      full_name: 'Ms. Eleanor Vance',
      email: 'e.vance.literature@outlook.com',
      phone: '+44 7822 987654',
      location: 'Cambridge, United Kingdom',
      highest_qualification: 'MA in English Literature (Cambridge); PGCE Secondary English',
      years_experience: '6 years',
      current_role: 'Head of Sixth Form English, Hills Road Sixth Form College',
      selected_subjects: ['A-Level English', 'A-Level English Literature', 'A-Level Philosophy'],
      bio: 'Cambridge-educated English specialist with a track record of elevating Grade 6/7 students to Grade 9 / A* through structured essay scaffolding and critical textual interrogation.',
      teaching_approach: 'My pedagogy centers on Socratic seminar discussion, close textual analysis, thesis-driven essay structuring, and unpicking examiner assessment objectives (AO1–AO4).',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      video_duration: '3m 02s',
      video_filename: 'eleanor-vance-teaching-intro.mp4',
      cv_url: '/materials/sample_academic_cv.pdf',
      safeguarding_acknowledged: true,
      safeguarding_version: 'v2.4-2026-UK-DFE-COMPLIANT',
      safeguarding_signature: 'Eleanor Margaret Vance',
      safeguarding_signed_at: new Date(Date.now() - 86400000).toISOString(),
      dbs_status: 'Enhanced DBS on Update Service',
      dbs_certificate_number: '001483920194',
      status: 'under_review',
      admin_notes: 'Articulate introductory video. Excellent essay scaffolding framework. Under final review by Superadmin.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 43200000).toISOString()
    },
    {
      id: 'app-0000-0000-0000-000000000003',
      full_name: 'Dr. Tariq Al-Mansoor',
      email: 'tariq.chem.ed@gmail.com',
      phone: '+44 7733 445566',
      location: 'Manchester, United Kingdom',
      highest_qualification: 'PhD in Organic Chemistry (Manchester); MChem (Hons)',
      years_experience: '10 years',
      current_role: 'A-Level Chemistry & Biology Tutor & Curriculum Author',
      selected_subjects: ['A-Level Chemistry', 'A-Level Biology', 'A-Level Environmental Science'],
      bio: 'Specialised in Organic reaction mechanisms, thermodynamics, biochemistry, and bridging the gap between GCSE Science and A-Level rigor.',
      teaching_approach: 'I make organic chemistry mechanisms dynamic through 3D molecular modeling, real-world biochemical analogies, and rigorous past-paper mark scheme dissection.',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      video_duration: '2m 55s',
      video_filename: 'tariq-al-mansoor-intro.mp4',
      cv_url: '/materials/sample_academic_cv.pdf',
      safeguarding_acknowledged: true,
      safeguarding_version: 'v2.4-2026-UK-DFE-COMPLIANT',
      safeguarding_signature: 'Tariq Omar Al-Mansoor',
      safeguarding_signed_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      dbs_status: 'Enhanced DBS on Update Service',
      dbs_certificate_number: '001629401823',
      status: 'approved',
      admin_notes: 'Approved by Superadmin. Video quality exceptional; verified Enhanced DBS and references.',
      reviewed_by: 'Platform Administrator',
      reviewed_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ],

  platform_settings: {
    platform_name: 'Beacon Bridge Academics',
    contact_email: 'info@beaconbridgeacademics.co.uk',
    currency: 'GBP',
    currency_symbol: '£',
    allow_public_registration: 'true',
    enable_recordings: 'true',
    enable_whiteboard: 'true',
    maintenance_mode: 'false',
    bank_name: 'Barclays Bank UK PLC',
    bank_account_name: 'Beacon Bridge Academics Ltd.',
    bank_account_number: '83920147',
    bank_swift_bic: 'BARCGB22',
    bank_routing_sort: '20-45-77',
    bank_iban: 'GB29BARC20457783920147',
    bank_instructions: 'Please transfer the monthly tuition fee in British Pounds (£ GBP) using the Student Full Name and Reference Code in the payment description. After completing payment, upload your transfer confirmation receipt or slip.',
    default_tuition_fee: '£300.00 GBP / month'
  }
};

// Unified Data Repository Interface
export const store = {
  // Profiles / Users
  getProfiles: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data) return data;
    }
    return memoryData.profiles;
  },

  getProfileById: async (id) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    return memoryData.profiles.find(p => p.id === id) || null;
  },

  getProfileByEmail: async (email) => {
    if (!email) return null;
    const normalized = email.toLowerCase().trim();
    const prefix = normalized.split('@')[0];

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*').ilike('email', normalized).single();
      if (!error && data) return data;
    }
    // 1. Direct exact match
    const found = memoryData.profiles.find(p => p.email.toLowerCase() === normalized);
    if (found) return found;

    // 2. Flexible match on username prefix for demo accounts (e.g. admin, dr.sarah, alex.morgan, david.morgan)
    const prefixMatch = memoryData.profiles.find(p => p.email.toLowerCase().split('@')[0] === prefix);
    if (prefixMatch) return prefixMatch;

    return null;
  },

  createProfile: async (profileData) => {
    const newProfile = {
      id: profileData.id || uuidv4(),
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').insert([newProfile]).select().single();
      if (!error && data) return data;
    }
    memoryData.profiles.push(newProfile);
    return newProfile;
  },

  updateProfile: async (id, updates) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
      if (!error && data) return data;
    }
    const idx = memoryData.profiles.findIndex(p => p.id === id);
    if (idx !== -1) {
      memoryData.profiles[idx] = { ...memoryData.profiles[idx], ...updates, updated_at: new Date().toISOString() };
      return memoryData.profiles[idx];
    }
    return null;
  },

  deleteProfile: async (id) => {
    if (isSupabaseConfigured) {
      await supabase.from('profiles').delete().eq('id', id);
    }
    memoryData.profiles = memoryData.profiles.filter(p => p.id !== id);
    return true;
  },

  // Courses
  getCourses: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('courses').select('*, tutor:profiles(full_name, email, avatar_url), category:course_categories(name)');
      if (!error && data) return data;
    }
    return memoryData.courses.map(course => ({
      ...course,
      tutor: memoryData.profiles.find(p => p.id === course.tutor_id) || null,
      category: memoryData.course_categories.find(c => c.id === course.category_id) || null
    }));
  },

  getCourseById: async (id) => {
    const courses = await store.getCourses();
    return courses.find(c => c.id === id || c.slug === id) || null;
  },

  createCourse: async (courseData) => {
    const newCourse = {
      id: uuidv4(),
      ...courseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('courses').insert([newCourse]).select().single();
      if (!error && data) return data;
    }
    memoryData.courses.push(newCourse);
    return newCourse;
  },

  updateCourse: async (id, updates) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('courses').update(updates).eq('id', id).select().single();
      if (!error && data) return data;
    }
    const idx = memoryData.courses.findIndex(c => c.id === id);
    if (idx !== -1) {
      memoryData.courses[idx] = { ...memoryData.courses[idx], ...updates, updated_at: new Date().toISOString() };
      return memoryData.courses[idx];
    }
    return null;
  },

  deleteCourse: async (id) => {
    if (isSupabaseConfigured) {
      await supabase.from('courses').delete().eq('id', id);
    }
    memoryData.courses = memoryData.courses.filter(c => c.id !== id);
    return true;
  },

  // Categories
  getCategories: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('course_categories').select('*');
      if (!error && data) return data;
    }
    return memoryData.course_categories;
  },

  // Enrollments
  getEnrollments: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('course_enrollments').select('*, course:courses(*), student:profiles(*)');
      if (!error && data) return data;
    }
    return memoryData.course_enrollments.map(enr => ({
      ...enr,
      course: memoryData.courses.find(c => c.id === enr.course_id) || null,
      student: memoryData.profiles.find(p => p.id === enr.student_id) || null
    }));
  },

  createEnrollment: async (enrollmentData) => {
    const newEnr = {
      id: uuidv4(),
      ...enrollmentData,
      progress_pct: enrollmentData.progress_pct || 0,
      status: enrollmentData.status || 'enrolled',
      enrolled_at: new Date().toISOString()
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('course_enrollments').insert([newEnr]).select().single();
      if (!error && data) return data;
    }
    memoryData.course_enrollments.push(newEnr);
    return newEnr;
  },

  // Classes
  getClasses: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('classes').select('*, course:courses(*), tutor:profiles(*)');
      if (!error && data) return data;
    }
    return memoryData.classes.map(cls => ({
      ...cls,
      course: memoryData.courses.find(c => c.id === cls.course_id) || null,
      tutor: memoryData.profiles.find(p => p.id === cls.tutor_id) || null
    }));
  },

  getClassById: async (idOrRoom) => {
    const classes = await store.getClasses();
    return classes.find(c => c.id === idOrRoom || c.meeting_room_id === idOrRoom) || null;
  },

  createClass: async (classData) => {
    const newClass = {
      id: uuidv4(),
      meeting_room_id: classData.meeting_room_id || `ROOM-${Date.now().toString(36).toUpperCase()}`,
      status: 'scheduled',
      presentation_pages: 5,
      ...classData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('classes').insert([newClass]).select().single();
      if (!error && data) return data;
    }
    memoryData.classes.push(newClass);
    return newClass;
  },

  updateClass: async (id, updates) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('classes').update(updates).eq('id', id).select().single();
      if (!error && data) return data;
    }
    const idx = memoryData.classes.findIndex(c => c.id === id || c.meeting_room_id === id);
    if (idx !== -1) {
      memoryData.classes[idx] = { ...memoryData.classes[idx], ...updates, updated_at: new Date().toISOString() };
      return memoryData.classes[idx];
    }
    return null;
  },

  // Attendance
  getAttendance: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('class_attendance').select('*, class:classes(*), user:profiles(*)');
      if (!error && data) return data;
    }
    return memoryData.class_attendance.map(att => ({
      ...att,
      class: memoryData.classes.find(c => c.id === att.class_id) || null,
      user: memoryData.profiles.find(p => p.id === att.user_id) || null
    }));
  },

  logAttendance: async (attendanceData) => {
    const newAtt = {
      id: uuidv4(),
      joined_at: new Date().toISOString(),
      duration_minutes: 0,
      status: 'present',
      ...attendanceData
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('class_attendance').insert([newAtt]).select().single();
      if (!error && data) return data;
    }
    memoryData.class_attendance.push(newAtt);
    return newAtt;
  },

  updateAttendance: async (id, updates) => {
    const idx = memoryData.class_attendance.findIndex(a => a.id === id);
    if (idx !== -1) {
      memoryData.class_attendance[idx] = { ...memoryData.class_attendance[idx], ...updates };
      return memoryData.class_attendance[idx];
    }
    return null;
  },

  // Learning Materials
  getMaterials: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('learning_materials').select('*, course:courses(*), uploader:profiles(*)');
      if (!error && data) return data;
    }
    return memoryData.learning_materials.map(mat => ({
      ...mat,
      course: memoryData.courses.find(c => c.id === mat.course_id) || null,
      uploader: memoryData.profiles.find(p => p.id === mat.uploader_id) || null
    }));
  },

  createMaterial: async (materialData) => {
    const newMaterial = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      ...materialData
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('learning_materials').insert([newMaterial]).select().single();
      if (!error && data) return data;
    }
    memoryData.learning_materials.push(newMaterial);
    return newMaterial;
  },

  deleteMaterial: async (id) => {
    if (isSupabaseConfigured) {
      await supabase.from('learning_materials').delete().eq('id', id);
    }
    memoryData.learning_materials = memoryData.learning_materials.filter(m => m.id !== id);
    return true;
  },

  // Recordings
  getRecordings: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('class_recordings').select('*, class:classes(*)');
      if (!error && data) return data;
    }
    return memoryData.class_recordings.map(rec => ({
      ...rec,
      class: memoryData.classes.find(c => c.id === rec.class_id) || null
    }));
  },

  createRecording: async (recordingData) => {
    const newRec = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      is_published: true,
      ...recordingData
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('class_recordings').insert([newRec]).select().single();
      if (!error && data) return data;
    }
    memoryData.class_recordings.push(newRec);
    return newRec;
  },

  // Parent-Student Links
  getParentStudentLinks: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('parent_student_links').select('*, parent:profiles!parent_id(*), student:profiles!student_id(*)');
      if (!error && data) return data;
    }
    return memoryData.parent_student_links.map(link => ({
      ...link,
      parent: memoryData.profiles.find(p => p.id === link.parent_id) || null,
      student: memoryData.profiles.find(p => p.id === link.student_id) || null
    }));
  },

  createParentStudentLink: async (linkData) => {
    const newLink = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      status: 'active',
      relationship: linkData.relationship || 'Parent',
      ...linkData
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('parent_student_links').insert([newLink]).select().single();
      if (!error && data) return data;
    }
    memoryData.parent_student_links.push(newLink);
    return newLink;
  },

  // Notifications
  getNotifications: async (userId) => {
    if (isSupabaseConfigured && userId) {
      const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return memoryData.notifications
      .filter(n => !userId || n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  createNotification: async (notifData) => {
    const newNotif = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      is_read: false,
      ...notifData
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('notifications').insert([newNotif]).select().single();
      if (!error && data) return data;
    }
    memoryData.notifications.push(newNotif);
    return newNotif;
  },

  markNotificationAsRead: async (id) => {
    if (isSupabaseConfigured) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    }
    const notif = memoryData.notifications.find(n => n.id === id);
    if (notif) notif.is_read = true;
    return true;
  },

  deleteNotification: async (id, userId) => {
    if (isSupabaseConfigured) {
      let query = supabase.from('notifications').delete().eq('id', id);
      if (userId) query = query.eq('user_id', userId);
      await query;
    }
    const initialLen = memoryData.notifications.length;
    memoryData.notifications = memoryData.notifications.filter(
      n => !(n.id === id && (!userId || n.user_id === userId))
    );
    return memoryData.notifications.length < initialLen;
  },

  clearAllNotifications: async (userId) => {
    if (isSupabaseConfigured && userId) {
      await supabase.from('notifications').delete().eq('user_id', userId);
    }
    memoryData.notifications = memoryData.notifications.filter(
      n => n.user_id !== userId
    );
    return true;
  },

  // Announcements
  getAnnouncements: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('announcements').select('*, sender:profiles(*)').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return memoryData.announcements
      .map(ann => ({
        ...ann,
        sender: memoryData.profiles.find(p => p.id === ann.sender_id) || null
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  createAnnouncement: async (annData) => {
    const sender = memoryData.profiles.find(p => p.id === annData.sender_id);
    const newAnn = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      sender_name: sender ? sender.full_name : 'Administration',
      target_role: annData.target_role || 'all',
      ...annData
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('announcements').insert([newAnn]).select().single();
      if (!error && data) return data;
    }
    memoryData.announcements.unshift(newAnn);
    return newAnn;
  },

  // Audit Logs
  getAuditLogs: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('audit_logs').select('*, user:profiles(*)').order('created_at', { ascending: false }).limit(100);
      if (!error && data) return data;
    }
    return [...memoryData.audit_logs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  logAudit: async (auditData) => {
    const user = memoryData.profiles.find(p => p.id === auditData.user_id);
    const newLog = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      user_email: user ? user.email : 'System',
      ...auditData
    };
    if (isSupabaseConfigured) {
      await supabase.from('audit_logs').insert([newLog]);
    }
    memoryData.audit_logs.unshift(newLog);
    return newLog;
  },

  // Platform Settings
  getSettings: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('platform_settings').select('*');
      if (!error && data) {
        return data.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
      }
    }
    return memoryData.platform_settings;
  },

  updateSettings: async (newSettings) => {
    if (isSupabaseConfigured) {
      for (const [key, value] of Object.entries(newSettings)) {
        await supabase.from('platform_settings').upsert({ key, value: String(value), updated_at: new Date().toISOString() });
      }
    }
    memoryData.platform_settings = { ...memoryData.platform_settings, ...newSettings };
    return memoryData.platform_settings;
  },

  // Joint Registration (Parent + Student together)
  registerJoint: async ({ student, parent, course_id, course_track, selected_subjects, payment_proof_url, bank_reference, amount }) => {
    // 1. Verify email uniqueness
    const existingStudent = await store.getProfileByEmail(student.email);
    if (existingStudent) throw new Error(`Student email '${student.email}' is already registered.`);

    const existingParent = await store.getProfileByEmail(parent.email);
    if (existingParent) throw new Error(`Parent email '${parent.email}' is already registered.`);

    // 2. Hash passwords
    const studentSalt = await bcrypt.genSalt(10);
    const student_password_hash = await bcrypt.hash(student.password || 'Password123!', studentSalt);

    const parentSalt = await bcrypt.genSalt(10);
    const parent_password_hash = await bcrypt.hash(parent.password || 'Password123!', parentSalt);

    // 3. Create both profiles with pending_verification status
    const subjectsList = Array.isArray(selected_subjects) && selected_subjects.length > 0 
      ? selected_subjects.join(', ') 
      : (student.grade || 'Curriculum Program');

    const chosenCourse = memoryData.courses.find(c => c.id === course_id);
    let courseNameWithTrack = chosenCourse ? chosenCourse.title : 'Academic Program';
    if (course_track) {
      courseNameWithTrack = `${courseNameWithTrack} (${course_track})`;
    }

    const studentProfile = await store.createProfile({
      email: student.email,
      password_hash: student_password_hash,
      full_name: student.full_name,
      role: 'student',
      phone: student.phone || '',
      bio: `Program: ${courseNameWithTrack} | Grade/Level: ${student.grade || 'Student'} | Subjects: ${subjectsList}`,
      status: 'pending_verification', // Must be verified by admin payment check before login works!
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.full_name)}`
    });

    const parentProfile = await store.createProfile({
      email: parent.email,
      password_hash: parent_password_hash,
      full_name: parent.full_name,
      role: 'parent',
      phone: parent.phone || '',
      bio: `Parent/Guardian of ${student.full_name} (${parent.relationship || 'Parent'})`,
      status: 'pending_verification', // Must be verified by admin payment check before login works!
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(parent.full_name)}`
    });

    // 4. Link parent and student
    const link = await store.createParentStudentLink({
      parent_id: parentProfile.id,
      student_id: studentProfile.id,
      relationship: parent.relationship || 'Parent'
    });

    // 5. Create payment record in British Pounds (£ GBP)
    const paymentRecord = {
      id: uuidv4(),
      parent_id: parentProfile.id,
      student_id: studentProfile.id,
      course_id: course_id || (memoryData.courses[0] ? memoryData.courses[0].id : null),
      course_track: course_track || null,
      course_name: courseNameWithTrack,
      amount: parseFloat(amount) || 300.00,
      currency: 'GBP',
      selected_subjects: selected_subjects || [],
      bank_reference: bank_reference || `BBA-${Date.now().toString(36).toUpperCase()}`,
      proof_url: payment_proof_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
      status: 'pending',
      admin_notes: `Program: ${courseNameWithTrack}. Subjects: ${subjectsList}. Monthly tuition awaiting bursar payment confirmation.`,
      verified_by: null,
      created_at: new Date().toISOString(),
      verified_at: null
    };
    memoryData.payments.unshift(paymentRecord);

    // 6. Pre-enroll student in pending status
    if (course_id) {
      await store.createEnrollment({
        course_id,
        course_track: course_track || null,
        student_id: studentProfile.id,
        status: 'enrolled',
        progress_pct: 0
      });
    }

    // 7. Audit log & Admin Notification
    const admins = memoryData.profiles.filter(p => p.role === 'superadmin');
    for (const admin of admins) {
      await store.createNotification({
        user_id: admin.id,
        title: 'New Student & Parent Registration',
        message: `New registration: ${student.full_name} (Student) & ${parent.full_name} (${parent.relationship}) for ${courseNameWithTrack}. Monthly tuition £${paymentRecord.amount} GBP. Verification required.`,
        type: 'payment',
        link: '/admin/payments'
      });
    }

    console.log(`\n======================================================`);
    console.log(`📧 [EMAIL TO STUDENT]: ${student.email}`);
    console.log(`Subject: Welcome to Beacon Bridge Academics - Account Created (Pending Payment Verification)`);
    console.log(`Hello ${student.full_name}, your student account has been created for ${courseNameWithTrack}. Your parent/guardian submitted the registration and monthly payment proof. Once verified by our administration team, your login will be active!`);
    console.log(`------------------------------------------------------`);
    console.log(`📧 [EMAIL TO PARENT]: ${parent.email}`);
    console.log(`Subject: Beacon Bridge Academics Enrolment & Monthly Payment Confirmation Received`);
    console.log(`Hello ${parent.full_name}, thank you for registering with Beacon Bridge Academics for ${student.full_name} (${courseNameWithTrack}). We have received your payment reference (${paymentRecord.bank_reference}) for £${paymentRecord.amount} GBP. Our bursar team will verify the payment shortly and activate your dashboards.`);
    console.log(`======================================================\n`);

    return {
      student: studentProfile,
      parent: parentProfile,
      payment: paymentRecord,
      link
    };
  },

  // Payments & Verification
  getPayments: async () => {
    return memoryData.payments.map(p => {
      const course = memoryData.courses.find(c => c.id === p.course_id) || null;
      const courseTitle = p.course_name || (p.course_track ? `${course?.title || 'Program'} (${p.course_track})` : (course?.title || 'Selected Program'));
      return {
        ...p,
        course_display_name: courseTitle,
        parent: memoryData.profiles.find(u => u.id === p.parent_id) || null,
        student: memoryData.profiles.find(u => u.id === p.student_id) || null,
        course,
        verifier: p.verified_by ? memoryData.profiles.find(u => u.id === p.verified_by) : null
      };
    });
  },

  submitPaymentProof: async ({ parent_id, student_id, course_id, course_track, amount, bank_reference, proof_url, notes }) => {
    const chosenCourse = memoryData.courses.find(c => c.id === course_id);
    let courseNameWithTrack = chosenCourse ? chosenCourse.title : 'Academic Program';
    if (course_track) {
      courseNameWithTrack = `${courseNameWithTrack} (${course_track})`;
    }
    const newPayment = {
      id: uuidv4(),
      parent_id,
      student_id,
      course_id: course_id || null,
      course_track: course_track || null,
      course_name: courseNameWithTrack,
      amount: parseFloat(amount) || 300.00,
      currency: 'GBP',
      bank_reference: bank_reference || `WIRE-${Date.now().toString(36).toUpperCase()}`,
      proof_url: proof_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
      status: 'pending',
      admin_notes: notes || `Monthly proof of payment for ${courseNameWithTrack}`,
      verified_by: null,
      created_at: new Date().toISOString(),
      verified_at: null
    };
    memoryData.payments.unshift(newPayment);

    // Notify admins
    const admins = memoryData.profiles.filter(p => p.role === 'superadmin');
    for (const admin of admins) {
      await store.createNotification({
        user_id: admin.id,
        title: 'New Proof of Payment Uploaded',
        message: `A parent uploaded monthly payment receipt for ${courseNameWithTrack} (Ref: ${newPayment.bank_reference}). Please verify.`,
        type: 'payment',
        link: '/admin/payments'
      });
    }

    return newPayment;
  },

  verifyPayment: async (paymentId, adminId) => {
    const idx = memoryData.payments.findIndex(p => p.id === paymentId);
    if (idx === -1) throw new Error('Payment record not found.');

    const payment = memoryData.payments[idx];
    payment.status = 'verified';
    payment.verified_by = adminId;
    payment.verified_at = new Date().toISOString();
    payment.admin_notes = 'Payment verified and confirmed by Administrator.';

    // ACTIVATE BOTH STUDENT AND PARENT ACCOUNTS!
    await store.updateProfile(payment.student_id, { status: 'active' });
    await store.updateProfile(payment.parent_id, { status: 'active' });

    const student = memoryData.profiles.find(p => p.id === payment.student_id);
    const parent = memoryData.profiles.find(p => p.id === payment.parent_id);

    // If student has course enrollment, ensure it's marked enrolled
    if (payment.course_id) {
      const existingEnr = memoryData.course_enrollments.find(e => e.course_id === payment.course_id && e.student_id === payment.student_id);
      if (!existingEnr) {
        await store.createEnrollment({
          course_id: payment.course_id,
          student_id: payment.student_id,
          status: 'enrolled',
          progress_pct: 0
        });
      }
    }

    // In-app notifications
    await store.createNotification({
      user_id: payment.student_id,
      title: 'Payment Confirmed & Account Activated!',
      message: 'Your tuition payment has been officially verified by the administrator. You may now access all classes and materials!',
      type: 'payment',
      link: '/student/dashboard'
    });

    await store.createNotification({
      user_id: payment.parent_id,
      title: 'Tuition Payment Confirmed & Child Account Activated',
      message: `Your payment for ${student?.full_name || 'your child'} was verified. Both parent and student portals are now unlocked!`,
      type: 'payment',
      link: '/parent/dashboard'
    });

    console.log(`\n======================================================`);
    console.log(`📧 [EMAIL CONFIRMATION TO STUDENT]: ${student?.email}`);
    console.log(`Subject: Payment Confirmed - Your Beacon Bridge Academics Account is Activated!`);
    console.log(`Dear ${student?.full_name}, your administrator has confirmed your enrollment payment. You can now log in at https://beaconbridgeacademics.co.uk/login to access your courses and live virtual classrooms.`);
    console.log(`------------------------------------------------------`);
    console.log(`📧 [EMAIL CONFIRMATION TO PARENT]: ${parent?.email}`);
    console.log(`Subject: Payment Verified - Beacon Bridge Academics Parent Portal Unlocked`);
    console.log(`Dear ${parent?.full_name}, your tuition payment for ${student?.full_name} has been verified. You can now log in to monitor your child's academic progress, attendance, and assignments.`);
    console.log(`======================================================\n`);

    return payment;
  },

  rejectPayment: async (paymentId, adminNotes) => {
    const idx = memoryData.payments.findIndex(p => p.id === paymentId);
    if (idx === -1) throw new Error('Payment record not found.');

    const payment = memoryData.payments[idx];
    payment.status = 'rejected';
    payment.admin_notes = adminNotes || 'Proof of payment was unclear or could not be verified by bank.';

    // Notify parent
    await store.createNotification({
      user_id: payment.parent_id,
      title: 'Payment Verification Required',
      message: `Payment reference ${payment.bank_reference} could not be confirmed: ${payment.admin_notes}. Please upload a clear receipt.`,
      type: 'payment',
      link: '/payment-proof'
    });

    return payment;
  },

  // Assignments System & Notifications
  getAssignments: async (courseId) => {
    let assignments = memoryData.assignments;
    if (courseId) {
      assignments = assignments.filter(a => a.course_id === courseId);
    }
    return assignments.map(a => ({
      ...a,
      course: memoryData.courses.find(c => c.id === a.course_id) || null,
      tutor: memoryData.profiles.find(p => p.id === a.tutor_id) || null,
      submissionCount: memoryData.assignment_submissions.filter(s => s.assignment_id === a.id).length
    }));
  },

  getAssignmentById: async (id) => {
    const a = memoryData.assignments.find(item => item.id === id);
    if (!a) return null;
    return {
      ...a,
      course: memoryData.courses.find(c => c.id === a.course_id) || null,
      tutor: memoryData.profiles.find(p => p.id === a.tutor_id) || null,
      submissions: memoryData.assignment_submissions.filter(s => s.assignment_id === a.id).map(s => ({
        ...s,
        student: memoryData.profiles.find(p => p.id === s.student_id) || null
      }))
    };
  },

  createAssignment: async (assignmentData) => {
    const newAssignment = {
      id: uuidv4(),
      course_id: assignmentData.course_id,
      tutor_id: assignmentData.tutor_id,
      title: assignmentData.title,
      description: assignmentData.description || '',
      due_date: assignmentData.due_date,
      max_score: parseInt(assignmentData.max_score, 10) || 100,
      file_url: assignmentData.file_url || '',
      created_at: new Date().toISOString()
    };
    memoryData.assignments.unshift(newAssignment);

    // Find all students enrolled in this course
    const enrollments = memoryData.course_enrollments.filter(e => e.course_id === newAssignment.course_id);
    const course = memoryData.courses.find(c => c.id === newAssignment.course_id);

    for (const enr of enrollments) {
      const student = memoryData.profiles.find(p => p.id === enr.student_id);
      if (!student) continue;

      // 1. Notify Student (In-app + Email)
      await store.createNotification({
        user_id: student.id,
        title: `New Assignment: ${newAssignment.title}`,
        message: `Course: ${course?.title || 'Your Course'}. Due Date: ${new Date(newAssignment.due_date).toLocaleString()}. Max Score: ${newAssignment.max_score} pts.`,
        type: 'assignment',
        link: '/student/assignments'
      });

      console.log(`📧 [EMAIL TO STUDENT]: ${student.email}`);
      console.log(`Subject: New Course Assignment: ${newAssignment.title}`);
      console.log(`Dear ${student.full_name}, your tutor has assigned "${newAssignment.title}" for ${course?.title}. Deadline: ${new Date(newAssignment.due_date).toLocaleString()}. Please review the prompt and submit on time.`);

      // 2. Find Linked Parents and Notify Them (In-app + Email)
      const parentLinks = memoryData.parent_student_links.filter(l => l.student_id === student.id && l.status === 'active');
      for (const link of parentLinks) {
        const parent = memoryData.profiles.find(p => p.id === link.parent_id);
        if (!parent) continue;

        await store.createNotification({
          user_id: parent.id,
          title: `Assignment Notice for ${student.full_name}`,
          message: `New coursework "${newAssignment.title}" was assigned. Deadline is ${new Date(newAssignment.due_date).toLocaleDateString()}.`,
          type: 'assignment',
          link: '/parent/assignments'
        });

        console.log(`📧 [EMAIL TO PARENT]: ${parent.email}`);
        console.log(`Subject: Academic Alert - New Assignment Given to ${student.full_name}`);
        console.log(`Dear ${parent.full_name}, your child ${student.full_name} has received a new assignment: "${newAssignment.title}" in ${course?.title}. Due date: ${new Date(newAssignment.due_date).toLocaleString()}. You can track completion on your Parent Dashboard.`);
      }
    }

    return newAssignment;
  },

  // Submissions
  getSubmissions: async ({ assignment_id, student_id }) => {
    let list = memoryData.assignment_submissions;
    if (assignment_id) list = list.filter(s => s.assignment_id === assignment_id);
    if (student_id) list = list.filter(s => s.student_id === student_id);

    return list.map(s => ({
      ...s,
      assignment: memoryData.assignments.find(a => a.id === s.assignment_id) || null,
      student: memoryData.profiles.find(p => p.id === s.student_id) || null
    }));
  },

  submitAssignment: async ({ assignment_id, student_id, submission_text, file_url }) => {
    const existingIdx = memoryData.assignment_submissions.findIndex(s => s.assignment_id === assignment_id && s.student_id === student_id);

    const submissionObj = {
      id: existingIdx !== -1 ? memoryData.assignment_submissions[existingIdx].id : uuidv4(),
      assignment_id,
      student_id,
      submission_text: submission_text || '',
      file_url: file_url || '',
      score: existingIdx !== -1 ? memoryData.assignment_submissions[existingIdx].score : null,
      feedback: existingIdx !== -1 ? memoryData.assignment_submissions[existingIdx].feedback : null,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      graded_at: existingIdx !== -1 ? memoryData.assignment_submissions[existingIdx].graded_at : null
    };

    if (existingIdx !== -1) {
      memoryData.assignment_submissions[existingIdx] = submissionObj;
    } else {
      memoryData.assignment_submissions.push(submissionObj);
    }

    // Notify tutor
    const assignment = memoryData.assignments.find(a => a.id === assignment_id);
    const student = memoryData.profiles.find(p => p.id === student_id);
    if (assignment && assignment.tutor_id) {
      await store.createNotification({
        user_id: assignment.tutor_id,
        title: 'New Student Assignment Submission',
        message: `${student?.full_name} submitted work for "${assignment.title}".`,
        type: 'assignment',
        link: '/tutor/assignments'
      });
    }

    return submissionObj;
  },

  gradeSubmission: async (submissionId, { score, feedback, tutorId }) => {
    const idx = memoryData.assignment_submissions.findIndex(s => s.id === submissionId);
    if (idx === -1) throw new Error('Submission not found.');

    const sub = memoryData.assignment_submissions[idx];
    sub.score = parseInt(score, 10);
    sub.feedback = feedback || '';
    sub.status = 'graded';
    sub.graded_at = new Date().toISOString();

    const assignment = memoryData.assignments.find(a => a.id === sub.assignment_id);
    const student = memoryData.profiles.find(p => p.id === sub.student_id);

    // Notify Student
    if (student) {
      await store.createNotification({
        user_id: student.id,
        title: `Assignment Graded: ${assignment?.title}`,
        message: `Your score: ${sub.score}/${assignment?.max_score || 100}. Feedback: "${sub.feedback}"`,
        type: 'assignment',
        link: '/student/assignments'
      });

      console.log(`📧 [EMAIL TO STUDENT]: ${student.email}`);
      console.log(`Subject: Assignment Graded: ${assignment?.title} (${sub.score}/${assignment?.max_score || 100})`);
    }

    // Notify Parent
    if (student) {
      const parentLinks = memoryData.parent_student_links.filter(l => l.student_id === student.id && l.status === 'active');
      for (const link of parentLinks) {
        const parent = memoryData.profiles.find(p => p.id === link.parent_id);
        if (parent) {
          await store.createNotification({
            user_id: parent.id,
            title: `Grade Report for ${student.full_name}: ${assignment?.title}`,
            message: `Scored ${sub.score}/${assignment?.max_score || 100}. Tutor feedback: "${sub.feedback}"`,
            type: 'assignment',
            link: '/parent/assignments'
          });

          console.log(`📧 [EMAIL TO PARENT]: ${parent.email}`);
          console.log(`Subject: Grade Report for ${student.full_name}: ${assignment?.title} - ${sub.score}/${assignment?.max_score || 100}`);
        }
      }
    }

    return sub;
  },

  // Deadline Approaching Notifier (Called periodically or on schedule)
  checkApproachingDeadlines: async () => {
    const now = Date.now();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    const remindersSent = [];

    for (const a of memoryData.assignments) {
      const dueTime = new Date(a.due_date).getTime();
      const diff = dueTime - now;

      // If due within 48 hours and hasn't expired yet
      if (diff > 0 && diff <= fortyEightHours) {
        const enrollments = memoryData.course_enrollments.filter(e => e.course_id === a.course_id);
        for (const enr of enrollments) {
          // Check if already submitted
          const hasSubmitted = memoryData.assignment_submissions.some(s => s.assignment_id === a.id && s.student_id === enr.student_id);
          if (!hasSubmitted) {
            const student = memoryData.profiles.find(p => p.id === enr.student_id);
            if (!student) continue;

            const hoursRemaining = Math.round(diff / (1000 * 60 * 60));

            // Notify student
            await store.createNotification({
              user_id: student.id,
              title: `Upcoming Deadline: ${a.title}`,
              message: `Reminder: "${a.title}" is due in approximately ${hoursRemaining} hours (${new Date(a.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}).`,
              type: 'assignment',
              link: '/student/assignments'
            });

            console.log(`⏰ 📧 [DEADLINE ALERT TO STUDENT]: ${student.email} - "${a.title}" is due in ${hoursRemaining} hours!`);

            // Notify parent
            const parentLinks = memoryData.parent_student_links.filter(l => l.student_id === student.id && l.status === 'active');
            for (const link of parentLinks) {
              const parent = memoryData.profiles.find(p => p.id === link.parent_id);
              if (parent) {
                await store.createNotification({
                  user_id: parent.id,
                  title: `Deadline Approaching for ${student.full_name}`,
                  message: `Assignment "${a.title}" is due in ${hoursRemaining} hours. Check in with your child to ensure timely submission.`,
                  type: 'assignment',
                  link: '/parent/assignments'
                });

                console.log(`⏰ 📧 [DEADLINE ALERT TO PARENT]: ${parent.email} - ${student.full_name}'s assignment is due in ${hoursRemaining} hours!`);
              }
            }
            remindersSent.push({ assignment: a.title, student: student.full_name });
          }
        }
      }
    }
    return remindersSent;
  },

  // Teacher Applications & 3-Minute Video Evaluations
  getTutorApplications: async ({ status, subject } = {}) => {
    let apps = [...(memoryData.tutor_applications || [])];
    if (status && status !== 'all') {
      apps = apps.filter(a => a.status === status);
    }
    if (subject && subject !== 'all') {
      apps = apps.filter(a => a.selected_subjects?.includes(subject));
    }
    return apps.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getTutorApplicationById: async (id) => {
    return (memoryData.tutor_applications || []).find(a => a.id === id) || null;
  },

  createTutorApplication: async (data) => {
    const newApp = {
      id: `app-${uuidv4()}`,
      full_name: data.full_name?.trim(),
      email: data.email?.trim().toLowerCase(),
      phone: data.phone?.trim() || '',
      location: data.location?.trim() || 'United Kingdom',
      highest_qualification: data.highest_qualification?.trim() || '',
      years_experience: data.years_experience || '1-3 years',
      current_role: data.current_role?.trim() || '',
      selected_subjects: Array.isArray(data.selected_subjects) ? data.selected_subjects : [],
      bio: data.bio?.trim() || '',
      teaching_approach: data.teaching_approach?.trim() || '',
      video_url: data.video_url?.trim() || '',
      video_duration: data.video_duration || 'Approx. 3 minutes',
      video_filename: data.video_filename || '',
      cv_url: data.cv_url || null,
      safeguarding_acknowledged: Boolean(data.safeguarding_acknowledged),
      safeguarding_version: 'v2.4-2026-UK-DFE-COMPLIANT',
      safeguarding_signature: data.safeguarding_signature?.trim() || data.full_name?.trim(),
      safeguarding_signed_at: new Date().toISOString(),
      dbs_status: data.dbs_status || 'Willing to undergo Enhanced DBS check',
      dbs_certificate_number: data.dbs_certificate_number || '',
      status: 'pending',
      admin_notes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!memoryData.tutor_applications) {
      memoryData.tutor_applications = [];
    }
    memoryData.tutor_applications.unshift(newApp);

    // Notify Super Admin
    const admins = memoryData.profiles.filter(p => p.role === 'superadmin' || p.role === 'admin');
    for (const admin of admins) {
      await store.createNotification({
        user_id: admin.id,
        title: 'New Teacher Application Received',
        message: `${newApp.full_name} has applied to teach A-Level ${newApp.selected_subjects.slice(0, 2).join(', ')}. 3-minute video and safeguarding signature ready for evaluation.`,
        type: 'system',
        link: '/admin/tutor-applications'
      });
    }

    console.log(`🎓 [TEACHER APPLICATION]: ${newApp.full_name} (${newApp.email}) applied for [${newApp.selected_subjects.join(', ')}]. Video: ${newApp.video_url}`);
    return newApp;
  },

  updateTutorApplicationStatus: async (id, { status, admin_notes, reviewed_by }) => {
    const app = (memoryData.tutor_applications || []).find(a => a.id === id);
    if (!app) return null;

    app.status = status;
    if (admin_notes !== undefined) app.admin_notes = admin_notes;
    if (reviewed_by) app.reviewed_by = reviewed_by;
    app.reviewed_at = new Date().toISOString();
    app.updated_at = new Date().toISOString();

    // If approved, ensure a tutor account is provisioned so they can teach!
    if (status === 'approved') {
      const existingProfile = memoryData.profiles.find(p => p.email.toLowerCase() === app.email.toLowerCase());
      if (!existingProfile) {
        const newTutorProfile = {
          id: uuidv4(),
          email: app.email.toLowerCase(),
          password_hash: DEFAULT_HASH,
          full_name: app.full_name,
          role: 'tutor',
          avatar_url: `https://images.unsplash.com/photo-${1534528741775 + (memoryData.profiles.length * 100)}?w=150`,
          phone: app.phone,
          bio: `${app.highest_qualification}. Specialised in ${app.selected_subjects.join(', ')}. ${app.teaching_approach?.slice(0, 150)}...`,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        memoryData.profiles.push(newTutorProfile);
        console.log(`✅ [TUTOR PROVISIONED]: Created active tutor profile for ${app.full_name} (${app.email}) with temporary password 'Password123!'`);
      } else if (existingProfile.role !== 'tutor' && existingProfile.role !== 'superadmin') {
        existingProfile.role = 'tutor';
        existingProfile.status = 'active';
      }
    }

    return app;
  }
};
