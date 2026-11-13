import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  PhoneCall, 
  Mail, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const SafeguardingPolicyDocument = ({ compact = false }) => {
  const [expandedSections, setExpandedSections] = useState({
    commitment: true,
    dbs: true,
    codeOfConduct: true,
    reporting: true
  });

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-300/80 p-5 sm:p-6 text-slate-800 space-y-6">
      
      {/* Policy Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Policy Document &bull; Version 2.4 (2026)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Beacon Bridge Academics Safeguarding & Child Protection Policy
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Statutory compliance with UK DfE <em>Keeping Children Safe in Education (KCSIE)</em>, <em>Working Together to Safeguard Children</em>, and the <em>Children Act 1989/2004</em>.
          </p>
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Mandatory Compliance</span>
          <span className="text-xs font-mono font-bold text-slate-700">Ref: BBA-SAFEGUARD-2026-UK</span>
        </div>
      </div>

      {/* Section 1: Statement of Institutional Commitment */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => toggleSection('commitment')}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">1</span>
            Core Safeguarding Principles & Institutional Commitment
          </span>
          {expandedSections.commitment ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSections.commitment && (
          <div className="text-xs leading-relaxed text-slate-600 pl-7 space-y-2 pt-1">
            <p>
              At <strong>Beacon Bridge Academics</strong>, the welfare of every child, student, and vulnerable young person is paramount. Every student who accesses online academic tuition has an unconditional right to learn in a safe, secure, supportive, and respectful digital environment free from harm, exploitation, radicalisation, or abuse.
            </p>
            <p>
              This policy applies to all prospective and active tutors, teachers, faculty examiners, educational coordinators, and superadministrators across our United Kingdom and International operations (including students based in the UK, United States, Canada, and Australia).
            </p>
          </div>
        )}
      </div>

      {/* Section 2: Vetting & Enhanced DBS Requirements */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => toggleSection('dbs')}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">2</span>
            Enhanced DBS Checks, Barred List & Vetting Standards
          </span>
          {expandedSections.dbs ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSections.dbs && (
          <div className="text-xs leading-relaxed text-slate-600 pl-7 space-y-2 pt-1">
            <p>
              Every educator engaged by Beacon Bridge Academics must satisfy rigorous pre-employment vetting prior to delivering any tutorial lessons or interacting with students:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Enhanced DBS Check</strong>: A valid UK Enhanced Disclosure and Barring Service check including Children's Barred List verification (or verified international police certificate for non-UK residents).</li>
              <li><strong>DBS Update Service</strong>: Active registration on the DBS Update Service, allowing Beacon Bridge Academics to carry out regular status re-checks.</li>
              <li><strong>Identity & Right to Work</strong>: Verified photographic government identity documentation and right to work verification.</li>
              <li><strong>Academic & Teaching Qualifications</strong>: Direct verification of degrees, PGCE, QTS, and professional referee statements from previous educational employers.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Section 3: Safe Online Tutoring Code of Conduct */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => toggleSection('codeOfConduct')}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">3</span>
            Mandatory Code of Conduct for Live Online Tutoring
          </span>
          {expandedSections.codeOfConduct ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSections.codeOfConduct && (
          <div className="text-xs leading-relaxed text-slate-600 pl-7 space-y-2.5 pt-1">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900">
              <strong className="block text-xs font-bold mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Zero Tolerance & Platform Exclusivity
              </strong>
              All teaching sessions and communications MUST occur exclusively within the official Beacon Bridge Academics virtual classroom and messaging portal. Tutors are strictly forbidden from contacting students through personal WhatsApp, personal email, social media, Discord, or third-party meeting links.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1">Environment & Dress Code</h5>
                <p className="text-slate-600 text-[11px] leading-snug">
                  Lessons must be conducted in an appropriate, professional, neutral setting (e.g. study or office; never a bedroom). Professional attire is mandatory for both tutor and student.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1">Lesson Recordings & Transparency</h5>
                <p className="text-slate-600 text-[11px] leading-snug">
                  All live lessons are recorded and archived for child protection and quality assurance. Parents retain the absolute right to monitor or observe any live lesson at any moment.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1">Boundaries & Professionalism</h5>
                <p className="text-slate-600 text-[11px] leading-snug">
                  Tutors must maintain professional educator boundaries at all times. Inappropriate, offensive, or personal remarks, gifts, or favors are strictly grounds for immediate dismissal and police escalation.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1">Financial Integrity</h5>
                <p className="text-slate-600 text-[11px] leading-snug">
                  All tuition fees must flow exclusively through Beacon Bridge Academics official billing. Tutors must never solicit private cash, crypto, or direct bank payments from students or parents.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Reporting & Designated Safeguarding Lead (DSL) */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => toggleSection('reporting')}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">4</span>
            Reporting Disclosures, Concerns & Whistleblowing
          </span>
          {expandedSections.reporting ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSections.reporting && (
          <div className="text-xs leading-relaxed text-slate-600 pl-7 space-y-2 pt-1">
            <p>
              If a student discloses harm, abuse, neglect, self-harm, radicalisation, or if an educator observes suspicious marks, behavior, or distress:
            </p>
            <ol className="list-decimal pl-4 space-y-1">
              <li><strong>Do Not Promise Confidentiality</strong>: Reassure the student calmly that their safety matters and that you must inform the safeguarding team.</li>
              <li><strong>Listen Without Leading</strong>: Record the child's exact words without interrogation or assumptions.</li>
              <li><strong>Immediate Escalation (Within 1 Hour)</strong>: File an incident report to the Designated Safeguarding Lead (DSL).</li>
            </ol>

            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Designated Safeguarding Lead (DSL) Contact:</span>
                <span className="text-[11px] text-slate-600">Beacon Bridge Academics Safeguarding Team &bull; London, UK</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <a href="mailto:safeguarding@beaconbridgeacademics.co.uk" className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>safeguarding@beaconbridgeacademics.co.uk</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Box */}
      <div className="p-3.5 bg-brand-50/70 border border-brand-200/80 rounded-xl text-xs text-brand-950 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-brand-900 font-bold mb-0.5">Statutory Pre-Employment Requirement:</strong>
          <span>
            Every teacher and tutor must confirm their complete acceptance of this policy and provide a verified legal digital signature before their application can be approved or lessons scheduled.
          </span>
        </div>
      </div>

    </div>
  );
};
