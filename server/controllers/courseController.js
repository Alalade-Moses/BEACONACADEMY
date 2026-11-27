import { store } from '../database/store.js';
import { getClientIp } from '../middleware/securityMiddleware.js';
import { isSafeUrl, clampText, pickFields } from '../utils/validators.js';

const COURSE_EDITABLE_FIELDS = ['title', 'description', 'category_id', 'level', 'price', 'discount_from', 'hourly_rate', 'hourly_note', 'thumbnail_url', 'status'];
const VALID_COURSE_STATUSES = new Set(['draft', 'published', 'archived']);

export const getAllCourses = async (req, res, next) => {
  try {
    const { category, level, search, tutor_id, status } = req.query;
    let courses = await store.getCourses();

    const isElevated = req.user && (req.user.role === 'superadmin' || req.user.role === 'tutor');
    if (!isElevated) {
      courses = courses.filter((c) => c.status === 'published');
    } else if (status) {
      courses = courses.filter((c) => c.status === status);
    }

    if (category) {
      courses = courses.filter((c) => c.category_id === category || (c.category && c.category.slug === category));
    }
    if (level && level !== 'all') {
      courses = courses.filter((c) => c.level === level);
    }
    if (tutor_id) {
      courses = courses.filter((c) => c.tutor_id === tutor_id);
    }
    if (search) {
      const q = String(search).toLowerCase();
      courses = courses.filter(
        (c) =>
          (c.title || '').toLowerCase().includes(q) ||
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

    const isElevated = req.user && (req.user.role === 'superadmin' || req.user.role === 'tutor');
    if (course.status !== 'published' && !isElevated) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Only expose private class schedules and learning materials to authenticated portal users
    if (!req.user) {
      return res.status(200).json({ success: true, course });
    }

    const [allMaterials, allClasses] = await Promise.all([
      store.getMaterials(),
      store.getClasses()
    ]);

    res.status(200).json({
      success: true,
      course: {
        ...course,
        materials: allMaterials.filter((m) => m.course_id === course.id),
        classes: allClasses.filter((c) => c.course_id === course.id)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { title, description, category_id, level = 'Beginner', price = 0, thumbnail_url, status = 'published' } = req.body || {};

    const cleanTitle = clampText(title || '', 200);
    const cleanDesc = clampText(description || '', 3000);
    if (!cleanTitle || !cleanDesc) {
      return res.status(400).json({ success: false, message: 'Course title and description are required.' });
    }
    if (!VALID_COURSE_STATUSES.has(status)) {
      return res.status(400).json({ success: false, message: 'Invalid course status.' });
    }
    if (thumbnail_url && !isSafeUrl(thumbnail_url, { allowRelative: true, allowEmpty: true })) {
      return res.status(400).json({ success: false, message: 'Invalid course thumbnail URL.' });
    }
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0 || parsedPrice > 50000) {
      return res.status(400).json({ success: false, message: 'Course price must be between £0 and £50,000.' });
    }

    const tutor_id = req.user.role === 'tutor' ? req.user.id : (req.body.tutor_id || req.user.id);
    const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36);

    const newCourse = await store.createCourse({
      title: cleanTitle,
      slug,
      description: cleanDesc,
      category_id: category_id || null,
      tutor_id,
      thumbnail_url: thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      level: clampText(level, 100),
      price: parsedPrice,
      status
    });

    await store.logAudit({
      user_id: req.user.id,
      action: 'CREATE_COURSE',
      entity_type: 'COURSE',
      entity_id: newCourse.id,
      ip_address: getClientIp(req),
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

    if (req.user.role === 'tutor' && course.tutor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only edit courses assigned to you.' });
    }

    const updates = pickFields(req.body, COURSE_EDITABLE_FIELDS);
    if (updates.status && !VALID_COURSE_STATUSES.has(updates.status)) {
      return res.status(400).json({ success: false, message: 'Invalid course status.' });
    }
    if (updates.thumbnail_url && !isSafeUrl(updates.thumbnail_url, { allowRelative: true, allowEmpty: true })) {
      return res.status(400).json({ success: false, message: 'Invalid thumbnail URL.' });
    }
    if (updates.price !== undefined) {
      const p = Number(updates.price);
      if (!Number.isFinite(p) || p < 0 || p > 50000) {
        return res.status(400).json({ success: false, message: 'Invalid price value.' });
      }
      updates.price = p;
    }

    const updated = await store.updateCourse(course.id, updates);
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
    const existing = allEnrollments.find((e) => e.course_id === course.id && e.student_id === student_id);
    if (existing) {
      return res.status(409).json({ success: false, message: 'You are already enrolled in this course.' });
    }

    const enrollment = await store.createEnrollment({
      course_id: course.id,
      student_id,
      status: 'enrolled',
      progress_pct: 0
    });

    await store.createNotification({
      user_id: student_id,
      title: 'Enrolled in Course',
      message: `You have successfully enrolled in "${course.title}".`,
      type: 'course',
      link: '/student/courses'
    });

    if (course.tutor_id) {
      await store.createNotification({
        user_id: course.tutor_id,
        title: 'New Student Enrollment',
        message: `${req.user.full_name} enrolled in "${course.title}".`,
        type: 'course',
        link: '/tutor/courses'
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
    const userEnrollments = allEnrollments.filter((e) => e.student_id === req.user.id);
    res.status(200).json({ success: true, enrollments: userEnrollments });
  } catch (err) {
    next(err);
  }
};
