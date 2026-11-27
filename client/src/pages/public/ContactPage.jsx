import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { SEO } from '../../components/common/SEO';
import { showSuccess, showError } from '../../utils/swal';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Calendar, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';

export const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    curriculum: 'GCSE',
    subject: 'Mathematics',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showError('Required Fields Missing', 'Please provide your name, email, and a message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/emails/contact-inquiry', form);
      showSuccess(
        'Enquiry Sent Successfully',
        res.data?.message ||
          'Thank you for contacting Beacon Bridge Academics. Your enquiry has been sent directly to info@beaconbridgeacademics.co.uk and our academic coordinator will reply within one business day.'
      );
      setForm({
        name: '',
        email: '',
        phone: '',
        curriculum: 'GCSE',
        subject: 'Mathematics',
        message: ''
      });
    } catch (err) {
      showError(
        'Could Not Send Enquiry',
        err.response?.data?.message ||
          'Unable to submit your enquiry right now. Please email info@beaconbridgeacademics.co.uk directly or reach us on WhatsApp (+44 7414 663735).'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': 'https://beaconbridgeacademics.co.uk/contact#contactpage',
    'url': 'https://beaconbridgeacademics.co.uk/contact',
    'name': 'Contact Beacon Bridge Academics',
    'description': 'Contact Beacon Bridge Academics for elite online tutoring inquiries, GCSE & A-Level admissions, and consultations.',
    'mainEntity': {
      '@type': 'EducationalOrganization',
      '@id': 'https://beaconbridgeacademics.co.uk/#organization',
      'name': 'Beacon Bridge Academics',
      'email': 'info@beaconbridgeacademics.co.uk',
      'telephone': '+44 7414 663735',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '41 Great Oaks Avenue, Warren Wood',
        'addressLocality': 'Gainsborough',
        'postalCode': 'DN21 1AE',
        'addressCountry': 'GB'
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'admissions and parent support',
        'telephone': '+44 7414 663735',
        'email': 'info@beaconbridgeacademics.co.uk',
        'areaServed': 'GB',
        'availableLanguage': 'English'
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEO 
        title="Contact Us | Beacon Bridge Academics Online Tutoring"
        description="Get in touch with Beacon Bridge Academics. Speak with our UK academic advisors, book a free diagnostic consultation, or ask questions about our GCSE & A-Level tuition."
        canonicalPath="/contact"
        schemaJson={contactSchema}
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#001f3f] via-[#050167] to-[#001633] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            Admissions & Academic Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            We Are Here to Support Your Child’s Journey
          </h1>
          <p className="mt-4 text-slate-200 text-sm sm:text-base max-w-2xl mx-auto">
            Have questions about syllabus requirements, tutor matching, or our virtual classroom technology? Speak directly with our senior educational advisors.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details & Fast Booking */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="relative h-44 overflow-hidden">
                <img
                  src="/pages/about-hero.jpg"
                  alt="Beacon Bridge Academics UK educators collaborating with students"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/75 via-[#001f3f]/20 to-transparent" />
                <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between text-white">
                  <span className="text-xs font-extrabold tracking-wide">UK Academic Support Desk</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#40ffa7]">
                    <span className="w-2 h-2 rounded-full bg-[#40ffa7] animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Direct Channels</h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#050167]/10 flex items-center justify-center shrink-0 text-[#050167]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Us</p>
                    <a 
                      href="mailto:info@beaconbridgeacademics.co.uk"
                      className="text-slate-900 font-semibold hover:text-[#050167] transition-colors break-all"
                    >
                      info@beaconbridgeacademics.co.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#050167]/10 flex items-center justify-center shrink-0 text-[#050167]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp &amp; Admissions Line</p>
                    <a
                      href="https://wa.me/447414663735"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-900 font-semibold hover:text-[#050167] transition-colors"
                    >
                      +44 7414 663735
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#050167]/10 flex items-center justify-center shrink-0 text-[#050167]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Support Hours</p>
                    <p className="text-slate-800 font-semibold">Monday – Friday: 08:30 – 20:30 GMT</p>
                    <p className="text-slate-600 text-xs mt-0.5">Saturday: 09:00 – 18:00 GMT</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#050167]/10 flex items-center justify-center shrink-0 text-[#050167]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</p>
                    <p className="text-slate-800 font-semibold leading-snug">
                      41 Great Oaks Avenue<br />
                      Warren Wood, Gainsborough<br />
                      DN21 1AE, United Kingdom
                    </p>
                    <p className="text-slate-500 text-xs mt-1">Delivering virtual classroom tuition across the UK, Canada, the US &amp; globally.</p>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Fast 20-Min Consultation Card */}
            <div className="bg-gradient-to-br from-[#050167] to-[#001f3f] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <span className="inline-block bg-[#40ffa7]/20 text-[#40ffa7] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Free Diagnostic
              </span>
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/advisor.jpg"
                  alt="Mr. Gideon Babs"
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-xl object-cover object-top border-2 border-[#40ffa7] shadow-sm shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold">Mr. Gideon Babs</h3>
                  <p className="text-[11px] text-[#40ffa7] font-semibold">Head of Academic Advisory</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-200 leading-relaxed">
                Book a dedicated 20-minute video consultation with Mr. Gideon Babs to diagnose your child's learning strengths and exam hurdles.
              </p>
              <Link
                to="/book-consultation"
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-xs transition-all shadow-md active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Consultation Online</span>
              </Link>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Send an Academic Inquiry</h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Fill in the details below and our lead coordinator will respond within one business day.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#050167] text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="eleanor@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#050167] text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input 
                      type="tel"
                      placeholder="+44 7911 123456"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#050167] text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Target Level
                    </label>
                    <select
                      value={form.curriculum}
                      onChange={(e) => setForm({ ...form, curriculum: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#050167] text-sm text-slate-900 bg-white"
                    >
                      <option value="KS2">Primary & KS2 (Year 3-6 / SATs)</option>
                      <option value="KS3">Key Stage 3 (Year 7-9)</option>
                      <option value="GCSE">GCSE / IGCSE (Year 10-11)</option>
                      <option value="A-Level">A-Level / Further Maths (Year 12-13)</option>
                      <option value="North American">US / Canadian High School & AP</option>
                      <option value="IELTS">IELTS Academic &amp; UKVI Preparation</option>
                      <option value="Professional">Coding (Software Development) &amp; Design</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject(s) Needed
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. GCSE Mathematics and Triple Science"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#050167] text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    How Can We Help Your Child? *
                  </label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tell us about your child's current predicted grades, target exam board, or areas where they need confidence..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#050167] text-sm text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#050167] hover:bg-[#001f3f] text-[#40ffa7] font-black text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
