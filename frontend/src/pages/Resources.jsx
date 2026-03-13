import React from 'react';
import Navbar from '../components/Navbar';
import { BookOpen, FileText, Video, Headphones, Link as LinkIcon, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResourceCard = ({ icon: Icon, title, description, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <div
      className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-[#F26419]/30 transition-all hover:bg-white/[0.04] cursor-pointer group hover:shadow-lg hover:shadow-[#F26419]/10 transform hover:scale-105"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-[#F26419]/10 text-[#F26419] group-hover:bg-[#F26419]/20 transition-all duration-300 group-hover:scale-110">
          <Icon size={24} />
        </div>
        <LinkIcon size={16} className="text-slate-600 group-hover:text-[#F26419] transition-colors duration-300" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#F26419] transition-colors duration-300">{title}</h3>
      <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
    </div>
  </a>
);

export default function Resources() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#E6E2DF]">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-15 mix-blend-overlay" />

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <div className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
          <div className="space-y-4 mb-12">
            <h1 className="text-5xl font-black text-white tracking-tight">Resources & Learning</h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Comprehensive guides, tutorials, and documentation to help you maximize CyberGuard AI and stay informed about cybersecurity best practices.
            </p>
          </div>

          {/* Documentation Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-[#F26419] rounded" />
                Documentation & Guides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ResourceCard
                  icon={BookOpen}
                  title="Getting Started Guide"
                  description="Learn the basics of CyberGuard AI, set up your account, and navigate the dashboard."
                  link="#"
                  delay={0}
                />
                <ResourceCard
                  icon={FileText}
                  title="API Documentation"
                  description="Complete API reference with code examples and integration guides for developers."
                  link="#"
                  delay={100}
                />
                <ResourceCard
                  icon={FileText}
                  title="Evidence Management"
                  description="Best practices for uploading, organizing, and analyzing digital evidence securely."
                  link="#"
                  delay={200}
                />
              </div>
            </div>

            {/* Video Tutorials Section */}
            <div>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-[#F26419] rounded" />
                Video Tutorials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ResourceCard
                  icon={Video}
                  title="Dashboard Walkthrough"
                  description="Step-by-step video tour of the CyberGuard AI interface and key features."
                  link="#"
                  delay={0}
                />
                <ResourceCard
                  icon={Video}
                  title="AI Analysis Deep Dive"
                  description="Understand how our AI analyzes evidence and generates insights with this comprehensive tutorial."
                  link="#"
                  delay={100}
                />
                <ResourceCard
                  icon={Video}
                  title="Security Best Practices"
                  description="Expert tips on protecting your data and maintaining cybersecurity hygiene."
                  link="#"
                  delay={200}
                />
              </div>
            </div>

            {/* Knowledge Base Section */}
            <div>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-[#F26419] rounded" />
                Knowledge Base
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ResourceCard
                  icon={Globe}
                  title="Community Forum"
                  description="Connect with other users, share insights, and get help from the CyberGuard community."
                  link="#"
                  delay={0}
                />
                <ResourceCard
                  icon={FileText}
                  title="FAQ & Troubleshooting"
                  description="Find answers to common questions and solutions for technical issues."
                  link="#"
                  delay={100}
                />
                <ResourceCard
                  icon={Headphones}
                  title="Support & Contact"
                  description="Get in touch with our support team for dedicated assistance and consulting."
                  link="#"
                  delay={200}
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Need Help?</h3>
                <p className="text-slate-400">Can't find what you're looking for? Our support team is ready to assist.</p>
              </div>
              <Link to="/get-help" className="px-8 py-3 bg-[#F26419] hover:bg-[#d44f0d] text-white font-bold rounded-xl whitespace-nowrap transition-all">
                Start Chat Support →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
