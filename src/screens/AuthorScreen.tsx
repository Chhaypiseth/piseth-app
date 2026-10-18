import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Code2,
  Heart,
  Share2,
  ExternalLink,
  Award,
  Check,
  Send,
  Sparkles,
  Smartphone,
  Globe,
  Terminal,
} from 'lucide-react';

interface AuthorScreenProps {
  onBack: () => void;
}

export const AuthorScreen: React.FC<AuthorScreenProps> = ({ onBack }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [quickNote, setQuickNote] = useState('');

  const authorEmail = 'chhaypisethmail@gmail.com';

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(authorEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setQuickNote('');
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto no-scrollbar bg-slate-50/60 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 bg-white -mx-4 px-4 pt-1">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 leading-tight">
            About Author <span className="font-normal text-slate-400">/</span>{' '}
            <span className="font-khmer text-blue-600">អំពីអ្នកបង្កើត</span>
          </h2>
          <p className="text-[11px] text-slate-400">Creator & Lead Software Engineer</p>
        </div>

        <button
          onClick={handleCopyEmail}
          className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
        >
          {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Mail className="w-3.5 h-3.5" />}
          <span>{copiedEmail ? 'Copied' : 'Contact'}</span>
        </button>
      </div>

      <div className="space-y-4 my-3">
        {/* Author Hero Card */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
          <div className="w-full h-20 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 rounded-2xl absolute top-0 left-0" />

          {/* Author Portrait Avatar */}
          <div className="relative mt-8 mb-2">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/author_chhay_piseth_1792309392813.jpg"
                alt="Chhay Piseth - ឆាយ ពិសិដ្ឋ"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-md border-2 border-white"
              title="Verified Creator"
            >
              ✓
            </div>
          </div>

          {/* Name & Titles */}
          <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
            Chhay Piseth
          </h3>
          <span className="text-sm font-semibold text-blue-600 font-khmer mt-0.5">
            ឆាយ ពិសិដ្ឋ
          </span>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Software Engineer & Mobile App Developer
          </p>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>Phnom Penh, Cambodia · រាជធានីភ្នំពេញ 🇰🇭</span>
          </div>

          {/* Short Bio Statement */}
          <p className="text-xs text-slate-600 mt-3 max-w-xs leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
            "Passionate developer & runner building intuitive, high-performance digital tools for Cambodia. HathBran was created to inspire healthy, energetic, and active lifestyles."
          </p>
        </div>

        {/* Brief CV Summary / Highlights */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-blue-600" />
            <span>Core Expertise & Tech Stack</span>
          </h4>

          {/* Skill Tags */}
          <div className="flex flex-wrap gap-1.5">
            {['React', 'TypeScript', 'Mobile (React Native)', 'Tailwind CSS', 'Node.js', 'REST APIs', 'GPS & Geolocation', 'UI/UX Design', 'Khmer Localization'].map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-xl bg-slate-50 text-slate-700 text-[11px] font-medium border border-slate-200/70"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Education</span>
              <span className="font-bold text-slate-800">B.S. Computer Science</span>
              <span className="text-[10px] text-slate-500 block">Phnom Penh, Cambodia</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Focus Areas</span>
              <span className="font-bold text-slate-800">HealthTech & Mobile</span>
              <span className="text-[10px] text-slate-500 block">Community Wellness</span>
            </div>
          </div>
        </div>

        {/* HathBran Vision Card */}
        <div className="bg-gradient-to-tr from-sky-50 to-blue-50/80 rounded-3xl p-4 border border-blue-100 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900">
              About HathBran (ហាត់ប្រាណ)
            </h4>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-khmer">
            កម្មវិធី <strong>ហាត់ប្រាណ (HathBran)</strong> ត្រូវបានបង្កើតឡើងដើម្បីផ្តល់ជូននូវកម្មវិធីតាមដានការរត់ ដើរ និងជិះកង់ ដែលមានភាពងាយស្រួល ស្រស់ស្អាត និងមានភាសាខ្មែរពេញលេញសម្រាប់អ្នកហាត់ប្រាណគ្រប់រូប។
          </p>
        </div>

        {/* Contact & Email */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs">
          <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center justify-between">
            <span>Direct Contact / ទំនាក់ទំនង</span>
            <span className="text-[10px] text-slate-400 font-normal">Available for collaborations</span>
          </h4>

          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-100 mb-3">
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-mono text-slate-700 font-medium truncate max-w-[190px]">
                {authorEmail}
              </span>
            </div>
            <button
              onClick={handleCopyEmail}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white px-2.5 py-1 rounded-xl shadow-xs border border-slate-200 cursor-pointer"
            >
              {copiedEmail ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Quick Note sender */}
          <form onSubmit={handleSendNote} className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="Leave a quick cheer or note for Piseth... / ផ្ញើសារលើកទឹកចិត្ត"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {messageSent && (
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Thank you! Your message has been sent to Piseth.</span>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
