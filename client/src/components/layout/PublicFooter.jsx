import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Globe, ShieldCheck, Heart } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EduLearn Global</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              An enterprise-grade Learning Management System engineered for global educational institutions, training providers, tutors, students, and parents.
            </p>
            <div className="pt-2 flex items-center space-x-4 text-slate-400">
              <span className="flex items-center gap-1.5 text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <Globe className="w-3.5 h-3.5 text-brand-400" />
                Global 99.9% Uptime
              </span>
              <span className="flex items-center gap-1.5 text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                SOC-2 & FERPA Compliant
              </span>
            </div>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs">Portals</h4>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="hover:text-white transition-colors">Super Administrator</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Tutor Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Student Hub</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Parent Monitoring</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Virtual Classroom</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs">Platform</h4>
            <ul className="space-y-2.5">
              <li><a href="/#courses" className="hover:text-white transition-colors">Course Catalog</a></li>
              <li><a href="/#virtual-classroom" className="hover:text-white transition-colors">Live Video & Slides</a></li>
              <li><a href="/#features" className="hover:text-white transition-colors">Digital Whiteboard</a></li>
              <li><a href="/#tutors" className="hover:text-white transition-colors">Faculty & Tutors</a></li>
              <li><a href="/#faq" className="hover:text-white transition-colors">Help & FAQ</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs">Contact & Support</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span>support@edulearn.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span>+1 (800) 555-0199</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span>Global Distributed Cloud (Vercel, Railway, Supabase)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} EduLearn Global LMS Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
