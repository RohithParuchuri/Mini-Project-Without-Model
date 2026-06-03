import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Send, X, MessageCircle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';

const FASTAPI_BASE_URL = " https://innermostly-paranormal-idell.ngrok-free.dev";

const CASE_OPTIONS = [
  "Financial Fraud / Cybercrime",
  "Physical Crime (Assault/Violence)",
  "Property Crime",
  "Stalking / Harassment",
  "Drug / Weapons Offence",
  "Other / Not Sure",
];

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      text: "Hello! I'm CyberGuard AI Support.\n\nSelect a case type and describe your complaint in English or Hinglish.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCase, setSelectedCase] = useState(CASE_OPTIONS[0]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      type: 'text',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ text: input, selected_case: selectedCase })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'result',
        data,
        timestamp: new Date()
      }]);

    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'text',
        text: `Connection error: ${err.message}\n\nMake sure your Kaggle notebook is running and the ngrok URL is updated.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const SEVERITY_COLORS = {
    Critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    High:     { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    Medium:   { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    Low:      { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  };

  const renderMessage = (msg) => {
    if (msg.type === 'text') {
      return (
        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
      );
    }

    const { data } = msg;
    const sev = SEVERITY_COLORS[data.severity] || SEVERITY_COLORS.Low;

    return (
      <div className="space-y-3 text-sm">
        {/* Translation */}
        {data.translated_english && (
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Translated</p>
            <p className="text-slate-300 italic">{data.translated_english}</p>
          </div>
        )}

        {/* Categories */}
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Category</p>
          <div className="flex flex-wrap gap-1">
            {data.categories?.map(cat => (
              <span key={cat} className="px-2 py-0.5 bg-[#F26419]/15 text-[#F26419] border border-[#F26419]/30 rounded text-xs font-medium">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div className="flex items-center gap-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Severity</p>
          <span className={`px-2 py-0.5 rounded text-xs font-bold border ${sev.bg} ${sev.text} ${sev.border}`}>
            {data.severity}
          </span>
        </div>

        {/* Next Steps */}
        {data.next_steps && (
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Next Steps</p>
            <div className="space-y-1">
              {data.next_steps.split('\n').map((step, i) => (
                <p key={i} className="text-slate-300 text-xs">{step}</p>
              ))}
            </div>
          </div>
        )}

        {/* Similar Cases */}
        {data.similar_cases?.length > 0 && (
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Similar Cases</p>
            <div className="space-y-1">
              {data.similar_cases.map((c, i) => (
                <p key={i} className="text-slate-400 text-xs border-l-2 border-white/10 pl-2">
                  {c.text}...
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed bottom-4 right-4 w-96 h-[620px] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F26419]/10 to-[#F26419]/5 border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F26419]/20 flex items-center justify-center">
              <MessageCircle className="text-[#F26419]" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">CyberGuard Support</h3>
              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Online
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Case Selector */}
        <div className="px-4 py-2 border-b border-white/10 bg-[#0f0f0f] flex items-center gap-2">
          <p className="text-[10px] text-slate-500 whitespace-nowrap">Case type:</p>
          <select
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#F26419]/50"
          >
            {CASE_OPTIONS.map(opt => (
              <option key={opt} value={opt} className="bg-[#1a1a1a]">{opt}</option>
            ))}
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f0f0f]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-xl ${
                msg.sender === 'user'
                  ? 'bg-[#F26419] text-white rounded-br-none'
                  : 'bg-white/10 text-slate-200 rounded-bl-none'
              }`}>
                {renderMessage(msg)}
                <span className="text-[10px] opacity-50 mt-2 block">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 px-4 py-3 rounded-xl rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4 bg-[#121212]">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type in English or Hinglish..."
              className="flex-1 bg-white/[0.02] border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2 bg-[#F26419] hover:bg-[#d44f0d] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default function GetHelp() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-[#E6E2DF]">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-15 mix-blend-overlay" />

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <div className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
          <div className="space-y-4 mb-16">
            <h1 className="text-5xl font-black text-white tracking-tight">Get Help & Support</h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              We're here to help! Choose your preferred way to get in touch with our support team.
            </p>
          </div>

          {/* Support Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Live Chat */}
            <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 rounded-2xl p-8 hover:border-[#F26419]/30 transition-all hover:shadow-lg hover:shadow-[#F26419]/10 transform hover:scale-105">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-xl bg-[#F26419]/10 text-[#F26419] group-hover:scale-110 transition-all duration-300">
                  <MessageCircle size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Live Chat</h3>
                  <p className="text-sm text-slate-500">Instant support</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Chat with our support team in real-time. Get instant answers to your questions about CyberGuard AI.
              </p>
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-full px-6 py-3 bg-[#F26419] hover:bg-[#d44f0d] text-white font-bold rounded-xl transition-all duration-300"
              >
                Start Chat Now
              </button>
            </div>

            {/* Email Support */}
            <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 rounded-2xl p-8 hover:border-[#F26419]/30 transition-all hover:shadow-lg hover:shadow-blue-500/10 transform hover:scale-105">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-all duration-300">
                  <Mail size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Email Support</h3>
                  <p className="text-sm text-slate-500">Detailed inquiries</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Send us an email with detailed information about your issue. We'll respond within 24 hours.
              </p>
              <a
                href="mailto:support@cyberguardai.com"
                className="w-full px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold rounded-xl transition-all block text-center duration-300"
              >
                Email Us
              </a>
            </div>

            {/* Phone Support */}
            <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 rounded-2xl p-8 hover:border-[#F26419]/30 transition-all hover:shadow-lg hover:shadow-emerald-500/10 transform hover:scale-105">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-all duration-300">
                  <Phone size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Phone Support</h3>
                  <p className="text-sm text-slate-500">Speak with an expert</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Call our support hotline for urgent issues. Our team is available Mon-Fri, 9AM-6PM EST.
              </p>
              <a
                href="tel:+18005551234"
                className="w-full px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-xl transition-all block text-center duration-300"
              >
                Call Now
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "How do I upload evidence to the Secure Vault?",
                  a: "Navigate to the Secure Vault page in your dashboard. Click 'Upload Evidence' and select your files. Our system supports various formats including images, videos, audio files, and documents."
                },
                {
                  q: "What file formats are supported?",
                  a: "We support JPG, PNG, GIF, MP4, MOV, MP3, WAV, PDF, DOC, and DOCX formats. Maximum file size is 2GB per upload."
                },
                {
                  q: "How secure is my evidence?",
                  a: "All evidence is encrypted end-to-end using military-grade AES-256 encryption. Access is logged and monitored 24/7 for compliance."
                },
                {
                  q: "Can I export my analysis results?",
                  a: "Yes! You can export analysis reports in PDF, JSON, or CSV formats directly from the AI Analysis page."
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.01] border border-white/5 rounded-xl p-6 hover:bg-white/[0.02] transition-all duration-300 hover:shadow-lg hover:shadow-white/5 hover:border-white/10"
                >
                  <h4 className="font-bold text-white mb-3 flex items-start gap-3">
                    <span className="text-[#F26419] font-black">Q:</span>
                    {item.q}
                  </h4>
                  <p className="text-slate-300 leading-relaxed flex gap-3">
                    <span className="text-[#F26419] font-black">A:</span>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resources Link */}
          <div className="mt-12 text-center">
            <p className="text-slate-300 mb-4">Looking for documentation and guides?</p>
            <Link to="/resources" className="inline-flex items-center gap-2 px-8 py-3 bg-white/[0.05] border border-white/10 hover:border-[#F26419]/30 text-white font-bold rounded-xl transition-all">
              Browse Resources →
            </Link>
          </div>
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-16 h-16 bg-[#F26419] hover:bg-[#d44f0d] text-white rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-orange-500/50"
        title="Open chat support"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
}
