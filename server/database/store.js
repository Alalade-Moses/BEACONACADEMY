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
      email: 'admin@edulearn.com',
      password_hash: DEFAULT_HASH,
      full_name: 'Marcus Sterling (Super Admin)',
      role: 'superadmin',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      phone: '+1-800-555-0101',
      bio: 'Platform Super Administrator with complete institutional oversight.',
      status: 'active',
      created_at: new Date('2026-01-01T08:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'dr.sarah@edulearn.com',
      password_hash: DEFAULT_HASH,
      full_name: 'Dr. Sarah Jenkins',
      role: 'tutor',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      phone: '+1-555-234-5678',
      bio: 'PhD in Computer Science, 12 years experience teaching Full-Stack Systems & AI.',
      status: 'active',
      created_at: new Date('2026-01-05T09:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      email: 'prof.chen@edulearn.com',
      password_hash: DEFAULT_HASH,
      full_name: 'Prof. Michael Chen',
      role: 'tutor',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      phone: '+1-555-876-5432',
      bio: 'Chair of Mathematics, specialized in Linear Algebra, Calculus and Quantum Algorithms.',
      status: 'active',
      created_at: new Date('2026-01-07T10:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      email: 'alex.morgan@edulearn.com',
      password_hash: DEFAULT_HASH,
      full_name: 'Alex Morgan',
      role: 'student',
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      phone: '+1-555-111-2233',
      bio: 'Aspiring software developer passionate about cloud computing and web platforms.',
      status: 'active',
      created_at: new Date('2026-01-10T11:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      email: 'sophia.williams@edulearn.com',
      password_hash: DEFAULT_HASH,
      full_name: 'Sophia Williams',
      role: 'student',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      phone: '+1-555-444-5566',
      bio: 'High school senior preparing for university mathematics and data science competitions.',
      status: 'active',
      created_at: new Date('2026-01-12T12:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      email: 'lucas.patel@edulearn.com',
      password_hash: DEFAULT_HASH,
      full_name: 'Lucas Patel',
      role: 'student',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      phone: '+1-555-777-8899',
      bio: 'Enthusiastic beginner in coding and interactive algorithms.',
      status: 'active',
      created_at: new Date('2026-01-15T13:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000007',
      email: 'david.morgan@edulearn.com',
      password_hash: DEFAULT_HASH,
      full_name: 'David Morgan',
      role: 'parent',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      phone: '+1-555-999-0011',
      bio: 'Parent of Alex Morgan. Monitoring academic performance and attendance.',
      status: 'active',
      created_at: new Date('2026-01-18T14:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000008',
      email: 'rachel.williams@edulearn.com',
      password_hash: DEFAULT_HASH,
      full_name: 'Rachel Williams',
      role: 'parent',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      phone: '+1-555-888-2244',
      bio: 'Mother of Sophia Williams.',
      status: 'active',
      created_at: new Date('2026-01-20T15:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  parent_student_links: [
    {
      id: '40000000-0000-0000-0000-000000000001',
      parent_id: '00000000-0000-0000-0000-000000000007',
      student_id: '00000000-0000-0000-0000-000000000004',
      relationship: 'Father',
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      parent_id: '00000000-0000-0000-0000-000000000008',
      student_id: '00000000-0000-0000-0000-000000000005',
      relationship: 'Mother',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ],

  course_categories: [
    {
      id: '10000000-0000-0000-0000-000000000001',
      name: 'Computer Science & Software',
      slug: 'computer-science',
      description: 'Modern programming languages, web engineering, cloud infrastructure and AI algorithms.',
      icon: 'Code',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      name: 'Mathematics & Analytics',
      slug: 'mathematics',
      description: 'Pure and applied mathematics, statistics, calculus, and machine learning foundations.',
      icon: 'Calculator',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      name: 'Natural Sciences & Physics',
      slug: 'natural-sciences',
      description: 'Physics, chemistry, and experimental sciences with live interactive diagrams.',
      icon: 'Atom',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],

  courses: [
    {
      id: '20000000-0000-0000-0000-000000000001',
      title: 'Mastering Full-Stack Web Architecture',
      slug: 'mastering-full-stack-web-architecture',
      description: 'Comprehensive training in modern frontend React, Node.js backend systems, WebSockets, and cloud deployment.',
      category_id: '10000000-0000-0000-0000-000000000001',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      level: 'Intermediate',
      price: 299.00,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '20000000-0000-0000-0000-000000000002',
      title: 'Linear Algebra & Calculus for Machine Learning',
      slug: 'linear-algebra-calculus-for-ml',
      description: 'Deep dive into vectors, matrices, eigenvalues, gradients, and optimization mathematics for AI.',
      category_id: '10000000-0000-0000-0000-000000000002',
      tutor_id: '00000000-0000-0000-0000-000000000003',
      thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
      level: 'Advanced',
      price: 349.00,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '20000000-0000-0000-0000-000000000003',
      title: 'Data Structures & Algorithms in Practice',
      slug: 'data-structures-and-algorithms',
      description: 'Master trees, graphs, dynamic programming, and complexity analysis for technical excellence.',
      category_id: '10000000-0000-0000-0000-000000000001',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
      level: 'All Levels',
      price: 249.00,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  course_enrollments: [
    {
      id: '50000000-0000-0000-0000-000000000001',
      course_id: '20000000-0000-0000-0000-000000000001',
      student_id: '00000000-0000-0000-0000-000000000004',
      status: 'enrolled',
      progress_pct: 65,
      enrolled_at: new Date().toISOString()
    },
    {
      id: '50000000-0000-0000-0000-000000000002',
      course_id: '20000000-0000-0000-0000-000000000002',
      student_id: '00000000-0000-0000-0000-000000000005',
      status: 'enrolled',
      progress_pct: 80,
      enrolled_at: new Date().toISOString()
    },
    {
      id: '50000000-0000-0000-0000-000000000003',
      course_id: '20000000-0000-0000-0000-000000000003',
      student_id: '00000000-0000-0000-0000-000000000004',
      status: 'enrolled',
      progress_pct: 30,
      enrolled_at: new Date().toISOString()
    },
    {
      id: '50000000-0000-0000-0000-000000000001',
      course_id: '20000000-0000-0000-0000-000000000001',
      student_id: '00000000-0000-0000-0000-000000000006',
      status: 'enrolled',
      progress_pct: 15,
      enrolled_at: new Date().toISOString()
    }
  ],

  classes: [
    {
      id: '30000000-0000-0000-0000-000000000001',
      course_id: '20000000-0000-0000-0000-000000000001',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      title: 'Live Workshop: Real-Time WebSockets & Interactive Canvases',
      description: 'Building real-time bi-directional collaborative canvas tools with WebSockets and React.',
      scheduled_at: new Date(Date.now() + 3600000).toISOString(),
      duration_minutes: 75,
      status: 'scheduled',
      meeting_room_id: 'ROOM-CS101-LIVE',
      presentation_url: '/slides/sample-presentation.pdf',
      presentation_pages: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '30000000-0000-0000-0000-000000000002',
      course_id: '20000000-0000-0000-0000-000000000002',
      tutor_id: '00000000-0000-0000-0000-000000000003',
      title: 'Eigenvalues & Matrix Decomposition Deep Dive',
      description: 'Exploring SVD and principal components with real-world interactive whiteboard derivations.',
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      duration_minutes: 90,
      status: 'scheduled',
      meeting_room_id: 'ROOM-MATH301-LIVE',
      presentation_url: '/slides/sample-presentation.pdf',
      presentation_pages: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '30000000-0000-0000-0000-000000000003',
      course_id: '20000000-0000-0000-0000-000000000001',
      tutor_id: '00000000-0000-0000-0000-000000000002',
      title: 'Foundations of Modern Node.js Architecture',
      description: 'Recorded class covering event loops, asynchronous streams and Express middleware.',
      scheduled_at: new Date(Date.now() - 259200000).toISOString(),
      duration_minutes: 60,
      status: 'completed',
      meeting_room_id: 'ROOM-CS101-REC1',
      presentation_url: '/slides/sample-presentation.pdf',
      presentation_pages: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  class_attendance: [
    {
      id: '60000000-0000-0000-0000-000000000001',
      class_id: '30000000-0000-0000-0000-000000000003',
      user_id: '00000000-0000-0000-0000-000000000004',
      role: 'student',
      joined_at: new Date(Date.now() - 259200000).toISOString(),
      left_at: new Date(Date.now() - 255600000).toISOString(),
      duration_minutes: 60,
      status: 'present'
    },
    {
      id: '60000000-0000-0000-0000-000000000002',
      class_id: '30000000-0000-0000-0000-000000000003',
      user_id: '00000000-0000-0000-0000-000000000006',
      role: 'student',
      joined_at: new Date(Date.now() - 258600000).toISOString(),
      left_at: new Date(Date.now() - 255600000).toISOString(),
      duration_minutes: 50,
      status: 'present'
    }
  ],

  learning_materials: [
    {
      id: '70000000-0000-0000-0000-000000000001',
      course_id: '20000000-0000-0000-0000-000000000001',
      class_id: '30000000-0000-0000-0000-000000000001',
      uploader_id: '00000000-0000-0000-0000-000000000002',
      title: 'WebSocket Architecture & Canvas Sync Slides.pdf',
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
      title: 'Full-Stack Developer Cheat Sheet.pdf',
      file_url: '/materials/fullstack-cheatsheet.pdf',
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
      title: 'Linear Algebra Lecture Notes.pdf',
      file_url: '/slides/math-notes.pdf',
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
      title: 'Foundations of Modern Node.js Architecture - Session Recording',
      recording_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration_seconds: 3600,
      file_size: 245000000,
      is_published: true,
      created_at: new Date(Date.now() - 250000000).toISOString()
    }
  ],

  notifications: [
    {
      id: '90000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000004',
      title: 'Upcoming Class in 1 Hour',
      message: 'Your live session "Real-Time WebSockets & Interactive Canvases" starts soon.',
      type: 'class',
      link: '/classroom/ROOM-CS101-LIVE',
      is_read: false,
      created_at: new Date().toISOString()
    },
    {
      id: '90000000-0000-0000-0000-000000000002',
      user_id: '00000000-0000-0000-0000-000000000005',
      title: 'New Material Uploaded',
      message: 'Prof. Chen added "Linear Algebra Lecture Notes.pdf" to your course.',
      type: 'course',
      link: '/student/materials',
      is_read: false,
      created_at: new Date().toISOString()
    },
    {
      id: '90000000-0000-0000-0000-000000000003',
      user_id: '00000000-0000-0000-0000-000000000007',
      title: 'Student Class Reminder',
      message: 'Alex Morgan has an upcoming live session scheduled.',
      type: 'attendance',
      link: '/parent/attendance',
      is_read: false,
      created_at: new Date().toISOString()
    }
  ],

  announcements: [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      sender_id: '00000000-0000-0000-0000-000000000001',
      sender_name: 'Marcus Sterling (Super Admin)',
      title: 'Welcome to the New Academic Semester on EduLearn',
      content: 'We are pleased to introduce the upgraded real-time virtual classroom with slide annotation and whiteboard capabilities.',
      target_role: 'all',
      created_at: new Date().toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      sender_id: '00000000-0000-0000-0000-000000000002',
      sender_name: 'Dr. Sarah Jenkins',
      title: 'CS101: Presentation Materials Updated',
      content: 'Please download the lecture notes before attending todays live session.',
      target_role: 'student',
      created_at: new Date().toISOString()
    }
  ],

  audit_logs: [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000001',
      user_email: 'admin@edulearn.com',
      action: 'SYSTEM_BOOT',
      entity_type: 'SYSTEM',
      entity_id: 'INIT',
      ip_address: '127.0.0.1',
      details: { message: 'EduLearn System Initialized with default roles & courses' },
      created_at: new Date().toISOString()
    }
  ],

  platform_settings: {
    platform_name: 'EduLearn Global LMS',
    contact_email: 'support@edulearn.com',
    currency: 'USD',
    allow_public_registration: 'true',
    enable_recordings: 'true',
    enable_whiteboard: 'true',
    maintenance_mode: 'false'
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
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*').ilike('email', email).single();
      if (!error && data) return data;
    }
    return memoryData.profiles.find(p => p.email.toLowerCase() === email.toLowerCase()) || null;
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
  }
};
