import { store } from '../database/store.js';

export const getAllCourses = async (req, res, next) => {
  try {
    const { category, level, search, tutor_id, status } = req.query;
    let courses = await store.getCourses();

    // If caller is public/student, only show published courses unless they are admin/tutor
    const isElevated = req.user && (req.user.role === 'superadmin' || req.user.role === 'tutor');
    if (!isElevated) {
      courses = courses.filter(c => c.status === 'published');
    } else if (status) {
      courses = courses.filter(c => c.status === status);
    }

    if (category) {
      courses = courses.filter(c => c.category_id === category || (c.category && c.category.slug === category));
    }
    if (level && level !== 'all') {
      courses = courses.filter(c => c.level === level);
    }
    if (tutor_id) {
      courses = courses.filter(c => c.tutor_id === tutor_id);
    }
    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(q) || 
        (c.description && c.description.toLowerCase().includes(q))
      );
    }

    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await store.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Attach materials and classes for this course
    const allMaterials = await store.getMaterials();
    const courseMaterials = allMaterials.filter(m => m.course_id === course.id);

    const allClasses = await store.getClasses();
    const courseClasses = allClasses.filter(c => c.course_id === course.id);

    res.status(200).json({
      success: true,
      course: {
        ...course,
        materials: courseMaterials,
        classes: courseClasses
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { title, description, category_id, level = 'Beginner', price = 0, thumbnail_url, status = 'published' } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Course title and description are required.' });
    }

    // If tutor creates course, auto-assign tutor_id to themselves. If admin, allow passing tutor_id.
    const tutor_id = req.user.role === 'tutor' ? req.user.id : (req.body.tutor_id || req.user.id);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36);

    const newCourse = await store.createCourse({
      title,
      slug,
      description,
      category_id: category_id || null,
      tutor_id,
      thumbnail_url: thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      level,
      price: parseFloat(price) || 0,
      status
    });

    await store.logAudit({
      user_id: req.user.id,
      action: 'CREATE_COURSE',
      entity_type: 'COURSE',
      entity_id: newCourse.id,
      ip_address: req.ip || '127.0.0.1',
      details: { title: newCourse.title }
    });

    res.status(201).json({ success: true, message: 'Course created successfully.', course: newCourse });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await store.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Check ownership if tutor
    if (req.user.role === 'tutor' && course.tutor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only edit courses assigned to you.' });
    }

    const updated = await store.updateCourse(course.id, req.body);
    res.status(200).json({ success: true, message: 'Course updated successfully.', course: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await store.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (req.user.role === 'tutor' && course.tutor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete your own courses.' });
    }

    await store.deleteCourse(course.id);
    res.status(200).json({ success: true, message: 'Course deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await store.getCategories();
    res.status(200).json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

export const enrollInCourse = async (req, res, next) => {
  try {
    const course_id = req.params.id;
    const student_id = req.user.id;

    const course = await store.getCourseById(course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const allEnrollments = await store.getEnrollments();
    const existing = allEnrollments.find(e => e.course_id === course_id && e.student_id === student_id);

    if (existing) {
      return res.status(409).json({ success: false, message: 'You are already enrolled in this course.' });
    }

    const enrollment = await store.createEnrollment({
      course_id,
      student_id,
      status: 'enrolled',
      progress_pct: 0
    });

    // Notify student
    await store.createNotification({
      user_id: student_id,
      title: 'Enrolled in Course',
      message: `You have successfully enrolled in "${course.title}".`,
      type: 'course',
      link: `/student/courses`
    });

    // Notify tutor
    if (course.tutor_id) {
      await store.createNotification({
        user_id: course.tutor_id,
        title: 'New Student Enrollment',
        message: `${req.user.full_name} enrolled in "${course.title}".`,
        type: 'course',
        link: `/tutor/courses`
      });
    }

    res.status(201).json({ success: true, message: 'Successfully enrolled in course.', enrollment });
  } catch (err) {
    next(err);
  }
};

export const getMyEnrollments = async (req, res, next) => {
  try {
    const allEnrollments = await store.getEnrollments();
    const userEnrollments = allEnrollments.filter(e => e.student_id === req.user.id);
    res.status(200).json({ success: true, enrollments: userEnrollments });
  } catch (err) {
    next(err);
  }
};
