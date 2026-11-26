import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCheck } from 'lucide-react';

// Configurable WhatsApp URL (Update WHATSAPP_URL when custom link is finalized)
const DEFAULT_WHATSAPP_NUMBER = '447438411831';
const CUSTOM_WHATSAPP_LINK = import.meta.env.VITE_WHATSAPP_URL || '';

const QUICK_TOPICS = [
  { label: 'KS2 / KS3 / GCSE Tuition', msg: 'Hello Beacon Bridge Academics, I would like to enquire about KS2 / KS3 / GCSE tuition.' },
  { label: 'A-Level / Canada Grade 11–12', msg: 'Hello Beacon Bridge Academics, I would like to learn more about A-Level / Grade 11–12 programs.' },
  { label: 'IELTS (£100/month)', msg: 'Hello Beacon Bridge Academics, I would like to register for IELTS Academic & UKVI Preparation (£100/month).' },
  { label: 'Coding / Graphics Design', msg: 'Hello Beacon Bridge Academics, I would like information on Coding (Software Development) & Graphics Design.' },
  { label: 'Book Free Consultation', msg: 'Hello Beacon Bridge Academics, I would like to schedule a free 20-minute diagnostic consultation.' }
];

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('Hello Beacon Bridge Academics, I would like to enquire about your online tutoring programs.');

  const getWhatsAppUrl = (messageText) => {
    const encoded = encodeURIComponent(messageText || customMsg);
    if (CUSTOM_WHATSAPP_LINK) {
      return CUSTOM_WHATSAPP_LINK.includes('?')
        ? `${CUSTOM_WHATSAPP_LINK}&text=${encoded}`
        : `${CUSTOM_WHATSAPP_LINK}?text=${encoded}`;
    }
    return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encoded}`;
  };

  const handleOpenWhatsApp = (text) => {
    window.open(getWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Interactive Chat Flow Popover */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#050167] text-white p-4 flex items-center justify-between relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#40ffa7]/20 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md shrink-0 ring-2 ring-white/20">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Beacon Bridge Admissions
                  <span className="w-2 h-2 rounded-full bg-[#40ffa7] animate-pulse" />
                </h4>
                <p className="text-[11px] text-[#f0faff]/80">WhatsApp Academic Advisor &bull; Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors relative z-10"
              aria-label="Close WhatsApp Flow"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Flow Body */}
          <div className="p-4 bg-[#f0faff]/70 space-y-3 max-h-80 overflow-y-auto">
            {/* Advisor Greeting Bubble */}
            <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-xs border border-slate-200/80 text-xs text-slate-700 leading-relaxed max-w-[90%]">
              <p className="font-bold text-[#050167] mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Welcome to Beacon Bridge Academics!
              </p>
              <p>Select a program below or send us a message to start a live WhatsApp chat with our admissions desk:</p>
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                <span>Just now</span>
                <CheckCheck className="w-3 h-3 text-sky-500" />
              </div>
            </div>

            {/* Quick Selection Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                Quick Enquiry Topics
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TOPICS.map((topic, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpenWhatsApp(topic.msg)}
                    className="text-left text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white border border-[#050167]/15 text-[#050167] hover:bg-[#40ffa7]/20 hover:border-[#050167] transition-all shadow-2xs"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Message Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleOpenWhatsApp(customMsg);
                }}
                placeholder="Type your message..."
                className="flex-grow px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#25D366] text-slate-800"
              />
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(customMsg)}
                className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-md transition-all flex items-center justify-center shrink-0"
                title="Send on WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3 rounded-full shadow-2xl shadow-[#25D366]/35 border-2 border-white transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Open WhatsApp Messenger"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#050167] border-2 border-white rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#40ffa7] border-2 border-white rounded-full" />
        </div>
        <span className="font-extrabold text-xs sm:text-sm tracking-tight hidden sm:inline">
          WhatsApp Us
        </span>
      </button>
    </div>
  );
};
