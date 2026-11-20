import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import { ShieldCheck, Lock, FileText, CheckCircle2, Mail, ExternalLink } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  const privacySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://beaconbridgeacademics.co.uk/privacy#webpage',
    'url': 'https://beaconbridgeacademics.co.uk/privacy',
    'name': 'Privacy Policy | Beacon Bridge Academics',
    'description': 'Statutory UK GDPR, DPA 2018, and KCSIE child protection privacy policy for Beacon Bridge Academics.',
    'publisher': {
      '@type': 'EducationalOrganization',
      '@id': 'https://beaconbridgeacademics.co.uk/#organization',
      'name': 'Beacon Bridge Academics'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <SEO 
        title="Privacy Policy & UK GDPR Compliance | Beacon Bridge Academics"
        description="Comprehensive statutory privacy policy for Beacon Bridge Academics. Details our commitment to UK GDPR, Keeping Children Safe in Education (KCSIE), and student data safety."
        canonicalPath="/privacy"
        schemaJson={privacySchema}
      />

      <section className="bg-gradient-to-br from-[#001f3f] via-[#050167] to-[#001633] text-white py-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5" />
            UK Statutory Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Privacy Policy & Data Protection
          </h1>
          <p className="mt-3 text-slate-200 text-sm max-w-xl mx-auto">
            Last Updated: 20 November 2026 • Compliant with UK GDPR, the Data Protection Act 2018, and KCSIE Safeguarding Guidelines.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm text-slate-800 leading-relaxed text-sm sm:text-base space-y-8">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#050167]" />
            1. Introduction & Data Controller
          </h2>
          <p>
            Beacon Bridge Academics Ltd. ("we", "our", or "the Platform") provides online tuition and live interactive virtual classroom services. We are dedicated to maintaining the highest standard of data privacy, child safeguarding, and transparency.
          </p>
          <p>
            For the purposes of the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018, Beacon Bridge Academics acts as the <strong>Data Controller</strong> for personal data collected through our website (<a href="https://beaconbridgeacademics.co.uk" className="text-[#050167] underline">beaconbridgeacademics.co.uk</a>) and our live educational portals.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Personal Data We Collect
          </h2>
          <p>We only collect information necessary to deliver academic mentoring, process admissions, and fulfill statutory safeguarding duties:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li><strong>For Students:</strong> Full name, academic year group, target syllabus (e.g. AQA, Edexcel GCSE, A-Level), diagnostic assessment scores, homework submissions, attendance logs, and classroom participation notes.</li>
            <li><strong>For Parents & Guardians:</strong> Full name, contact email address, emergency contact telephone number, billing correspondence, and child consent declarations.</li>
            <li><strong>For Tutors & Faculty Applicants:</strong> Full name, university qualifications, verified degree certificates, Enhanced Disclosure and Barring Service (DBS) numbers, teaching history, interview performance logs, and statutory safeguarding declarations.</li>
            <li><strong>Technical & Usage Data:</strong> IP address, device browser type, WebRTC connection logs for virtual classroom latency diagnostics, and session timestamps.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Lawful Basis for Processing
          </h2>
          <p>Under Article 6 of the UK GDPR, we process your personal information under the following legal bases:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li><strong>Contractual Necessity:</strong> Delivering scheduled tutoring sessions, providing progress reports to parents, and maintaining student accounts.</li>
            <li><strong>Legal & Safeguarding Obligation:</strong> Maintaining child protection logs in accordance with the Department for Education’s statutory guidance <em>Keeping Children Safe in Education (KCSIE)</em>.</li>
            <li><strong>Legitimate Interests:</strong> Improving curriculum efficacy, preventing fraud or platform misuse, and ensuring virtual classroom performance.</li>
            <li><strong>Consent:</strong> Where explicitly provided by parents for promotional case studies or marketing communications (which can be withdrawn at any time).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
            4. Virtual Classroom Safeguarding & Session Monitoring
          </h2>
          <p>
            To uphold rigorous UK safeguarding standards, all live virtual classroom sessions take place inside the authenticated Beacon Bridge platform. Private, unmonitored communication outside the verified portal is strictly prohibited.
          </p>
          <p>
            Interactive whiteboard recordings and lesson chat logs may be archived for quality assurance, dispute resolution, and child protection purposes. These recordings are accessible strictly to authorized administrators and the enrolled student/parent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
            5. Payment Information & Security
          </h2>
          <p>
            Beacon Bridge Academics utilizes direct, one-on-one bank transfer verification and encrypted invoice mechanisms. Sensitive payment proofs submitted via the portal are stored in protected, restricted databases accessible only by the Super Administrator and are never shared publicly or sold to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
            6. Your Statutory Rights
          </h2>
          <p>Under the UK GDPR, parents, students, and tutors have the following rights:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li><strong>Right of Access:</strong> Request a copy of the personal data held about you.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete records.</li>
            <li><strong>Right to Erasure ('Right to be Forgotten'):</strong> Request deletion of data, subject to statutory safeguarding retention rules.</li>
            <li><strong>Right to Restrict or Object:</strong> Restrict processing under specific statutory circumstances.</li>
          </ul>
          <p className="pt-2">
            To exercise any of these rights, email our Data Protection Officer at <a href="mailto:info@beaconbridgeacademics.co.uk" className="text-[#050167] font-semibold underline">info@beaconbridgeacademics.co.uk</a>.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>Beacon Bridge Academics Ltd. • Registered in England & Wales</p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-[#050167] font-bold hover:underline">Terms of Service</Link>
            <Link to="/security" className="text-[#050167] font-bold hover:underline">Security Policy</Link>
            <Link to="/contact" className="text-[#050167] font-bold hover:underline">Contact Support</Link>
          </div>
        </div>

      </main>
    </div>
  );
};
