import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, ShieldCheck, ArrowRight, Instagram, Facebook, Youtube } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="bg-[#001f3f] text-[#f0faff]/75 text-sm border-t border-[#050167]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block bg-white px-3 py-2 rounded-2xl shadow-md group">
              <img 
                src="/logo.png" 
                alt="Beacon Bridge Academics" 
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
            </Link>
            <p className="text-[#f0faff] text-sm max-w-sm leading-relaxed font-medium">
              Beacon Bridge Academics: online tutoring that helps children catch up, feel confident and get exam-ready.
            </p>
            <p className="text-xs text-[#f0faff]/65 leading-relaxed max-w-sm">
              Online academic support company for students in the UK, the US, Canada, and Australia. Every teacher is curriculum-trained, safeguarding is built in, and parents have real-time visibility.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-xs bg-[#050167]/80 px-3 py-1.5 rounded-lg border border-[#40ffa7]/20 text-[#f0faff]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#40ffa7]" />
                DBS Checked & Vetted
              </span>
              <span className="flex items-center gap-1.5 text-xs bg-[#050167]/80 px-3 py-1.5 rounded-lg border border-[#40ffa7]/20 text-[#f0faff]">
                <Globe className="w-3.5 h-3.5 text-[#40ffa7]" />
                UK, US, Canada & Australia
              </span>
            </div>

            <div className="pt-2 space-y-2 text-xs text-[#f0faff]/85">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#40ffa7] shrink-0" />
                <a href="mailto:info@beaconbridgeacademics.co.uk" className="hover:text-[#40ffa7] transition-colors">
                  info@beaconbridgeacademics.co.uk
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#40ffa7] shrink-0" />
                <a
                  href="https://wa.me/447414663735"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#40ffa7] transition-colors"
                >
                  +44 7414 663735 (WhatsApp)
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#40ffa7] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  41 Great Oaks Avenue, Warren Wood, Gainsborough, DN21 1AE, UK
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#40ffa7] shrink-0" />
                <span>beaconbridgeacademics.co.uk</span>
              </div>
            </div>

            {/* Official Social Media Icons */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#f0faff]/50 uppercase tracking-wider block mb-2">Connect With Us:</span>
              <div className="flex items-center flex-wrap gap-2.5">
                <a 
                  href="https://www.facebook.com/BeaconAcademics"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Beacon Bridge Academics on Facebook" 
                  title="Facebook"
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#40ffa7] text-white hover:text-[#001f3f] flex items-center justify-center transition-all shadow-sm"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.youtube.com/@BeaconBridgeAcademics"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Beacon Bridge Academics on YouTube" 
                  title="YouTube"
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#40ffa7] text-white hover:text-[#001f3f] flex items-center justify-center transition-all shadow-sm"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.tiktok.com/@beacon.academics.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Beacon Bridge Academics on TikTok" 
                  title="TikTok"
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#40ffa7] text-white hover:text-[#001f3f] flex items-center justify-center transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a 
                  href="https://x.com/BBacademicsuk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Beacon Bridge Academics on X" 
                  title="X (formerly Twitter)"
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#40ffa7] text-white hover:text-[#001f3f] flex items-center justify-center transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <span
                  aria-label="Beacon Bridge Instagram (Coming Soon)"
                  title="Instagram — Coming Soon"
                  className="w-8 h-8 rounded-xl bg-white/5 text-white/50 border border-white/10 flex items-center justify-center cursor-default"
                >
                  <Instagram className="w-4 h-4" />
                </span>
              </div>
              <p className="text-[10px] text-[#f0faff]/45 mt-1.5">Instagram page coming soon</p>
            </div>
          </div>

          {/* Students Column */}
          <div>
            <h4 className="text-white font-bold mb-4 tracking-wider uppercase text-xs">Students</h4>
            <ul className="space-y-2.5">
              <li><Link to="/curriculum" className="hover:text-[#40ffa7] transition-colors">Online Tutoring</Link></li>
              <li><Link to="/ielts-registration" className="hover:text-[#40ffa7] transition-colors font-semibold text-[#40ffa7]">IELTS Registration (£100/mo)</Link></li>
              <li><Link to="/curriculum#exam-boards" className="hover:text-[#40ffa7] transition-colors">GCSE Exam Boards (AQA, Edexcel, OCR)</Link></li>
              <li><Link to="/how-it-works#virtual-classroom" className="hover:text-[#40ffa7] transition-colors">Live Virtual Classroom</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#40ffa7] transition-colors">Find Out More</Link></li>
              <li><Link to="/login" className="hover:text-[#40ffa7] transition-colors">Student Hub Login</Link></li>
            </ul>
          </div>

          {/* Teachers Column */}
          <div>
            <h4 className="text-white font-bold mb-4 tracking-wider uppercase text-xs">Teachers & Faculty</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/apply-to-teach" className="text-[#40ffa7] font-bold hover:underline transition-colors flex items-center gap-1">
                  <span>Become a Teacher (Apply)</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li><Link to="/apply-to-teach" className="hover:text-[#40ffa7] transition-colors">A-Level Subject Openings</Link></li>
              <li><Link to="/about#safeguarding" className="hover:text-[#40ffa7] transition-colors">Safeguarding & DBS Policy</Link></li>
              <li><Link to="/how-it-works#virtual-classroom" className="hover:text-[#40ffa7] transition-colors">Live Interactive Tools</Link></li>
              <li><Link to="/login" className="hover:text-[#40ffa7] transition-colors">Tutor Portal Access</Link></li>
            </ul>
          </div>

          {/* Other & Safeguarding Column */}
          <div>
            <h4 className="text-white font-bold mb-4 tracking-wider uppercase text-xs">Other</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="hover:text-[#40ffa7] transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-[#40ffa7] transition-colors">Academic Blog</Link></li>
              <li><Link to="/faq" className="hover:text-[#40ffa7] transition-colors">Frequently Asked Questions (FAQ)</Link></li>
              <li><Link to="/contact" className="hover:text-[#40ffa7] transition-colors">Contact Us</Link></li>
              <li><Link to="/book-consultation" className="hover:text-[#40ffa7] transition-colors">Book a Free Consultation</Link></li>
              <li><Link to="/register" className="hover:text-[#40ffa7] transition-colors">Register with Us</Link></li>
              <li><Link to="/security" className="hover:text-[#40ffa7] transition-colors">Security Policy</Link></li>
              <li><Link to="/payment-proof" className="hover:text-[#40ffa7] transition-colors">Submit Payment Proof</Link></li>
              <li><Link to="/about#cancellation" className="hover:text-[#40ffa7] transition-colors">Lesson Cancellation Policy</Link></li>
              <li><Link to="/about#safeguarding" className="hover:text-[#40ffa7] transition-colors">Safeguarding Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#050167]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#f0faff]/60 gap-4">
          <p>&copy; {new Date().getFullYear()} Beacon Bridge Academics. All rights reserved.</p>
          <div className="flex items-center space-x-6 flex-wrap gap-y-2">
            <Link to="/about#safeguarding" className="hover:text-[#40ffa7] transition-colors">Safeguarding Policy</Link>
            <Link to="/terms" className="hover:text-[#40ffa7] transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-[#40ffa7] transition-colors">Privacy Policy</Link>
            <Link to="/security" className="hover:text-[#40ffa7] transition-colors">Security Policy</Link>
            <Link to="/contact" className="hover:text-[#40ffa7] transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
