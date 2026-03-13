import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Shield, Users, Target, Award, Globe, Zap, Lock, Eye } from 'lucide-react';

const TeamMember = ({ name, role, description }) => (
  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-[#F26419]/30 transition-all hover:bg-white/[0.05] group">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F26419]/20 to-[#F26419]/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Users size={28} className="text-[#F26419]" />
    </div>
    <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
    <p className="text-sm text-[#F26419] font-semibold mb-3">{role}</p>
    <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
  </div>
);

const ValueCard = ({ icon: Icon, title, description, color }) => (
  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all hover:bg-white/[0.05]">
    <div className={`p-3 rounded-xl ${color} w-fit mb-4`}>
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
  </div>
);

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#E6E2DF]">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-15 mix-blend-overlay" />

      <Navbar />

      <main className="relative z-10">
        <div className="px-6 md:px-10 py-16 max-w-7xl mx-auto">

          {/* Hero Section */}
          <div className="space-y-6 mb-20 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest font-bold text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F26419] animate-pulse" />
              About CyberGuard AI
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Fighting Digital Crime with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26419] to-orange-300">
                Intelligence
              </span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              CyberGuard AI is an advanced digital forensics platform that leverages artificial intelligence
              to help investigators analyze evidence, track cases, and bring cybercriminals to justice.
              Our mission is to make the digital world safer for everyone.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="bg-gradient-to-br from-[#F26419]/10 to-transparent border border-[#F26419]/20 rounded-3xl p-8">
              <div className="p-4 rounded-2xl bg-[#F26419]/10 text-[#F26419] w-fit mb-6">
                <Target size={32} />
              </div>
              <h2 className="text-2xl font-black text-white mb-4">Our Mission</h2>
              <p className="text-slate-300 leading-relaxed">
                To democratize digital forensics by providing AI-powered tools that enable law enforcement,
                organizations, and individuals to investigate cybercrime efficiently. We believe everyone
                deserves protection in the digital age.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-3xl p-8">
              <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 w-fit mb-6">
                <Eye size={32} />
              </div>
              <h2 className="text-2xl font-black text-white mb-4">Our Vision</h2>
              <p className="text-slate-300 leading-relaxed">
                A world where cybercrime is swiftly identified, analyzed, and resolved through the power
                of artificial intelligence. We envision a future where digital evidence is processed in
                minutes, not months.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-4 flex items-center justify-center gap-3">
                <div className="w-1 h-8 bg-[#F26419] rounded" />
                Our Core Values
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                These principles guide everything we build and every decision we make.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ValueCard
                icon={Shield}
                title="Security First"
                description="Military-grade encryption and zero-trust architecture protect every piece of evidence."
                color="bg-[#F26419]/10 text-[#F26419]"
              />
              <ValueCard
                icon={Zap}
                title="Speed & Efficiency"
                description="AI-powered analysis delivers results in minutes, accelerating investigations."
                color="bg-yellow-500/10 text-yellow-400"
              />
              <ValueCard
                icon={Lock}
                title="Privacy & Trust"
                description="Your data is yours. We never share, sell, or compromise user information."
                color="bg-emerald-500/10 text-emerald-400"
              />
              <ValueCard
                icon={Globe}
                title="Global Impact"
                description="Fighting cybercrime across borders with tools accessible to everyone."
                color="bg-blue-500/10 text-blue-400"
              />
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-4 flex items-center justify-center gap-3">
                <div className="w-1 h-8 bg-[#F26419] rounded" />
                Our Team
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                A dedicated group of cybersecurity experts, AI researchers, and engineers committed to
                making the digital world safer.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TeamMember
                name="Dr. Sarah Mitchell"
                role="Chief Executive Officer"
                description="Former FBI cybercrime investigator with 15+ years of experience in digital forensics and AI applications."
              />
              <TeamMember
                name="James Chen"
                role="Chief Technology Officer"
                description="AI/ML expert from MIT with a passion for building systems that detect and prevent digital fraud."
              />
              <TeamMember
                name="Priya Sharma"
                role="Head of Research"
                description="PhD in Computer Science specializing in neural networks for pattern recognition in digital evidence."
              />
              <TeamMember
                name="Michael Torres"
                role="Lead Security Engineer"
                description="Ethical hacker and security architect ensuring our platform meets the highest security standards."
              />
              <TeamMember
                name="Emily Park"
                role="Product Designer"
                description="UX specialist focused on making complex forensic tools intuitive and accessible for all users."
              />
              <TeamMember
                name="David Okonkwo"
                role="Operations Director"
                description="Manages global partnerships with law enforcement agencies and cybersecurity organizations."
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-black text-[#F26419] mb-2">500+</p>
                <p className="text-sm text-slate-400 font-medium">Cases Resolved</p>
              </div>
              <div>
                <p className="text-4xl font-black text-[#F26419] mb-2">99.2%</p>
                <p className="text-sm text-slate-400 font-medium">Analysis Accuracy</p>
              </div>
              <div>
                <p className="text-4xl font-black text-[#F26419] mb-2">50+</p>
                <p className="text-sm text-slate-400 font-medium">Partner Agencies</p>
              </div>
              <div>
                <p className="text-4xl font-black text-[#F26419] mb-2">24/7</p>
                <p className="text-sm text-slate-400 font-medium">Active Monitoring</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#F26419]/10 to-transparent border border-[#F26419]/20 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Get Started?</h3>
                <p className="text-slate-400">Join CyberGuard AI and help make the digital world a safer place.</p>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-[#F26419] hover:bg-[#d44f0d] text-white font-bold rounded-xl whitespace-nowrap transition-all"
                >
                  Create Account
                </Link>
                <Link
                  to="/get-help"
                  className="px-8 py-3 bg-white/5 border border-white/10 hover:border-[#F26419]/30 text-white font-bold rounded-xl whitespace-nowrap transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
