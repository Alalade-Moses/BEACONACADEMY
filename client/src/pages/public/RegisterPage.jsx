import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { SEO } from '../../components/common/SEO';
import { showError, showSuccess, showWarning, showNetworkError } from '../../utils/swal';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Check,
  Eye,
  EyeOff,
  BookOpen,
  Sparkles,
  Layers,
  Globe,
  Globe2,
  Award,
  CheckSquare,
  Square,
  SlidersHorizontal,
  Upload,
  FileUp
} from 'lucide-react';

// Curriculum Subject Definitions
const GCSE_CORE_SUBJECTS = [
  'Mathematics',
  'English Language & Literature',
  'Chemistry',
  'Biology',
  'Physics'
];

const UK_ALEVEL_SUBJECTS = [
  'Mathematics',
  'Further Mathematics',
  'English Literature',
  'Chemistry',
  'Biology',
  'Physics',
  'Economics',
  'History',
  'Psychology',
  'Computer Science',
  'Business Studies'
];

const CANADA_SUBJECTS = [
  'Advanced Functions (MHF4U)',
  'Calculus & Vectors (MCV4U)',
  'English Grade 12 (ENG4U)',
  'Chemistry Grade 12 (SCH4U)',
  'Biology Grade 12 (SBI4U)',
  'Physics Grade 12 (SPH4U)',
  'Canadian & World Issues (CGW4U)'
];

const US_AP_SUBJECTS = [
  'AP Calculus AB / BC',
  'AP English Language & Composition',
  'AP Chemistry',
  'AP Physics 1 / C',
  'AP Biology',
  'AP United States History',
  'AP Computer Science A',
  'AP Microeconomics'
];

const KS2_SUBJECTS = [
  'KS2 Mathematics & Arithmetic',
  'KS2 English Reading & Comprehension',
  'KS2 SPaG & Creative Writing',
  '11+ / Primary SATs Preparation'
];

const KS3_SUBJECTS = [
  'KS3 Mathematics',
  'KS3 English',
  'KS3 Combined Sciences'
];

const SOFTWARE_FRONTEND_SUBJECTS = [
  'HTML5 & Modern Web Semantics',
  'Responsive CSS3, Flexbox & Grid',
  'JavaScript (ES6+) & DOM Architecture',
  'React.js Component Architecture & Hooks',
  'Tailwind CSS UI Component Library',
  'RESTful API Consumption & State'
];

const SOFTWARE_BACKEND_SUBJECTS = [
  'Node.js & Asynchronous Event Loop',
  'Express.js Server & Routing Architecture',
  'RESTful API Design & Best Practices',
  'PostgreSQL Relational DB & Schema Design',
  'MongoDB NoSQL Document Store',
  'JWT Authentication & Server Security'
];

const GRAPHICS_DESIGN_SUBJECTS = [
  'Visual Design Principles & Color Theory',
  'Typography & Brand Layout Systems',
  'Brand Identity, Logo & Style Guides',
  'Adobe Illustrator (Vector Illustration)',
  'Adobe Photoshop (Digital Raster & Retouching)',
  'Figma UI/UX Prototyping & Wireframing'
];

const EXAM_BOARDS = [
  { id: 'AQA', name: 'AQA (Assessment and Qualifications Alliance)' },
  { id: 'Edexcel', name: 'Pearson Edexcel' },
  { id: 'OCR', name: 'OCR (Oxford, Cambridge and RSA)' },
  { id: 'WJEC', name: 'WJEC / Eduqas' },
  { id: 'CIE', name: 'Cambridge Assessment International (CIE)' },
  { id: 'AP_US', name: 'College Board Advanced Placement (US)' },
  { id: 'Canada_Provincial', name: 'Canadian Provincial (Ontario / BC)' },
  { id: 'Primary_SATs', name: 'UK Primary National Curriculum / 11+ SATs (KS2)' },
  { id: 'Industry_Cert', name: 'Industry Professional Certification & Portfolio' }
];

const INITIAL_COURSES = [
  {
    id: '20000000-0000-0000-0000-000000000009',
    title: 'Key Stage 2 Foundation & SATs (Year 3–6)',
    slug: 'ks2-foundation-sats',
    description: 'Primary Numeracy, English Reading & Writing, and 11+ / SATs preparation for Year 3–6 students.',
    level: 'KS2 (Year 3–6)',
    price: 149.00,
    discount_from: 199.00,
    hourly_note: null
  },
  {
    id: '20000000-0000-0000-0000-000000000005',
    title: 'Key Stage 3 Foundation Bridge (Year 7–9)',
    slug: 'ks3-foundation-bridge',
    description: 'Foundational curriculum bridge across KS3 Maths, English, and Combined Science. (£249/month or £40/hour Year 7–11).',
    level: 'KS3 (Year 7–9)',
    price: 249.00,
    discount_from: 299.00,
    hourly_rate: 40.00,
    hourly_note: '£40/hour per subject (Year 7–11)'
  },
  {
    id: '20000000-0000-0000-0000-000000000001',
    title: 'GCSE 5-Subject Core Bundle',
    slug: 'gcse-5-subject-bundle',
    description: 'Comprehensive GCSE curriculum covering Mathematics, English Language & Literature, Chemistry, Biology, and Physics. (£299/month or £40/hour per subject Year 7–11).',
    level: 'GCSE (Year 10–11)',
    price: 299.00,
    discount_from: 380.00,
    hourly_rate: 40.00,
    hourly_note: '£40/hour per subject (Year 7–11)'
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    title: 'UK A-Level 3-Subject Specialist Program',
    slug: 'uk-a-level-3-subject-program',
    description: 'Choose your 3 A-Level subjects from Pure & Further Maths, Sciences, Economics, English, and Computing. (£320/month or £45/hour).',
    level: 'A-Level (Year 12–13)',
    price: 320.00,
    discount_from: 399.00,
    hourly_rate: 45.00,
    hourly_note: '£45/hour per A-Level subject'
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    title: 'Canada Senior Secondary & AP Program (Grade 11/12)',
    slug: 'canada-senior-secondary-program',
    description: 'Advanced Functions, Calculus & Vectors, Sciences, and English Grade 12 for university entry. (£320/month — same rate as UK A-Level).',
    level: 'Canada Grade 11–12',
    price: 320.00,
    discount_from: 399.00,
    hourly_rate: 45.00,
    hourly_note: '£45/hour per subject'
  },
  {
    id: '20000000-0000-0000-0000-000000000004',
    title: 'US High School Advanced & AP Mastery Program',
    slug: 'us-high-school-ap-mastery',
    description: 'AP Calculus BC, AP Chemistry, AP Physics 1/C, AP Biology, and AP English Literature. (£320/month or £45/hour).',
    level: 'US High School / AP',
    price: 320.00,
    discount_from: 399.00,
    hourly_rate: 45.00,
    hourly_note: '£45/hour per subject'
  },
  {
    id: '20000000-0000-0000-0000-000000000006',
    title: 'Coding (Software Development)',
    slug: 'software-development',
    description: 'Industry-standard Coding (Software Development) program at £340/month (£35/hour). Choose Frontend or Backend Coding specialization.',
    level: 'Tech & Coding Track',
    price: 340.00,
    discount_from: 420.00,
    hourly_rate: 35.00,
    hourly_note: '£35/hour flexible coaching'
  },
  {
    id: '20000000-0000-0000-0000-000000000007',
    title: 'Graphics Design',
    slug: 'graphics-design',
    description: 'Comprehensive Visual & Graphic Design at £200/month (£20/hour): Figma UI/UX prototyping, brand identity, typography, Adobe Photoshop/Illustrator.',
    level: 'Creative / Digital Arts',
    price: 200.00,
    discount_from: 260.00,
    hourly_rate: 20.00,
    hourly_note: '£20/hour studio coaching'
  }
];

const getHourlyLabelForCourse = (course) => {
  if (!course) return null;
  if (course.hourly_note) return course.hourly_note;
  if (course.hourly_rate) {
    const slug = course.slug || '';
    if (slug.includes('gcse') || slug.includes('ks3')) return `£${course.hourly_rate}/hour (Year 7–11)`;
    return `£${course.hourly_rate}/hour per subject`;
  }
  const slug = (course.slug || '').toLowerCase();
  const title = (course.title || '').toLowerCase();
  if (slug.includes('gcse') || title.includes('gcse') || slug.includes('ks3') || title.includes('ks3')) return '£40/hour per subject (Year 7–11)';
  if (slug.includes('a-level') || title.includes('a-level') || slug.includes('canada') || slug.includes('us')) return '£45/hour per A-Level / AP subject';
  if (slug.includes('software') || title.includes('coding')) return '£35/hour coding coaching';
  if (slug.includes('graphics') || title.includes('graphics')) return '£20/hour studio coaching';
  return null;
};

export const RegisterPage = () => {
  const { registerJoint } = useAuth();
  const navigate = useNavigate();

  // Courses list initialized with full curriculum and technology tracks
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [bankDetails, setBankDetails] = useState({
    bank_name: 'Barclays Bank UK PLC',
    account_name: 'Beacon Bridge Academics Ltd.',
    tuition_fee: '£299.00 GBP / month',
    instructions: 'Upload your bank transfer confirmation receipt or payment slip below.'
  });

  // Track state for Coding (Software Development) — £340/month (£35/hour)
  const [softwareTrack, setSoftwareTrack] = useState('Frontend Coding');

  // Selected subjects state (defaults to GCSE core subjects)
  const defaultInitialCourse = INITIAL_COURSES.find(c => c.slug?.includes('gcse')) || INITIAL_COURSES[0];
  const [selectedSubjects, setSelectedSubjects] = useState(GCSE_CORE_SUBJECTS);
  const [examBoard, setExamBoard] = useState('AQA');
  const [hasSubjectException, setHasSubjectException] = useState(false);
  const [customExceptionNote, setCustomExceptionNote] = useState('');

  // Form State: Student + Parent together
  const [formData, setFormData] = useState({
    // Student fields
    student_name: '',
    student_email: '',
    student_password: '',
    student_confirm_password: '',
    student_phone: '',
    student_grade: 'Year 11 (GCSE)',

    // Parent fields
    parent_name: '',
    parent_email: '',
    parent_password: '',
    parent_confirm_password: '',
    parent_phone: '',
    parent_relationship: 'Father',

    // Course & Payment
    course_id: defaultInitialCourse.id,
    bank_reference: '',
    payment_proof_url: '',
    amount: Number(defaultInitialCourse.price || 299).toFixed(2)
  });

  const proofFileInputRef = useRef(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofFileName, setProofFileName] = useState('');

  const [showStudentPass, setShowStudentPass] = useState(false);
  const [showParentPass, setShowParentPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleProofFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProofFileName(file.name);
    try {
      setUploadingProof(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setFormData(prev => ({
          ...prev,
          payment_proof_url: res.data.url
        }));
      }
    } catch (err) {
      const isNetErr = err.message === 'Network Error' || err.code === 'ERR_NETWORK' || !err.response;
      if (isNetErr) {
        showNetworkError({
          title: 'Payment Slip Upload Failed',
          text: 'Network connection was interrupted while uploading your proof slip. Please check your internet connection and tap retry.',
          onRetry: () => proofFileInputRef.current?.click()
        });
      } else {
        showError('Upload Failed', err.response?.data?.message || err.message || 'Could not upload payment proof slip.');
      }
    } finally {
      setUploadingProof(false);
    }
  };

  useEffect(() => {
    // Fetch available courses from database (excluding IELTS, which has its dedicated onboarding page)
    const fetchCoursesAndBank = async () => {
      try {
        const [courseRes, bankRes] = await Promise.all([
          api.get('/courses'),
          api.get('/payments/bank-details')
        ]);
        if (courseRes.data.success && Array.isArray(courseRes.data.courses) && courseRes.data.courses.length > 0) {
          const initialById = new Map(INITIAL_COURSES.map(ic => [ic.id, ic]));
          const initialBySlug = new Map(INITIAL_COURSES.map(ic => [ic.slug, ic]));
          const loaded = courseRes.data.courses
            .filter(c => !c.slug?.includes('ielts') && !c.title?.toLowerCase().includes('ielts'))
            .map(c => {
              const fallbackMeta = initialById.get(c.id) || initialBySlug.get(c.slug) || {};
              return {
                ...fallbackMeta,
                ...c,
                discount_from: c.discount_from ?? fallbackMeta.discount_from,
                hourly_rate: c.hourly_rate ?? fallbackMeta.hourly_rate,
                hourly_note: c.hourly_note ?? fallbackMeta.hourly_note
              };
            });

          if (loaded.length > 0) {
            setCourses(loaded);
            setFormData(prev => {
              const activeCourse = loaded.find(c => c.id === prev.course_id) || loaded.find(c => c.slug?.includes('gcse')) || loaded[0];
              return {
                ...prev,
                course_id: activeCourse?.id || prev.course_id,
                amount: Number(activeCourse?.price || 299).toFixed(2)
              };
            });
          }
        }
        if (bankRes.data.success && bankRes.data.bankDetails) {
          setBankDetails(bankRes.data.bankDetails);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };

    fetchCoursesAndBank();
  }, []);

  // When selected course changes, update subjects & pricing dynamically
  const handleCourseChange = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const slug = (course.slug || '').toLowerCase();
    const titleLower = (course.title || '').toLowerCase();
    const isSoftware = slug.includes('software') || titleLower.includes('software development') || titleLower.includes('coding');
    const isGraphics = slug.includes('graphics') || titleLower.includes('graphics design');
    const isKs2 = slug.includes('ks2') || titleLower.includes('key stage 2') || titleLower.includes('ks2');

    if (isSoftware) {
      const isBackend = softwareTrack.toLowerCase().includes('backend');
      setSelectedSubjects(isBackend ? SOFTWARE_BACKEND_SUBJECTS : SOFTWARE_FRONTEND_SUBJECTS);
      setFormData(prev => ({
        ...prev,
        course_id: courseId,
        student_grade: 'Tech & Coding Track',
        amount: Number(course.price || 340).toFixed(2)
      }));
      setExamBoard('Industry_Cert');
    } else if (isGraphics) {
      setSelectedSubjects(GRAPHICS_DESIGN_SUBJECTS);
      setFormData(prev => ({
        ...prev,
        course_id: courseId,
        student_grade: 'Creative / Digital Arts',
        amount: Number(course.price || 200).toFixed(2)
      }));
      setExamBoard('Industry_Cert');
    } else if (isKs2) {
      setSelectedSubjects(KS2_SUBJECTS);
      setFormData(prev => ({ ...prev, course_id: courseId, student_grade: 'KS2 (Year 3–6)', amount: Number(course.price || 149).toFixed(2) }));
      setExamBoard('Primary_SATs');
    } else if (slug.includes('gcse') || titleLower.includes('gcse')) {
      setSelectedSubjects(GCSE_CORE_SUBJECTS);
      setFormData(prev => ({ ...prev, course_id: courseId, student_grade: 'Year 11 (GCSE)', amount: Number(course.price || 299).toFixed(2) }));
      setExamBoard('AQA');
    } else if (slug.includes('a-level') || titleLower.includes('a-level')) {
      setSelectedSubjects(['Mathematics', 'Chemistry', 'Physics']);
      setFormData(prev => ({ ...prev, course_id: courseId, student_grade: 'Year 12 (A-Level)', amount: Number(course.price || 320).toFixed(2) }));
      setExamBoard('AQA');
    } else if (slug.includes('canada') || titleLower.includes('canada')) {
      setSelectedSubjects(['Advanced Functions (MHF4U)', 'Calculus & Vectors (MCV4U)', 'Chemistry Grade 12 (SCH4U)']);
      setFormData(prev => ({ ...prev, course_id: courseId, student_grade: 'Canada Grade 11–12', amount: Number(course.price || 320).toFixed(2) }));
      setExamBoard('Canada_Provincial');
    } else if (slug.includes('us') || titleLower.includes('us high school') || titleLower.includes('ap mastery')) {
      setSelectedSubjects(['AP Calculus AB / BC', 'AP Chemistry', 'AP Physics 1 / C']);
      setFormData(prev => ({ ...prev, course_id: courseId, student_grade: 'US High School / AP', amount: Number(course.price || 320).toFixed(2) }));
      setExamBoard('AP_US');
    } else if (slug.includes('ks3') || titleLower.includes('ks3') || titleLower.includes('key stage 3')) {
      setSelectedSubjects(KS3_SUBJECTS);
      setFormData(prev => ({ ...prev, course_id: courseId, student_grade: 'Year 8 (KS3)', amount: Number(course.price || 249).toFixed(2) }));
      setExamBoard('AQA');
    } else {
      // Custom course created by administrator
      setSelectedSubjects([course.title]);
      setFormData(prev => ({
        ...prev,
        course_id: courseId,
        student_grade: course.level || 'Academic Program',
        amount: Number(course.price || 299).toFixed(2)
      }));
      setExamBoard('AQA');
    }
  };

  const handleSoftwareTrackChange = (trackName) => {
    setSoftwareTrack(trackName);
    const isBackend = trackName.toLowerCase().includes('backend');
    setSelectedSubjects(isBackend ? SOFTWARE_BACKEND_SUBJECTS : SOFTWARE_FRONTEND_SUBJECTS);
    setFormData(prev => ({
      ...prev,
      amount: '340.00'
    }));
  };

  // Toggle subject selection for GCSE (exceptions) or A-Level (3-subject picker)
  const toggleSubject = (subjectName, isAlevel = false) => {
    if (isAlevel) {
      if (selectedSubjects.includes(subjectName)) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== subjectName));
      } else {
        if (selectedSubjects.length >= 3) {
          setError('A-Level programs are structured around 3 core subjects. Please uncheck one subject before selecting another.');
          setTimeout(() => setError(''), 4000);
          return;
        }
        setSelectedSubjects([...selectedSubjects, subjectName]);
      }
    } else {
      // GCSE: Can opt out of any subject
      if (selectedSubjects.includes(subjectName)) {
        if (selectedSubjects.length <= 1) {
          setError('Please keep at least 1 subject selected for your GCSE curriculum package.');
          setTimeout(() => setError(''), 4000);
          return;
        }
        setSelectedSubjects(selectedSubjects.filter(s => s !== subjectName));
      } else {
        setSelectedSubjects([...selectedSubjects, subjectName]);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const currentCourse = courses.find(c => c.id === formData.course_id) || courses[0];
  const currSlug = (currentCourse?.slug || '').toLowerCase();
  const currTitle = (currentCourse?.title || '').toLowerCase();
  const isSoftwareCourse = currSlug.includes('software') || currTitle.includes('software development') || currTitle.includes('coding');
  const isGraphicsCourse = currSlug.includes('graphics') || currTitle.includes('graphics design');
  const isKs2Course = (currSlug.includes('ks2') || currTitle.includes('key stage 2') || currTitle.includes('ks2')) && !isSoftwareCourse && !isGraphicsCourse;
  const isGcseCourse = (currTitle.includes('gcse') || currSlug.includes('gcse')) && !isSoftwareCourse && !isGraphicsCourse;
  const isAlevelCourse = (currTitle.includes('a-level') || currSlug.includes('a-level')) && !isSoftwareCourse && !isGraphicsCourse;
  const isCanadaCourse = (currTitle.includes('canada') || currSlug.includes('canada')) && !isSoftwareCourse && !isGraphicsCourse;
  const isUsCourse = (currTitle.includes('us high school') || currSlug.includes('us') || currTitle.includes('ap mastery')) && !isSoftwareCourse && !isGraphicsCourse;
  const isKs3Course = (currTitle.includes('ks3') || currSlug.includes('ks3') || currTitle.includes('key stage 3')) && !isSoftwareCourse && !isGraphicsCourse;
  const isCustomCourse = !isKs2Course && !isGcseCourse && !isAlevelCourse && !isCanadaCourse && !isUsCourse && !isKs3Course && !isSoftwareCourse && !isGraphicsCourse;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations with immediate SweetAlert2 modal feedback for mobile & desktop
    if (!formData.student_name || !formData.student_email || !formData.student_password) {
      const msg = 'Please enter student full name, email, and password.';
      setError(msg);
      showWarning('Student Details Incomplete', msg);
      return;
    }

    if (!formData.parent_name || !formData.parent_email || !formData.parent_password) {
      const msg = 'Please enter parent/guardian full name, email, and password.';
      setError(msg);
      showWarning('Parent Details Incomplete', msg);
      return;
    }

    if (formData.student_email.toLowerCase() === formData.parent_email.toLowerCase()) {
      const msg = 'Student and Parent must use different email addresses for separate dashboard accounts.';
      setError(msg);
      showWarning('Duplicate Email Address', msg);
      return;
    }

    if (formData.student_password !== formData.student_confirm_password) {
      const msg = 'The student password and confirm password do not match. Please verify both fields.';
      setError(msg);
      showWarning('Password Mismatch (Student)', msg);
      return;
    }

    if (formData.parent_password !== formData.parent_confirm_password) {
      const msg = 'The parent password and confirm password do not match. Please verify both fields.';
      setError(msg);
      showWarning('Password Mismatch (Parent)', msg);
      return;
    }

    if (uploadingProof) {
      showWarning('Upload in Progress', 'Please wait for your payment receipt slip to finish uploading before submitting.');
      return;
    }

    if (!formData.payment_proof_url) {
      showWarning('Payment Proof Slip Required', 'Please attach your bank transfer receipt or payment confirmation slip (Image or PDF) to complete registration.');
      return;
    }

    if (formData.student_password.length < 6 || formData.parent_password.length < 6) {
      const msg = 'Passwords must be at least 6 characters in length.';
      setError(msg);
      showWarning('Password Too Short', msg);
      return;
    }

    if (isAlevelCourse && selectedSubjects.length !== 3) {
      const msg = `Please select exactly 3 A-Level subjects for this program (currently selected: ${selectedSubjects.length}).`;
      setError(msg);
      showWarning('Subject Selection', msg);
      return;
    }

    if (selectedSubjects.length === 0) {
      const msg = 'Please select at least one subject for enrollment.';
      setError(msg);
      showWarning('Subject Selection', msg);
      return;
    }

    if (!formData.bank_reference.trim()) {
      const msg = 'Please enter your Bank Wire / Transfer Reference Number or Transaction ID.';
      setError(msg);
      showWarning('Bank Reference Missing', msg);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        student: {
          full_name: formData.student_name,
          email: formData.student_email,
          password: formData.student_password,
          phone: formData.student_phone,
          grade: `${formData.student_grade} (${examBoard})`
        },
        parent: {
          full_name: formData.parent_name,
          email: formData.parent_email,
          password: formData.parent_password,
          phone: formData.parent_phone,
          relationship: formData.parent_relationship
        },
        course_id: formData.course_id,
        course_track: isSoftwareCourse ? softwareTrack : (isGraphicsCourse ? 'Graphics Design' : null),
        selected_subjects: selectedSubjects,
        exam_board: examBoard,
        custom_exception_note: customExceptionNote,
        bank_reference: formData.bank_reference,
        payment_proof_url: formData.payment_proof_url,
        amount: formData.amount,
        currency: 'GBP'
      };

      const res = await registerJoint(payload);
      
      // Prominent SweetAlert modal with clear confirmation before showing the pending verification receipt
      await showSuccess(
        'Registration Submitted Successfully!',
        'Thank you! Your registration and monthly tuition payment proof have been received. Our administration team is reviewing your receipt and will activate your student and parent portals shortly.'
      );
      setSuccessData(res.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const isNetErr = err.message === 'Network Error' || err.code === 'ERR_NETWORK' || !err.response;
      if (isNetErr) {
        showNetworkError({
          title: 'Connection Timed Out',
          text: 'We detected an intermittent internet connection. Your data is preserved safely. Tap Retry Now to submit again.',
          onRetry: () => handleSubmit(e)
        });
      } else {
        const errorText = err.response?.data?.message || err.message || 'Joint registration failed. Please try again.';
        setError(errorText);
        showError('Registration Error', errorText);
      }
    } finally {
      setLoading(false);
    }
  };

  // If successfully submitted, show the locked pending status view
  if (successData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Master Logo Header on Proof Container */}
        <div className="bg-white rounded-3xl border border-[#050167]/15 shadow-xl shadow-[#050167]/5 overflow-hidden mb-8">
          <div className="w-full bg-gradient-to-b from-[#f0faff] to-slate-50 border-b border-[#050167]/10 px-6 py-6 sm:py-7 flex items-center justify-center rounded-t-3xl">
            <Link to="/" className="inline-block group">
              <img 
                src="/logo.png" 
                alt="Beacon Bridge Academics" 
                className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#050167]/15 shadow-xl text-center">
          
          <div className="w-20 h-20 rounded-3xl bg-[#f0faff] border border-[#050167]/20 text-[#050167] mx-auto flex items-center justify-center mb-6">
            <Clock className="w-10 h-10 animate-pulse text-[#050167]" />
          </div>

          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#050167] text-[#40ffa7] border border-[#40ffa7]/30 mb-3">
            Status: Pending Admin Payment Verification
          </span>

          <h2 className="text-3xl font-extrabold text-[#001f3f] tracking-tight">
            Registration & Payment Proof Submitted!
          </h2>

          <p className="mt-4 text-base text-[#001f3f]/80 max-w-xl mx-auto">
            Both the <strong className="text-[#050167]">Student</strong> and <strong className="text-[#050167]">Parent</strong> profiles have been created. 
            However, following institutional security policy, <strong className="text-[#001f3f]">neither account can log in until an administrator verifies your payment proof</strong>.
          </p>

          <div className="mt-8 p-6 rounded-2xl bg-[#f0faff] border border-[#050167]/15 text-left space-y-3">
            <h4 className="text-sm font-bold text-[#050167] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#050167]" />
              Registration & Payment Details (£ GBP)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#001f3f]/80">
              <div>
                <span className="text-[#001f3f]/60 block">Student Account Email:</span>
                <span className="font-semibold text-[#001f3f]">{formData.student_email}</span>
              </div>
              <div>
                <span className="text-[#001f3f]/60 block">Parent Account Email:</span>
                <span className="font-semibold text-[#001f3f]">{formData.parent_email}</span>
              </div>
              <div>
                <span className="text-[#001f3f]/60 block">Enrolled Program / Course:</span>
                <span className="font-bold text-[#050167]">
                  {currentCourse?.title || 'Course Package'} {isSoftwareCourse ? `(${softwareTrack})` : ''}
                </span>
              </div>
              <div>
                <span className="text-[#001f3f]/60 block">Target Curriculum / Specification:</span>
                <span className="font-semibold text-[#050167]">{examBoard}</span>
              </div>
              <div>
                <span className="text-[#001f3f]/60 block">Bank Wire Reference:</span>
                <span className="font-semibold text-[#050167]">{formData.bank_reference}</span>
              </div>
              <div>
                <span className="text-[#001f3f]/60 block">Monthly Tuition Amount:</span>
                <span className="font-black text-[#050167] text-sm">£{formData.amount} GBP / month</span>
              </div>
              {isSoftwareCourse && (
                <div className="sm:col-span-2 p-2.5 rounded-xl bg-white border border-[#050167]/20 flex items-center justify-between">
                  <span className="font-bold text-[#001f3f]">Coding Track Selected:</span>
                  <span className="px-3 py-1 rounded-lg bg-[#050167] text-[#40ffa7] font-extrabold text-xs">
                    {softwareTrack} (£{formData.amount}/month)
                  </span>
                </div>
              )}
              <div className="sm:col-span-2 pt-2 border-t border-[#050167]/10">
                <span className="text-[#001f3f]/60 block mb-1">Enrolled Subject Package:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubjects.map((sub, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-[#050167]/20 font-bold text-[#050167] text-[11px]">
                      ✓ {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#f0faff] border border-[#050167]/25 text-[#001f3f] text-xs text-left leading-relaxed">
            <strong className="text-[#050167]">Important Login Notice:</strong> Attempting to sign in with either account will display 
            <em> "Pending Admin Payment Verification"</em> until an administrator clicks <strong>Verify Payment</strong> inside the Super Administrator portal. 
            Once verified, both portals will be fully unlocked automatically.
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-bold text-sm transition-all shadow-md shadow-[#40ffa7]/30"
            >
              Go to Login Page
            </Link>
            <Link
              to="/"
              style={{ backgroundColor: '#001f3f', color: '#ffffff' }}
              className="px-6 py-3 rounded-xl bg-[#001f3f] hover:bg-[#050167] text-white font-bold text-sm transition-all shadow-md"
            >
              Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title="Register with Us | Student & Parent Portal | Beacon Bridge Academics"
        description="Complete joint parent-student registration for KS2, KS3, GCSE, UK A-Level, Canada Grade 11–12, Coding (Software Development), and Graphics Design."
        canonicalPath="/register"
      />
      
      {/* Master Registration Container Header */}
      <div className="bg-white rounded-3xl border border-[#050167]/15 shadow-xl shadow-[#050167]/5 overflow-hidden mb-10">
        <div className="w-full bg-gradient-to-b from-[#f0faff] to-slate-50 border-b border-[#050167]/10 px-6 py-6 sm:py-7 flex items-center justify-center rounded-t-3xl">
          <Link to="/" className="inline-block group">
            <img 
              src="/logo.png" 
              alt="Beacon Bridge Academics" 
              className="h-16 sm:h-20 w-auto max-w-[280px] sm:max-w-xs object-contain transition-transform group-hover:scale-105" 
            />
          </Link>
        </div>
        <div className="p-6 sm:p-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/10 text-[#050167] text-xs font-bold mb-3 border border-[#050167]/20">
            <GraduationCap className="w-4 h-4 text-[#050167]" />
            <span>Unified Student & Parent Registration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#001f3f] tracking-tight">
            Join Beacon Bridge Academics
          </h1>
          <p className="mt-2 text-[#001f3f]/75 text-xs sm:text-sm">
            Complete the joint registration below. Both parent and student accounts are created simultaneously and unlocked upon administrator payment verification.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 text-sm max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Registration Issue:</span>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Section 1: Student Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 shadow-sm">
          <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-[#050167]/10">
            <div className="w-10 h-10 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#001f3f]">Student Account Information</h3>
              <p className="text-xs text-[#001f3f]/60">Student will use these credentials to log in, attend live classes, and submit coursework.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Student Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#050167]/50">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="student_name"
                  required
                  value={formData.student_name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Student Email Address *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#050167]/50">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="student_email"
                  required
                  value={formData.student_email}
                  onChange={handleChange}
                  placeholder="alex.morgan@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Student Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#050167]/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showStudentPass ? 'text' : 'password'}
                  name="student_password"
                  required
                  value={formData.student_password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowStudentPass(!showStudentPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#050167]/60 hover:text-[#050167]"
                >
                  {showStudentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Confirm Student Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#050167]/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showStudentPass ? 'text' : 'password'}
                  name="student_confirm_password"
                  required
                  value={formData.student_confirm_password}
                  onChange={handleChange}
                  placeholder="Re-enter student password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Student Year / Grade Level</label>
              <select
                name="student_grade"
                value={formData.student_grade}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
              >
                <option value="KS2 (Year 3–6)">Primary / KS2 (Year 3–6)</option>
                <option value="Year 8 (KS3)">Key Stage 3 (Year 7–9)</option>
                <option value="Year 11 (GCSE)">GCSE / IGCSE (Year 10–11)</option>
                <option value="Year 12 (A-Level)">UK A-Level / Sixth Form (Year 12–13)</option>
                <option value="Canada Grade 11–12">Canada High School (Grade 11–12)</option>
                <option value="US High School / AP">US High School / AP</option>
                <option value="Tech & Coding Track">Coding (Software Development)</option>
                <option value="Creative / Digital Arts">Graphics Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Student Contact Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#050167]/50">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="student_phone"
                  value={formData.student_phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Parent / Guardian Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 shadow-sm">
          <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-[#050167]/10">
            <div className="w-10 h-10 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#001f3f]">Parent / Guardian Information</h3>
              <p className="text-xs text-[#001f3f]/60">Parent will have a linked dashboard to monitor grades, attendance, and assignment alerts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Parent Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#050167]/50">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="parent_name"
                  required
                  value={formData.parent_name}
                  onChange={handleChange}
                  placeholder="e.g. David Morgan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Parent Email Address * (Used for login & alerts)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#050167]/50">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="parent_email"
                  required
                  value={formData.parent_email}
                  onChange={handleChange}
                  placeholder="david.morgan@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Parent Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#050167]/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showParentPass ? 'text' : 'password'}
                  name="parent_password"
                  required
                  value={formData.parent_password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowParentPass(!showParentPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#050167]/60 hover:text-[#050167]"
                >
                  {showParentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Confirm Parent Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#050167]/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showParentPass ? 'text' : 'password'}
                  name="parent_confirm_password"
                  required
                  value={formData.parent_confirm_password}
                  onChange={handleChange}
                  placeholder="Re-enter parent password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Relationship to Student</label>
              <select
                name="parent_relationship"
                value={formData.parent_relationship}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Legal Guardian">Legal Guardian</option>
                <option value="Sponsor">Sponsor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Parent Contact Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#050167]/50">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="parent_phone"
                  value={formData.parent_phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Program & Subject Selection */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#050167]/10">
            <div className="w-10 h-10 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#001f3f]">Program & Subject Package Selection</h3>
              <p className="text-xs text-[#001f3f]/60">Select your student's curriculum track, customize subjects or opt-out exceptions, and specify their target exam board.</p>
            </div>
          </div>

          {/* Dedicated IELTS Candidate Registration Redirect Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#050167] via-[#001f3f] to-[#050167] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#40ffa7]/40 shadow-md">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#40ffa7]/20 border border-[#40ffa7]/40 text-[#40ffa7] flex items-center justify-center shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#40ffa7] text-[#001f3f]">
                    Separate Candidate Portal
                  </span>
                  <span className="text-[11px] line-through text-slate-300">Was £1,250/month</span>
                  <span className="text-[11px] font-black text-[#40ffa7]">£1,000/month</span>
                </div>
                <h4 className="text-sm font-extrabold text-white">
                  Applying for IELTS Academic or UKVI Exam Preparation?
                </h4>
                <p className="text-xs text-[#f0faff]/80">
                  IELTS candidates use a dedicated registration form and get their own Student Virtual Classroom Dashboard without parent credentials.
                </p>
              </div>
            </div>
            <Link
              to="/ielts-registration"
              className="px-4 py-2.5 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-xs whitespace-nowrap inline-flex items-center justify-center gap-1.5 shadow-lg transition-all shrink-0"
            >
              <span>Go to IELTS Registration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Program / Course Selector */}
          <div>
            <label className="block text-xs font-bold text-[#001f3f] mb-2 flex items-center justify-between">
              <span>Select Academic Program *</span>
              <span className="text-xs font-semibold text-[#050167]">Tuition in British Pounds (£ GBP / month)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {courses.map(c => {
                const isSelected = formData.course_id === c.id;
                const priceNum = Number(c.price || 299);
                const discountFromNum = Number(c.discount_from || Math.round(priceNum * 1.25));
                const savings = Math.max(0, Math.round(discountFromNum - priceNum));
                const hourlyLabel = getHourlyLabelForCourse(c);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCourseChange(c.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#f0faff] border-[#050167] ring-2 ring-[#40ffa7] shadow-md'
                        : 'bg-white border-[#050167]/15 hover:border-[#050167]/40 hover:bg-[#f0faff]/30'
                    }`}
                  >
                    <div>
                      {/* Discount Banner on TOP of each program card */}
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#050167]/10">
                        <span className="text-[10px] font-bold line-through text-slate-400">
                          Was £{discountFromNum.toFixed(0)}/month
                        </span>
                        {savings > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                            Save £{savings}/mo
                          </span>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#050167]">
                          {c.level || 'All Levels'}
                        </span>
                        <span className="font-black text-[#001f3f] text-sm whitespace-nowrap">
                          £{priceNum.toFixed(0)}/month
                        </span>
                      </div>

                      {hourlyLabel && (
                        <div className="mb-1.5">
                          <span className="inline-block text-[10px] font-extrabold text-[#050167] bg-[#40ffa7]/25 border border-[#40ffa7]/50 px-2 py-0.5 rounded-md">
                            Hourly option: {hourlyLabel}
                          </span>
                        </div>
                      )}

                      <h4 className="font-bold text-sm text-[#001f3f] leading-snug line-clamp-2 mb-1">
                        {c.title}
                      </h4>
                      <p className="text-[11px] text-[#001f3f]/70 line-clamp-2">
                        {c.description}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Selected Program
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Subject Selection & Exceptions */}
          <div className="p-5 rounded-2xl bg-[#f0faff] border border-[#050167]/15 space-y-4">
            
            {/* Case A: GCSE Core Bundle (with Exception / Opt-Out capability) */}
            {isGcseCourse && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#050167]/10 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#001f3f] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#050167]" />
                      GCSE Core Subjects (5 Core Combination)
                    </h4>
                    <p className="text-xs text-[#001f3f]/70 mt-0.5">
                      All 5 core subjects are bundled by default. <strong>Uncheck any subject if your child does not wish to take it</strong> (exception support).
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap self-start sm:self-auto ${
                    selectedSubjects.length === 5 
                      ? 'bg-[#40ffa7]/25 text-[#001f3f] border border-[#40ffa7]/50'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {selectedSubjects.length === 5 
                      ? '✓ Full 5-Subject Bundle Active' 
                      : `Custom Package (${selectedSubjects.length} of 5 selected)`}
                  </span>
                </div>

                {/* 5 GCSE Subject Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {GCSE_CORE_SUBJECTS.map((sub, idx) => {
                    const isChecked = selectedSubjects.includes(sub);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleSubject(sub, false)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-white border-[#050167] text-[#001f3f] font-bold shadow-sm'
                            : 'bg-slate-50/60 border-slate-200 text-slate-400 line-through opacity-70'
                        }`}
                      >
                        <span className="text-xs">{sub}</span>
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-[#050167] shrink-0" />
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-normal no-underline">
                            Opted Out
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Exception Notes for GCSE */}
                <div className="mt-4 pt-3 border-t border-[#050167]/10">
                  <button
                    type="button"
                    onClick={() => setHasSubjectException(!hasSubjectException)}
                    className="text-xs font-bold text-[#050167] hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#050167]" />
                    <span>{hasSubjectException ? '− Close Subject Exception Note' : '+ Have a specific subject exception or focus request?'}</span>
                  </button>

                  {hasSubjectException && (
                    <div className="mt-2.5">
                      <input
                        type="text"
                        value={customExceptionNote}
                        onChange={(e) => setCustomExceptionNote(e.target.value)}
                        placeholder="e.g. Student needs extra help in Maths algebra only; opt out of Biology if full."
                        className="w-full px-3.5 py-2 rounded-xl border border-[#050167]/20 text-xs bg-white text-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#40ffa7]"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Case B: UK A-Level (Pick 3 Subjects) */}
            {currentCourse?.slug?.includes('a-level') && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#050167]/10 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#001f3f] flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#050167]" />
                      UK A-Level Subject Selection (Pick Exactly 3 Subjects)
                    </h4>
                    <p className="text-xs text-[#001f3f]/70 mt-0.5">
                      Select the 3 A-Level subjects your child will study for intensive exam board coaching.
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap self-start sm:self-auto ${
                    selectedSubjects.length === 3 
                      ? 'bg-[#40ffa7] text-[#001f3f]' 
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {selectedSubjects.length === 3 
                      ? '✓ 3 of 3 Subjects Selected (Ready)' 
                      : `${selectedSubjects.length} of 3 Selected (Pick ${3 - selectedSubjects.length} more)`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {UK_ALEVEL_SUBJECTS.map((sub, idx) => {
                    const isSelected = selectedSubjects.includes(sub);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleSubject(sub, true)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-white border-[#050167] text-[#050167] shadow-sm ring-1 ring-[#050167]'
                            : 'bg-white/60 border-slate-200 text-slate-600 hover:border-[#050167]/40'
                        }`}
                      >
                        <span className="truncate pr-1">{sub}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#050167] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Case C: Canada Senior Secondary Grade 11/12 & AP (Pick 3 Courses) */}
            {currentCourse?.slug?.includes('canada') && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#050167]/10 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#001f3f] flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#050167]" />
                      Canada Senior Secondary & AP Courses (Pick Exactly 3)
                    </h4>
                    <p className="text-xs text-[#001f3f]/70 mt-0.5">
                      Aligned with Ontario (OSSD) and provincial curriculum codes for university admissions.
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap self-start sm:self-auto ${
                    selectedSubjects.length === 3 
                      ? 'bg-[#40ffa7] text-[#001f3f]' 
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {selectedSubjects.length === 3 
                      ? '✓ 3 of 3 Courses Selected' 
                      : `${selectedSubjects.length} of 3 Selected`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {CANADA_SUBJECTS.map((sub, idx) => {
                    const isSelected = selectedSubjects.includes(sub);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleSubject(sub, true)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-white border-[#050167] text-[#050167] shadow-sm ring-1 ring-[#050167]'
                            : 'bg-white/60 border-slate-200 text-slate-600 hover:border-[#050167]/40'
                        }`}
                      >
                        <span className="truncate pr-1">{sub}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#050167] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Case D: US High School Advanced & AP (Pick 3 Courses) */}
            {currentCourse?.slug?.includes('us') && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#050167]/10 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#001f3f] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#050167]" />
                      US Advanced Placement (AP) Subjects (Pick Exactly 3)
                    </h4>
                    <p className="text-xs text-[#001f3f]/70 mt-0.5">
                      College Board AP exam coaching and high school transcript acceleration.
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap self-start sm:self-auto ${
                    selectedSubjects.length === 3 
                      ? 'bg-[#40ffa7] text-[#001f3f]' 
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {selectedSubjects.length === 3 
                      ? '✓ 3 of 3 APs Selected' 
                      : `${selectedSubjects.length} of 3 Selected`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {US_AP_SUBJECTS.map((sub, idx) => {
                    const isSelected = selectedSubjects.includes(sub);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleSubject(sub, true)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-white border-[#050167] text-[#050167] shadow-sm ring-1 ring-[#050167]'
                            : 'bg-white/60 border-slate-200 text-slate-600 hover:border-[#050167]/40'
                        }`}
                      >
                        <span className="truncate pr-1">{sub}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#050167] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Case D2: Key Stage 2 Foundation & SATs (Year 3–6) — £149/month */}
            {isKs2Course && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#050167]/10 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#001f3f] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#050167]" />
                      Key Stage 2 (KS2 / Year 3–6) Primary Foundation Bundle
                    </h4>
                    <p className="text-xs text-[#001f3f]/70 mt-0.5">
                      Warm, structured numeracy, reading comprehension, writing &amp; 11+ / SATs preparation.
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#050167] text-[#40ffa7] border border-[#40ffa7]/30 whitespace-nowrap self-start sm:self-auto">
                    KS2 Primary · £149.00/month
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {KS2_SUBJECTS.map((sub, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-[#050167]/20 flex items-center justify-between text-xs font-bold text-[#001f3f]">
                      <span>{sub}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Case D3: Key Stage 3 Foundation Bridge (Year 7–9) — £249/month · £40/hr */}
            {isKs3Course && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#050167]/10 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#001f3f] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#050167]" />
                      Key Stage 3 (KS3 / Year 7–9) Core Bridge Subjects
                    </h4>
                    <p className="text-xs text-[#001f3f]/70 mt-0.5">
                      Early foundation support across Maths, English &amp; Science. Per-subject hourly option: <strong>£40/hour (Year 7–11)</strong>.
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#050167] text-[#40ffa7] border border-[#40ffa7]/30 whitespace-nowrap self-start sm:self-auto">
                    KS3 Bridge · £249.00/month
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {KS3_SUBJECTS.map((sub, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-[#050167]/20 flex items-center justify-between text-xs font-bold text-[#001f3f]">
                      <span>{sub}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Case E: CODING (SOFTWARE DEVELOPMENT) — £340/month · £35/hour */}
            {isSoftwareCourse && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#050167]/10 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#001f3f] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#050167]" />
                      Coding (Software Development) Track Selection
                    </h4>
                    <p className="text-xs text-[#001f3f]/70 mt-0.5">
                      Both <strong>Frontend Coding</strong> and <strong>Backend Coding</strong> are <strong>£340/month</strong> (or <strong>£35/hour</strong> flexible coaching).
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#050167] text-[#40ffa7] border border-[#40ffa7]/30 whitespace-nowrap self-start sm:self-auto">
                    {softwareTrack} • £{formData.amount}/month (£35/hr)
                  </span>
                </div>

                {/* Sub-track Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => handleSoftwareTrackChange('Frontend Coding')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      softwareTrack.toLowerCase().includes('frontend')
                        ? 'bg-white border-[#050167] ring-2 ring-[#40ffa7] shadow-md'
                        : 'bg-white/60 border-slate-200 hover:border-[#050167]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase text-[#050167] tracking-wider">
                        Track 1: Frontend Coding
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#40ffa7]/20 text-[#001f3f] font-black text-xs">
                        £340/month · £35/hr
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-[#001f3f] mb-1">Frontend Coding (Software Development)</h5>
                    <p className="text-xs text-[#001f3f]/70 leading-relaxed mb-3">
                      Master modern JavaScript (ES6+), React.js, Tailwind CSS, component state management, and responsive web interfaces.
                    </p>
                    <div className="text-[11px] font-bold text-[#050167] flex items-center gap-1">
                      {softwareTrack.toLowerCase().includes('frontend') ? (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Track Selected (£340/month)
                        </span>
                      ) : (
                        <span>Click to Select Track 1</span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSoftwareTrackChange('Backend Coding')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      softwareTrack.toLowerCase().includes('backend')
                        ? 'bg-white border-[#050167] ring-2 ring-[#40ffa7] shadow-md'
                        : 'bg-white/60 border-slate-200 hover:border-[#050167]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase text-[#050167] tracking-wider">
                        Track 2: Backend Coding
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#050167] text-[#40ffa7] font-black text-xs">
                        £340/month · £35/hr
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-[#001f3f] mb-1">Backend Coding (Software Development)</h5>
                    <p className="text-xs text-[#001f3f]/70 leading-relaxed mb-3">
                      Build scalable REST APIs with Node.js, Express, PostgreSQL relational modeling, MongoDB, and enterprise microservices.
                    </p>
                    <div className="text-[11px] font-bold text-[#050167] flex items-center gap-1">
                      {softwareTrack.toLowerCase().includes('backend') ? (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Track Selected (£340/month)
                        </span>
                      ) : (
                        <span>Click to Select Track 2</span>
                      )}
                    </div>
                  </button>
                </div>

                {/* Sub-track Included Curriculum Modules */}
                <div className="p-4 rounded-xl bg-white border border-[#050167]/15">
                  <span className="text-xs font-bold text-[#001f3f] block mb-2">
                    Included Modules for {softwareTrack}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#001f3f]">
                    {selectedSubjects.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-[#f0faff]/60">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Case F: GRAPHICS DESIGN (£200/month · £20/hour) */}
            {isGraphicsCourse && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#050167]/10 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#001f3f] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#050167]" />
                      Graphics Design Professional Program
                    </h4>
                    <p className="text-xs text-[#001f3f]/70 mt-0.5">
                      All-in-one comprehensive curriculum covering brand identity, typography, Figma UI/UX, and Adobe Creative Cloud.
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#050167] text-[#40ffa7] border border-[#40ffa7]/30 whitespace-nowrap self-start sm:self-auto">
                    Full Studio Course • £200.00/month (£20/hr)
                  </span>
                </div>

                {/* Included Studio Modules */}
                <div className="p-4 rounded-xl bg-white border border-[#050167]/15">
                  <span className="text-xs font-bold text-[#001f3f] block mb-2">
                    Core Design Modules (All Included):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#001f3f]">
                    {GRAPHICS_DESIGN_SUBJECTS.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-[#f0faff]/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Case H: Custom Academic Program (Admin Created) */}
            {isCustomCourse && currentCourse && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#050167]/10 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#001f3f] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#050167]" />
                      {currentCourse.title}
                    </h4>
                    <p className="text-xs text-[#001f3f]/70 mt-0.5">
                      {currentCourse.description || 'Specialist program curated by Beacon Bridge educators.'}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#050167] text-[#40ffa7] border border-[#40ffa7]/30 whitespace-nowrap self-start sm:self-auto">
                    {currentCourse.level || 'Academic Program'} • £{currentCourse.price || formData.amount} / month
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#050167]/15 space-y-3">
                  <span className="text-xs font-bold text-[#001f3f] block">
                    Curriculum & Syllabus Details:
                  </span>
                  <p className="text-xs text-[#001f3f]/80 leading-relaxed bg-[#f0faff]/60 p-3 rounded-lg border border-[#050167]/10">
                    {currentCourse.description || 'Comprehensive syllabus designed with specialist tutors for exam excellence and skill mastery.'}
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-[#001f3f] mb-1">
                      Specific Module Focus or Custom Learning Goals:
                    </label>
                    <input
                      type="text"
                      value={customExceptionNote}
                      onChange={(e) => setCustomExceptionNote(e.target.value)}
                      placeholder="e.g. Focus on core exam units, portfolio review, or target university requirements..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#050167]/20 text-xs bg-white text-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#40ffa7]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Target Exam Board Selection */}
            <div className="mt-4 pt-3 border-t border-[#050167]/10">
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">
                Target Exam Board / Curriculum Specification *
              </label>
              <select
                value={examBoard}
                onChange={(e) => setExamBoard(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#050167]/20 text-xs font-bold text-[#050167] bg-white focus:outline-none focus:ring-2 focus:ring-[#40ffa7]"
              >
                {EXAM_BOARDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#001f3f]/60 mt-1">
                Our teachers prepare mock questions and homework matching your child's exact exam board mark schemes.
              </p>
            </div>

          </div>
        </div>

        {/* Payment Proof Upload with Beneficiary & Auto-Picked Monthly Tuition Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#050167]/20 shadow-lg shadow-[#050167]/5">
          {/* Top Summary Banner: Beneficiary Bank Name & Automatically Selected Monthly Tuition Due */}
          <div className="bg-[#001f3f] text-white rounded-2xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#40ffa7]/30 shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#40ffa7] font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Beneficiary Bank Name</span>
              </div>
              <div className="font-bold text-base sm:text-lg text-white">
                {bankDetails.bank_name || 'Barclays Bank UK PLC'} &mdash; {bankDetails.account_name || 'Beacon Bridge Academics Ltd.'}
              </div>
              <p className="text-xs text-[#f0faff]/80">
                Selected Program: <strong className="text-white">{currentCourse?.title || 'Academic Program'}</strong>
                {isSoftwareCourse ? ` (${softwareTrack})` : ''}
              </p>
            </div>

            <div className="sm:text-right bg-white/10 rounded-xl px-5 py-3 border border-white/15 shrink-0">
              <span className="text-[11px] uppercase tracking-wider text-[#f0faff]/75 block font-bold">
                Monthly Tuition Due
              </span>
              <div className="text-2xl font-black text-[#40ffa7]">
                £{formData.amount} <span className="text-xs font-bold text-white">GBP / month</span>
              </div>
              {getHourlyLabelForCourse(currentCourse) && (
                <span className="text-[10px] text-[#f0faff]/80 block mt-0.5 font-semibold">
                  Or {getHourlyLabelForCourse(currentCourse)}
                </span>
              )}
            </div>
          </div>

          {/* Proof Submission Fields */}
          <div className="p-6 rounded-2xl bg-[#f0faff] border border-[#050167]/20">
            <h4 className="text-sm font-bold text-[#050167] mb-1 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#050167]" />
              Proof of Payment Submission
            </h4>
            <p className="text-xs text-[#001f3f]/70 mb-5">
              Enter your bank transfer reference number / transaction ID and upload your payment confirmation slip below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">
                  Bank Reference Number / Wire Transaction ID *
                </label>
                <input
                  type="text"
                  name="bank_reference"
                  required
                  value={formData.bank_reference}
                  onChange={handleChange}
                  placeholder="e.g. WIRE-892301 or REF-448291"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-white"
                />
                <span className="text-[11px] text-[#001f3f]/60 mt-1 block">
                  Found on your online banking transfer confirmation or bank deposit receipt.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">
                  Payment Receipt Slip / Bank Transfer Confirmation *
                </label>
                <input
                  type="file"
                  ref={proofFileInputRef}
                  onChange={handleProofFileUpload}
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                />
                <div
                  onClick={() => proofFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    formData.payment_proof_url
                      ? 'border-[#050167] bg-[#40ffa7]/10'
                      : 'border-[#050167]/30 hover:border-[#050167] bg-white hover:bg-[#f0faff]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#050167]/10 text-[#050167] flex items-center justify-center">
                    {uploadingProof ? (
                      <Upload className="w-5 h-5 animate-spin" />
                    ) : formData.payment_proof_url ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <FileUp className="w-5 h-5 text-[#050167]" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#001f3f] block">
                      {uploadingProof
                        ? 'Uploading receipt slip to server...'
                        : (proofFileName ? `Attached: ${proofFileName}` : (formData.payment_proof_url ? 'Receipt Slip Attached' : 'Click to select slip from your system'))}
                    </span>
                    <span className="text-[10px] text-[#001f3f]/60 block mt-0.5">
                      Upload bank transfer screenshot, receipt, or PDF slip (Max 30MB)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-[#050167]/10 border border-[#050167]/20 text-xs text-[#001f3f] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#050167] shrink-0 mt-0.5" />
              <span>
                <strong>Strict Verification Lockout Policy:</strong> Once you submit this form, both student and parent accounts will be created in 
                <span className="underline font-semibold ml-1">Pending Verification status</span>. Neither account can sign in until an administrator checks and confirms this proof from the Super Admin portal.
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-base shadow-xl shadow-[#40ffa7]/30 transition-all hover:shadow-[#40ffa7]/40 hover:-translate-y-0.5 disabled:opacity-50 inline-flex items-center justify-center space-x-3 cursor-pointer"
          >
            {loading ? (
              <span>Submitting Joint Registration...</span>
            ) : (
              <>
                <span>Complete Registration & Submit Payment Proof</span>
                <ArrowRight className="w-5 h-5 text-[#001f3f]" />
              </>
            )}
          </button>
          
          <p className="mt-4 text-xs text-[#001f3f]/70">
            Already registered and verified?{' '}
            <Link to="/login" className="font-bold text-[#050167] hover:underline">
              Sign In to Your Dashboard
            </Link>
          </p>
        </div>

      </form>
    </div>
  );
};
