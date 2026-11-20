import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import { FileCheck, ShieldAlert, Clock, CreditCard, Scale, CheckCircle2 } from 'lucide-react';

export const TermsPage = () => {
  const termsSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://beaconbridgeacademics.co.uk/terms#webpage',
    'url': 'https://beaconbridgeacademics.co.uk/terms',
    'name': 'Terms and Conditions of Service | Beacon Bridge Academics',
    'description': 'Official tuition service terms, payment guidelines, 24-hour cancellation policy, and academic code of conduct.',
    'publisher': {
      '@type': 'EducationalOrganization',
      '@id': 'https://beaconbridgeacademics.co.uk/#organization',
      'name': 'Beacon Bridge Academics'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <SEO 
        title="Terms & Conditions of Service | Beacon Bridge Academics"
        description="Official terms of service for Beacon Bridge Academics. Details enrollment policies, tuition billing, 24-hour cancellation rules, and virtual classroom standards."
        canonicalPath="/terms"
        schemaJson={termsSchema}
      />

      <section className="bg-gradient-to-br from-[#001f3f] via-[#050167] to-[#001633] text-white py-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5" />
            Statutory Legal Framework
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Terms & Conditions of Academic Tuition
          </h1>
          <p className="mt-3 text-slate-200 text-sm max-w-xl mx-auto">
            Effective Date: 20 November 2026 • Governing Law: England & Wales
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm text-slate-800 leading-relaxed text-sm sm:text-base space-y-8">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#050167]" />
            1. Agreement Overview
          </h2>
          <p>
            These Terms and Conditions constitute a legally binding agreement between Beacon Bridge Academics Ltd. ("Beacon Bridge", "we", "us") and the parent, legal guardian, or adult student ("you", "Client") enrolling in academic tutoring programs or accessing our virtual classroom platform.
          </p>
          <p>
            By booking a consultation, submitting registration details, or accessing live lessons, you accept and agree to be bound by these terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#050167]" />
            2. Tuition Fees & Payment Schedule
          </h2>
          <p>
            Tuition packages (such as GCSE Core Bundles and A-Level Specialist tracks) are billed monthly or on a termly basis. In order to uphold strict payment security:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>Tuition invoices are issued directly to the registered parent or student email.</li>
            <li>Payments are processed via authorized direct UK bank transfers or designated secure invoicing.</li>
            <li>Proof of payment is reviewed by the Super Administrator before portal access and interactive classroom slots are activated.</li>
            <li>All fees are quoted in British Pounds Sterling (GBP) unless otherwise agreed in writing for international families.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#050167]" />
            3. Lesson Cancellation & Rescheduling Policy (24-Hour Notice)
          </h2>
          <p>
            To respect the preparation time and committed schedule of our curriculum specialists, our cancellation policy operates as follows:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li><strong>Notice Over 24 Hours:</strong> If you notify the platform or your assigned tutor at least 24 hours prior to the scheduled lesson start time, the session will be rescheduled at no additional cost.</li>
            <li><strong>Notice Under 24 Hours / No-Show:</strong> Cancellations made with less than 24 hours' notice, or failure to join the virtual classroom within 15 minutes of the start time, will be forfeited and charged in full.</li>
            <li><strong>Tutor Illness or Emergency:</strong> If a tutor is unable to teach due to unforeseen illness, a qualified curriculum replacement will be arranged or a makeup credit will be credited to your account.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#050167]" />
            4. Child Safeguarding & Behavioral Standards
          </h2>
          <p>
            Safety and mutual respect are foundational to Beacon Bridge Academics:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>All interactions between students and tutors must occur exclusively within our monitored virtual classroom environment.</li>
            <li>Tutors and students are strictly forbidden from sharing personal social media handles, private WhatsApp numbers, or meeting in person without explicit written authorization from Beacon Bridge Academics.</li>
            <li>Disruptive, abusive, or inappropriate behaviour on camera or in the digital whiteboard chat will result in immediate termination of the session and account review.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
            5. Intellectual Property
          </h2>
          <p>
            All proprietary curriculum materials, exam prediction banks, homework assignments, diagnostic worksheets, and platform software remain the exclusive intellectual property of Beacon Bridge Academics Ltd. Enrolled students are granted a personal, non-transferable licence for educational study only. Redistribution or commercial resale is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
            6. Governing Law & Jurisdiction
          </h2>
          <p>
            These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of <strong>England and Wales</strong>. The courts of England and Wales shall have exclusive jurisdiction.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>Beacon Bridge Academics Ltd. • Company Incorporated in England & Wales</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-[#050167] font-bold hover:underline">Privacy Policy</Link>
            <Link to="/security" className="text-[#050167] font-bold hover:underline">Security Policy</Link>
            <Link to="/contact" className="text-[#050167] font-bold hover:underline">Contact Us</Link>
          </div>
        </div>

      </main>
    </div>
  );
};
