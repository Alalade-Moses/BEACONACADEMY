import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Providers
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Admin Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminClasses } from './pages/admin/AdminClasses';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminSettings } from './pages/admin/AdminSettings';

// Tutor Portal Pages
import { TutorDashboard } from './pages/tutor/TutorDashboard';
import { TutorCourses } from './pages/tutor/TutorCourses';
import { TutorClasses } from './pages/tutor/TutorClasses';
import { TutorMaterials } from './pages/tutor/TutorMaterials';
import { TutorAttendance } from './pages/tutor/TutorAttendance';
import { TutorRecordings } from './pages/tutor/TutorRecordings';

// Student Portal Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentCourses } from './pages/student/StudentCourses';
import { StudentClasses } from './pages/student/StudentClasses';
import { StudentMaterials } from './pages/student/StudentMaterials';
import { StudentRecordings } from './pages/student/StudentRecordings';
import { StudentAttendance } from './pages/student/StudentAttendance';

// Parent Portal Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentStudents } from './pages/parent/ParentStudents';
import { ParentAttendance } from './pages/parent/ParentAttendance';
import { ParentProgress } from './pages/parent/ParentProgress';

// Live Virtual Classroom
import { ClassroomPage } from './pages/classroom/ClassroomPage';

export const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
        <Route path="users" element={<AdminUsers />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

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
        <Route path="students" element={<ParentStudents />} />
        <Route path="attendance" element={<ParentAttendance />} />
        <Route path="progress" element={<ParentProgress />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
