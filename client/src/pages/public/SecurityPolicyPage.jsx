import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import { ShieldCheck, Lock, Server, Video, Eye, KeyRound, AlertTriangle } from 'lucide-react';

export const SecurityPolicyPage = () => {
  const securitySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://beaconbridgeacademics.co.uk/security#webpage',
    'url': 'https://beaconbridgeacademics.co.uk/security',
    'name': 'Platform Security & Safeguarding Policy | Beacon Bridge Academics',
    'description': 'Technical security protocols, encrypted classroom architecture, tutor vetting, and one-on-one payment security.',
    'publisher': {
      '@type': 'EducationalOrganization',
      '@id': 'https://beaconbridgeacademics.co.uk/#organization',
      'name': 'Beacon Bridge Academics'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <SEO 
        title="Platform Security & Safeguarding Architecture | Beacon Bridge"
        description="Comprehensive platform security standards at Beacon Bridge Academics: TLS encryption, WebRTC live audio/video security, Enhanced DBS tutor checks, and private 1-on-1 invoicing."
        canonicalPath="/security"
        schemaJson={securitySchema}
      />

      <section className="bg-gradient-to-br from-[#001f3f] via-[#050167] to-[#001633] text-white py-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5" />
            Infrastructure & Safeguarding
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Platform Security & Safeguarding Architecture
          </h1>
          <p className="mt-3 text-slate-200 text-sm max-w-xl mx-auto">
            Industry-grade encryption, statutory child safety protocols, and confidential tuition payment processing.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm text-slate-800 leading-relaxed text-sm sm:text-base space-y-8">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#40ffa7] text-emerald-600" />
            1. Child Protection & Mandatory Faculty Vetting
          </h2>
          <p>
            The safeguarding of every child in our care is our first and highest operational priority. In accordance with the UK Department for Education's statutory <em>Keeping Children Safe in Education (KCSIE)</em> framework:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li><strong>Enhanced DBS Verification:</strong> 100% of Beacon Bridge teaching staff must possess a valid, verified Enhanced Disclosure and Barring Service (DBS) certificate registered with the government Update Service.</li>
            <li><strong>Degree & Identity Verification:</strong> Tutors submit original degree transcripts and photographic government ID, verified manually by our Super Administrator before any account activation.</li>
            <li><strong>Strict In-App Boundaries:</strong> All messaging, video tuition, and whiteboard sessions take place exclusively inside our encrypted portal. Sharing personal contact details or moving off-platform is ground for immediate suspension.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#050167]" />
            2. One-on-One Private Invoicing & Payment Security
          </h2>
          <p>
            In educational tuition, security around financial transactions is paramount. Beacon Bridge Academics operates on a private, confidential one-on-one billing model:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li><strong>No Public Ledger:</strong> Student payment receipts, family financial data, and wire records are strictly segregated and private to the family and Super Administrator.</li>
            <li><strong>Direct Bank Transfers:</strong> Tuition is settled directly through verified UK clearing banks (such as Barclays) using unique student reference codes, eliminating third-party card skimming risks.</li>
            <li><strong>Automated Proof Auditing:</strong> Uploaded payment confirmation slips are processed via secure server storage, verified by administrative staff, and tied directly to course enrollments without public exposure.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Video className="w-5 h-5 text-[#050167]" />
            3. Live Virtual Classroom & WebRTC Encryption
          </h2>
          <p>
            Our interactive live classrooms utilize high-throughput WebRTC peer communication channels:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li><strong>DTLS & SRTP Encryption:</strong> Real-time audio and video streams are encrypted in transit using Datagram Transport Layer Security (DTLS) and Secure Real-time Transport Protocol (SRTP).</li>
            <li><strong>Session Authentication:</strong> Live rooms can only be entered by authenticated students, their verified parents, and their assigned subject tutor. Guest or unverified links are strictly prevented.</li>
            <li><strong>Parent Observability:</strong> Parents have direct portal access to view scheduled sessions, attendance timestamps, and tutor session summaries.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Server className="w-5 h-5 text-[#050167]" />
            4. Role-Based Access Control (RBAC) & Audit Logging
          </h2>
          <p>
            Our database architecture implements strict role boundaries (Super Administrator, Tutor, Student, Parent). Every sensitive operational action—such as user credential provisioning, payment verification, and session creation—is recorded in tamper-evident administrative audit logs.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>Report security issues: <a href="mailto:info@beaconbridgeacademics.co.uk" className="text-[#050167] font-bold underline">info@beaconbridgeacademics.co.uk</a></p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-[#050167] font-bold hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="text-[#050167] font-bold hover:underline">Terms of Service</Link>
            <Link to="/contact" className="text-[#050167] font-bold hover:underline">Contact Support</Link>
          </div>
        </div>

      </main>
    </div>
  );
};
