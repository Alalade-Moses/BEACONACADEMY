import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
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
  Copy,
  Check,
  HelpCircle,
  Eye,
  EyeOff,
  BookOpen,
  Sparkles,
  Layers,
  Globe,
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
  { id: 'Industry_Cert', name: 'Industry Professional Certification & Portfolio' }
];

const INITIAL_COURSES = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    title: 'GCSE 5-Subject Core Bundle',
    slug: 'gcse-5-subject-bundle',
    description: 'Comprehensive GCSE curriculum covering Mathematics, English Language & Literature, Chemistry, Biology, and Physics. Includes opt-out exceptions.',
    level: 'GCSE (Years 10–11)',
    price: 299.00
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    title: 'UK A-Level 3-Subject Specialist Program',
    slug: 'uk-a-level-3-subject-program',
    description: 'Choose your 3 A-Level subjects from Pure & Further Maths, Sciences, Economics, English, and Computing.',
    level: 'A-Level (Years 12–13)',
    price: 349.00
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    title: 'Canada Senior Secondary & AP Program (Grade 11/12)',
    slug: 'canada-senior-secondary-program',
    description: 'Advanced Functions, Calculus & Vectors, Sciences, and English Grade 12 for university entry.',
    level: 'Canada Grade 11–12',
    price: 349.00
  },
  {
    id: '20000000-0000-0000-0000-000000000004',
    title: 'US High School Advanced & AP Mastery Program',
    slug: 'us-high-school-ap-mastery',
    description: 'AP Calculus BC, AP Chemistry, AP Physics 1/C, AP Biology, and AP English Literature.',
    level: 'US High School / AP',
    price: 349.00
  },
  {
    id: '20000000-0000-0000-0000-000000000005',
    title: 'Key Stage 3 Foundation Bridge (Years 7–9)',
    slug: 'ks3-foundation-bridge',
    description: 'Foundational curriculum bridge across KS3 Maths, English, and Combined Science.',
    level: 'KS3 (Years 7–9)',
    price: 249.00
  },
  {
    id: '20000000-0000-0000-0000-000000000006',
    title: 'SOFTWARE DEVELOPMENT',
    slug: 'software-development',
    description: 'Industry-standard Software Development program. Choose between Frontend Development (£300/mo) or Backend Development (£420/mo).',
    level: 'Professional / All Levels',
    price: 300.00
  },
  {
    id: '20000000-0000-0000-0000-000000000007',
    title: 'GRAPHICS DESIGN',
    slug: 'graphics-design',
    description: 'Comprehensive Visual & Graphic Design: Figma UI/UX prototyping, brand identity, typography, Adobe Photoshop/Illustrator, and portfolio development.',
    level: 'Professional / All Levels',
    price: 300.00
  }
];

export const RegisterPage = () => {
  const { registerJoint } = useAuth();
  const navigate = useNavigate();

  // Courses list initialized with full curriculum and technology tracks
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [bankDetails, setBankDetails] = useState({
    bank_name: 'Barclays Bank UK PLC',
    account_name: 'Beacon Bridge Academics Ltd.',
    account_number: '83920147',
    swift_code: 'BARCGB22',
    routing_code: '20-45-77',
    iban: 'GB29BARC20457783920147',
    tuition_fee: '£300.00 GBP / month',
    instructions: 'Please transfer the monthly tuition fee in British Pounds (£ GBP) using the Student Full Name and Reference Code in the wire payment description. Upload your receipt proof below.'
  });

  // Track state for Software Development (Frontend £300, Backend £420)
  const [softwareTrack, setSoftwareTrack] = useState('Frontend Development');

  // Selected subjects state
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
    course_id: '',
    bank_reference: '',
    payment_proof_url: '',
    amount: '299.00'
  });

  const proofFileInputRef = useRef(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofFileName, setProofFileName] = useState('');

  const [copiedField, setCopiedField] = useState(null);
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
      alert('Failed to upload payment proof slip: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingProof(false);
    }
  };

  useEffect(() => {
    // Fetch available courses
    const fetchCoursesAndBank = async () => {
      try {
        const [courseRes, bankRes] = await Promise.all([
          api.get('/courses'),
          api.get('/payments/bank-details')
        ]);
        if (courseRes.data.success && courseRes.data.courses.length > 0) {
          const loaded = courseRes.data.courses;
          const merged = [...loaded];
          INITIAL_COURSES.forEach(ic => {
            if (!merged.some(m => m.slug === ic.slug || m.title?.toLowerCase() === ic.title.toLowerCase())) {
              merged.push(ic);
            }
          });
          setCourses(merged);
          const firstCourse = merged[0];
          setFormData(prev => ({ 
            ...prev, 
            course_id: prev.course_id || firstCourse.id,
            amount: prev.amount || String(firstCourse.price || '299.00')
          }));
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

    const isSoftware = course.slug?.includes('software') || course.title?.toLowerCase().includes('software development');
    const isGraphics = course.slug?.includes('graphics') || course.title?.toLowerCase().includes('graphics design');

    if (isSoftware) {
      const isBackend = softwareTrack === 'Backend Development';
      setSelectedSubjects(isBackend ? SOFTWARE_BACKEND_SUBJECTS : SOFTWARE_FRONTEND_SUBJECTS);
      setFormData(prev => ({
        ...prev,
        course_id: courseId,
        student_grade: 'Professional / Tech',
        amount: isBackend ? '420.00' : '300.00'
      }));
      setExamBoard('Industry_Cert');
    } else if (isGraphics) {
      setSelectedSubjects(GRAPHICS_DESIGN_SUBJECTS);
      setFormData(prev => ({
        ...prev,
        course_id: courseId,
        student_grade: 'Creative / Digital Arts',
        amount: '300.00'
      }));
      setExamBoard('Industry_Cert');
    } else if (course.slug?.includes('gcse') || course.title?.toLowerCase().includes('gcse')) {
      setSelectedSubjects(GCSE_CORE_SUBJECTS);
      setFormData(prev => ({ ...prev, course_id: courseId, student_grade: 'Year 11 (GCSE)', amount: String(course.price || '299.00') }));
      setExamBoard('AQA');
    } else if (course.slug?.includes('a-level') || course.title?.toLowerCase().includes('a-level')) {
      setSelectedSubjects(['Mathematics', 'Chemistry', 'Physics']);
      setFormData(prev => ({ ...prev, course_id: courseId, student_grade: 'Year 12 (A-Level)', amount: String(course.price || '349.00') }));
      setExamBoard('AQA');
    } else if (course.slug?.includes('canada') || course.title?.toLowerCase().includes('canada')) {
      setSelectedSubjects(['Advanced Functions (MHF4U)', 'Calculus & Vectors (MCV4U)', 'Chemistry Grade 12 (SCH4U)']);
      setFormData(prev => ({ ...prev, course_id: courseId, student_grade: 'Canada Grade 12', amount: String(course.price || '349.00') }));
      setExamBoard('Canada_Provincial');
    } else if (course.slug?.includes('us') || course.title?.toLowerCase().includes('us')) {
      setSelectedSubjects(['AP Calculus AB / BC', 'AP Chemistry', 'AP Physics 1 / C']);
      setFormData(prev => ({ ...prev, course_id: courseId, student_grade: 'US Grade 11/12 (AP)', amount: String(course.price || '349.00') }));
      setExamBoard('AP_US');
    } else {
      setSelectedSubjects(KS3_SUBJECTS);
      setFormData(prev => ({ ...prev, course_id: courseId, student_grade: 'Year 8 (KS3)', amount: String(course.price || '249.00') }));
      setExamBoard('AQA');
    }
  };

  const handleSoftwareTrackChange = (trackName) => {
    setSoftwareTrack(trackName);
    const isBackend = trackName === 'Backend Development';
    setSelectedSubjects(isBackend ? SOFTWARE_BACKEND_SUBJECTS : SOFTWARE_FRONTEND_SUBJECTS);
    setFormData(prev => ({
      ...prev,
      amount: isBackend ? '420.00' : '300.00'
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

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const currentCourse = courses.find(c => c.id === formData.course_id) || courses[0];
  const isSoftwareCourse = currentCourse?.slug?.includes('software') || currentCourse?.title?.toLowerCase().includes('software development');
  const isGraphicsCourse = currentCourse?.slug?.includes('graphics') || currentCourse?.title?.toLowerCase().includes('graphics design');
  const isAlevelCourse = (currentCourse?.title?.toLowerCase().includes('a-level') ||
    currentCourse?.title?.toLowerCase().includes('canada') ||
    currentCourse?.title?.toLowerCase().includes('us high school')) && !isSoftwareCourse && !isGraphicsCourse;
  const isGcseCourse = (currentCourse?.title?.toLowerCase().includes('gcse') ||
    currentCourse?.slug?.includes('gcse')) && !isSoftwareCourse && !isGraphicsCourse;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.student_name || !formData.student_email || !formData.student_password) {
      setError('Please provide student full name, email, and password.');
      return;
    }

    if (!formData.parent_name || !formData.parent_email || !formData.parent_password) {
      setError('Please provide parent/guardian full name, email, and password.');
      return;
    }

    if (formData.student_email.toLowerCase() === formData.parent_email.toLowerCase()) {
      setError('Student and Parent must have different email addresses for separate dashboard logins.');
      return;
    }

    if (formData.student_password !== formData.student_confirm_password) {
      setError('Student passwords do not match.');
      return;
    }

    if (formData.parent_password !== formData.parent_confirm_password) {
      setError('Parent passwords do not match.');
      return;
    }

    if (formData.student_password.length < 6 || formData.parent_password.length < 6) {
      setError('Passwords must be at least 6 characters in length.');
      return;
    }

    if (isAlevelCourse && selectedSubjects.length !== 3) {
      setError(`Please select exactly 3 A-Level subjects for this program (currently selected: ${selectedSubjects.length}).`);
      return;
    }

    if (selectedSubjects.length === 0) {
      setError('Please select at least one subject for enrollment.');
      return;
    }

    if (!formData.bank_reference.trim()) {
      setError('Please enter your Bank Wire / Transfer Reference Number or Transaction ID.');
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
      setSuccessData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Joint registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If successfully submitted, show the locked pending status view
  if (successData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
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
                  <span className="font-bold text-[#001f3f]">Software Track Selected:</span>
                  <span className="px-3 py-1 rounded-lg bg-[#050167] text-[#40ffa7] font-extrabold text-xs">
                    {softwareTrack} (£{formData.amount}/mo)
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
              className="px-6 py-3 rounded-xl bg-[#050167] hover:bg-[#001f3f] text-[#f0faff] font-bold text-sm transition-all"
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
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/10 text-[#050167] text-xs font-bold mb-4 border border-[#050167]/20">
          <GraduationCap className="w-4 h-4 text-[#050167]" />
          <span>Unified Student & Parent Registration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001f3f] tracking-tight">
          Join Beacon Bridge Academics
        </h1>
        <p className="mt-3 text-[#001f3f]/75 text-sm sm:text-base">
          Complete the joint registration below. Both parent and student accounts are created simultaneously and unlocked upon administrator payment verification.
        </p>
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
              <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Student Grade / Level</label>
              <select
                name="student_grade"
                value={formData.student_grade}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
              >
                <option value="Middle School (Grades 6-8)">Middle School (Grades 6-8)</option>
                <option value="High School Junior">High School Junior</option>
                <option value="High School Senior">High School Senior</option>
                <option value="Undergraduate (Year 1-2)">Undergraduate (Year 1-2)</option>
                <option value="Senior Undergraduate">Senior Undergraduate</option>
                <option value="Professional / Postgraduate">Professional / Postgraduate</option>
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

          {/* Program / Course Selector */}
          <div>
            <label className="block text-xs font-bold text-[#001f3f] mb-2 flex items-center justify-between">
              <span>Select Academic Program *</span>
              <span className="text-xs font-semibold text-[#050167]">Tuition in British Pounds (£ GBP)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {courses.map(c => {
                const isSelected = formData.course_id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCourseChange(c.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#f0faff] border-[#050167] ring-2 ring-[#40ffa7] shadow-md'
                        : 'bg-white border-[#050167]/15 hover:border-[#050167]/40 hover:bg-[#f0faff]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#050167]">
                        {c.level || 'All Levels'}
                      </span>
                      <span className="font-black text-[#001f3f] text-sm">
                        £{c.price || '299.00'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#001f3f] leading-snug line-clamp-2 mb-1">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-[#001f3f]/70 line-clamp-2">
                      {c.description}
                    </p>
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#40ffa7]" />
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

            {/* Case E: SOFTWARE DEVELOPMENT (Frontend £300/mo vs Backend £420/mo) */}
            {isSoftwareCourse && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#050167]/10 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#001f3f] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#050167]" />
                      Software Development Specialized Track Selection
                    </h4>
                    <p className="text-xs text-[#001f3f]/70 mt-0.5">
                      Choose between our comprehensive <strong>Frontend Development (£300/mo)</strong> or advanced <strong>Backend Development (£420/mo)</strong> track.
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#050167] text-[#40ffa7] border border-[#40ffa7]/30 whitespace-nowrap self-start sm:self-auto">
                    {softwareTrack} • £{formData.amount}/mo
                  </span>
                </div>

                {/* Sub-track Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => handleSoftwareTrackChange('Frontend Development')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      softwareTrack === 'Frontend Development'
                        ? 'bg-white border-[#050167] ring-2 ring-[#40ffa7] shadow-md'
                        : 'bg-white/60 border-slate-200 hover:border-[#050167]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase text-[#050167] tracking-wider">
                        Track 1: Frontend
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#40ffa7]/20 text-[#001f3f] font-black text-xs">
                        £300.00 / month
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-[#001f3f] mb-1">Frontend Web Engineering</h5>
                    <p className="text-xs text-[#001f3f]/70 leading-relaxed mb-3">
                      Master modern JavaScript (ES6+), React.js, Tailwind CSS, component state management, and responsive web user interfaces.
                    </p>
                    <div className="text-[11px] font-bold text-[#050167] flex items-center gap-1">
                      {softwareTrack === 'Frontend Development' ? (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Track Selected (£300/mo)
                        </span>
                      ) : (
                        <span>Click to Select Track 1</span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSoftwareTrackChange('Backend Development')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      softwareTrack === 'Backend Development'
                        ? 'bg-white border-[#050167] ring-2 ring-[#40ffa7] shadow-md'
                        : 'bg-white/60 border-slate-200 hover:border-[#050167]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase text-[#050167] tracking-wider">
                        Track 2: Backend
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#050167] text-[#40ffa7] font-black text-xs">
                        £420.00 / month
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-[#001f3f] mb-1">Backend & Server Architecture</h5>
                    <p className="text-xs text-[#001f3f]/70 leading-relaxed mb-3">
                      Build robust scalable REST APIs with Node.js, Express, PostgreSQL relational modeling, MongoDB, and enterprise cloud microservices.
                    </p>
                    <div className="text-[11px] font-bold text-[#050167] flex items-center gap-1">
                      {softwareTrack === 'Backend Development' ? (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Track Selected (£420/mo)
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

            {/* Case F: GRAPHICS DESIGN (No subform, £300/mo) */}
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
                    Full Studio Course • £300.00 / month
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

        {/* Section 4: Bank Account Details for Payment & Proof Submission */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#050167]/20 shadow-lg shadow-[#050167]/5">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#050167]/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#001f3f]">Institutional Bank Account & Monthly Tuition Payment (£ GBP)</h3>
                <p className="text-xs text-[#001f3f]/60">Make your wire payment in British Pounds to the account below, then input your reference & proof receipt.</p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-xs text-[#001f3f]/60 block font-semibold">Monthly Tuition Due</span>
              <span className="text-xl font-black text-[#050167]">£{formData.amount} GBP / mo</span>
            </div>
          </div>

          {/* Account Details Display Cards */}
          <div className="bg-[#001f3f] text-[#f0faff] rounded-2xl p-6 mb-8 relative overflow-hidden shadow-md border border-[#40ffa7]/20">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#40ffa7]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-[#40ffa7] text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Official UK Receiving Bank Coordinates</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#40ffa7]/20 text-[#40ffa7] border border-[#40ffa7]/30 font-bold">
                Verified UK Clearing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-xs text-[#f0faff]/60 block mb-1">Bank Institution</span>
                <div className="font-bold text-white text-base">
                  {bankDetails.bank_name || 'Barclays Bank UK PLC'}
                </div>
              </div>

              <div>
                <span className="text-xs text-[#f0faff]/60 block mb-1">Beneficiary Account Name</span>
                <div className="font-bold text-white text-base">
                  {bankDetails.account_name || 'Beacon Bridge Academics Ltd.'}
                </div>
              </div>

              <div>
                <span className="text-xs text-[#f0faff]/60 block mb-1">Account Number</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-[#40ffa7] text-lg tracking-wider">
                    {bankDetails.account_number || '83920147'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.account_number || '83920147', 'account_no')}
                    className="p-1 rounded hover:bg-[#050167] text-[#f0faff]/80 transition-colors"
                    title="Copy Account Number"
                  >
                    {copiedField === 'account_no' ? <Check className="w-4 h-4 text-[#40ffa7]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-[#f0faff]/60 block mb-1">Sort Code (UK)</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-white text-base">
                    {bankDetails.routing_code || '20-45-77'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.routing_code || '20-45-77', 'routing')}
                    className="p-1 rounded hover:bg-[#050167] text-[#f0faff]/80 transition-colors"
                  >
                    {copiedField === 'routing' ? <Check className="w-4 h-4 text-[#40ffa7]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-[#f0faff]/60 block mb-1">SWIFT / BIC Code</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-white text-base">
                    {bankDetails.swift_code || 'BARCGB22'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.swift_code || 'BARCGB22', 'swift')}
                    className="p-1 rounded hover:bg-[#050167] text-[#f0faff]/80 transition-colors"
                  >
                    {copiedField === 'swift' ? <Check className="w-4 h-4 text-[#40ffa7]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-[#f0faff]/60 block mb-1">Monthly Tuition Due</span>
                <div className="font-black text-[#40ffa7] text-xl">
                  £{formData.amount} GBP / month
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-[#f0faff]/80 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#40ffa7] shrink-0" />
              <span>{bankDetails.instructions || 'Please include your student or parent name in the wire payment description. Upload your transfer slip below.'}</span>
            </div>
          </div>

          {/* Proof Submission Fields */}
          <div className="p-6 rounded-2xl bg-[#f0faff] border border-[#050167]/20">
            <h4 className="text-sm font-bold text-[#050167] mb-1 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#050167]" />
              Proof of Payment Submission
            </h4>
            <p className="text-xs text-[#001f3f]/70 mb-5">
              Enter the bank wire transaction ID / reference number and attach your payment receipt or transfer confirmation link.
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
