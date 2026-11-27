import { store } from '../database/store.js';
import { getClientIp } from '../middleware/securityMiddleware.js';
import { isSafeUrl, clampText, pickFields, isUuid } from '../utils/validators.js';

const COURSE_EDITABLE_FIELDS = ['title', 'description', 'category_id', 'tutor_id', 'level', 'price', 'discount_from', 'hourly_rate', 'hourly_note', 'thumbnail_url', 'status'];
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

    // When filtering by tutor_id, include courses where this tutor is assigned to at least one student OR directly assigned as course tutor
    if (tutor_id && isUuid(tutor_id)) {
      const [tutorLinks, allEnrollments] = await Promise.all([
        store.getTutorStudentLinks({ tutor_id }),
        store.getEnrollments()
      ]);

      const linkedCourseIds = new Set();
      const studentsByCourse = new Map();

      const addStudentToCourse = (cid, stu) => {
        if (!cid || !stu?.id) return;
        linkedCourseIds.add(cid);
        if (!studentsByCourse.has(cid)) studentsByCourse.set(cid, new Map());
        studentsByCourse.get(cid).set(stu.id, stu);
      };

      for (const link of tutorLinks) {
        if (link.course_id) {
          addStudentToCourse(link.course_id, link.student);
        } else {
          // General link: attach all enrolled courses of this student
          const stuEnrs = allEnrollments.filter((e) => e.student_id === link.student_id);
          for (const enr of stuEnrs) {
            addStudentToCourse(enr.course_id, link.student);
          }
        }
      }

      for (const enr of allEnrollments) {
        if (enr.tutor_id === tutor_id) {
          addStudentToCourse(enr.course_id, enr.student);
        }
      }

      courses = courses
        .filter((c) => c.tutor_id === tutor_id || linkedCourseIds.has(c.id))
        .map((c) => {
          const studentMap = studentsByCourse.get(c.id);
          const assignedStudents = studentMap ? Array.from(studentMap.values()) : [];
          return {
            ...c,
            assigned_students: assignedStudents,
            assigned_students_count: assignedStudents.length
          };
        });
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

    if (!req.user) {
      return res.status(200).json({ success: true, course });
    }

    const [allMaterials, allClasses] = await Promise.all([
      store.getMaterials(),
      store.getClasses()
    ]);

    let scopedMaterials = allMaterials.filter((m) => m.course_id === course.id);
    let scopedClasses = allClasses.filter((c) => c.course_id === course.id && c.tutor?.role === 'tutor');

    if (req.user.role === 'student') {
      const assignedTutors = new Set(await store.getAssignedTutorIdsForStudent(req.user.id, course.id));
      scopedMaterials = scopedMaterials.filter((m) => assignedTutors.has(m.uploader_id));
      scopedClasses = scopedClasses.filter((c) => assignedTutors.has(c.tutor_id));
    } else if (req.user.role === 'tutor') {
      scopedMaterials = scopedMaterials.filter((m) => m.uploader_id === req.user.id);
      scopedClasses = scopedClasses.filter((c) => c.tutor_id === req.user.id);
    }

    res.status(200).json({
      success: true,
      course: {
        ...course,
        materials: scopedMaterials,
        classes: scopedClasses
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

    // Never assign Superadmin as a course tutor; keep tutor_id null unless an actual tutor is chosen
    let tutor_id = null;
    if (req.user.role === 'tutor') {
      tutor_id = req.user.id;
    } else if (isUuid(req.body.tutor_id)) {
      const candidate = await store.getProfileById(req.body.tutor_id);
      if (candidate && candidate.role === 'tutor') tutor_id = candidate.id;
    }

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
    if (updates.tutor_id === '') {
      updates.tutor_id = null;
    } else if (updates.tutor_id && isUuid(updates.tutor_id)) {
      const candidate = await store.getProfileById(updates.tutor_id);
      if (!candidate || candidate.role !== 'tutor') {
        updates.tutor_id = null;
      }
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
    const student_id = req.body?.student_id;

    if (!isUuid(student_id)) {
      return res.status(400).json({ success: false, message: 'Valid student_id is required.' });
    }

    const course = await store.getCourseById(course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const student = await store.getProfileById(student_id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student account not found.' });
    }

    const enrollment = await store.createEnrollment({
      course_id: course.id,
      student_id: student.id,
      status: 'enrolled',
      progress_pct: 0
    });

    await store.createNotification({
      user_id: student.id,
      title: 'Enrolled in Course',
      message: `You have been enrolled in "${course.title}".`,
      type: 'course',
      link: '/student/courses'
    });

    res.status(201).json({ success: true, message: 'Student enrolled in course successfully.', enrollment });
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
