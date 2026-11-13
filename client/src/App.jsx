import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Providers
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ScrollToTop } from './components/common/ScrollToTop';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { CurriculumPage } from './pages/public/CurriculumPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { PaymentProofPage } from './pages/public/PaymentProofPage';
import { TeacherApplicationPage } from './pages/public/TeacherApplicationPage';

// Admin Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminTutorApplications } from './pages/admin/AdminTutorApplications';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminClasses } from './pages/admin/AdminClasses';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminSettings } from './pages/admin/AdminSettings';

// Tutor Portal Pages
import { TutorDashboard } from './pages/tutor/TutorDashboard';
import { TutorAssignments } from './pages/tutor/TutorAssignments';
import { TutorCourses } from './pages/tutor/TutorCourses';
import { TutorClasses } from './pages/tutor/TutorClasses';
import { TutorMaterials } from './pages/tutor/TutorMaterials';
import { TutorAttendance } from './pages/tutor/TutorAttendance';
import { TutorRecordings } from './pages/tutor/TutorRecordings';

// Student Portal Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentCourses } from './pages/student/StudentCourses';
import { StudentClasses } from './pages/student/StudentClasses';
import { StudentMaterials } from './pages/student/StudentMaterials';
import { StudentRecordings } from './pages/student/StudentRecordings';
import { StudentAttendance } from './pages/student/StudentAttendance';

// Parent Portal Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentAssignments } from './pages/parent/ParentAssignments';
import { ParentPayments } from './pages/parent/ParentPayments';
import { ParentStudents } from './pages/parent/ParentStudents';
import { ParentAttendance } from './pages/parent/ParentAttendance';
import { ParentProgress } from './pages/parent/ParentProgress';

// Live Virtual Classroom
import { ClassroomPage } from './pages/classroom/ClassroomPage';

export const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public Pages with Consistent Navbar & Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/curriculum" element={<CurriculumPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment-proof" element={<PaymentProofPage />} />
        <Route path="/apply-to-teach" element={<TeacherApplicationPage />} />
        <Route path="/tutor/apply" element={<TeacherApplicationPage />} />
      </Route>

      {/* Live Virtual Classroom (Full Stage) */}
      <Route
        path="/classroom/:classId"
        element={
          <ProtectedRoute>
            <ClassroomPage />
          </ProtectedRoute>
        }
      />

      {/* Super Administrator Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="tutor-applications" element={<AdminTutorApplications />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Superadmin Aliases for Direct Routing */}
      <Route path="/superadmin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/superadmin/*" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Tutor Portal */}
      <Route
        path="/tutor"
        element={
          <ProtectedRoute allowedRoles={['tutor', 'superadmin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/tutor/dashboard" replace />} />
        <Route path="dashboard" element={<TutorDashboard />} />
        <Route path="assignments" element={<TutorAssignments />} />
        <Route path="courses" element={<TutorCourses />} />
        <Route path="classes" element={<TutorClasses />} />
        <Route path="materials" element={<TutorMaterials />} />
        <Route path="attendance" element={<TutorAttendance />} />
        <Route path="recordings" element={<TutorRecordings />} />
      </Route>

      {/* Student Portal */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student', 'superadmin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="classes" element={<StudentClasses />} />
        <Route path="materials" element={<StudentMaterials />} />
        <Route path="recordings" element={<StudentRecordings />} />
        <Route path="attendance" element={<StudentAttendance />} />
      </Route>

      {/* Parent Portal */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={['parent', 'superadmin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/parent/dashboard" replace />} />
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="assignments" element={<ParentAssignments />} />
        <Route path="payments" element={<ParentPayments />} />
        <Route path="students" element={<ParentStudents />} />
        <Route path="attendance" element={<ParentAttendance />} />
        <Route path="progress" element={<ParentProgress />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
};
