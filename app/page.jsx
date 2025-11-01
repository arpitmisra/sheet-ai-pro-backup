import Link from 'next/link';
import { FileSpreadsheet, Zap, Users, BarChart3, Brain, Sparkles, Database, Globe, ArrowRight, CheckCircle2, Layers, Lock, Rocket } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,1))]"></div>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Header - Glassmorphic */}
      <header className="fixed w-full top-0 z-50 border-b border-white/5">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl border border-white/10 backdrop-blur-sm">
              <FileSpreadsheet className="w-6 h-6 text-white" />
              <Sparkles className="w-3 h-3 text-cyan-400 absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-bold text-white">SheetAI Pro</span>
            <span className="hidden sm:flex px-2.5 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 text-xs rounded-full font-medium border border-cyan-500/20">
              AI-POWERED
            </span>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/login"
              className="px-4 py-2 text-white/80 hover:text-white font-medium transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register"
              className="group relative px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/15 font-medium transition-all overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 relative">
        <div className="text-center max-w-6xl mx-auto relative">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm rounded-full border border-white/10"></div>
            <Brain className="w-4 h-4 text-cyan-400 relative z-10" />
            <span className="text-white/90 relative z-10">Google Sheets Alternative with AI Superpowers</span>
            <Sparkles className="w-3 h-3 text-purple-400 relative z-10 animate-pulse" />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 leading-[1.1]">
            <span className="text-white block">The Future of</span>
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent block">
              Spreadsheets
            </span>
            <span className="text-white/60 text-4xl sm:text-5xl md:text-6xl block mt-2">is Here</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/60 mb-12 leading-relaxed max-w-3xl mx-auto">
            Create, collaborate, and analyze data with <span className="text-white font-semibold">AI-powered spreadsheets</span>. 
            <br className="hidden md:block" />
            Real-time collaboration meets intelligent automation.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link 
              href="/register"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Building for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link 
              href="/dashboard"
              className="group relative px-8 py-4 bg-white/5 backdrop-blur-sm text-white rounded-xl border border-white/10 hover:bg-white/10 font-semibold text-lg transition-all overflow-hidden"
            >
              <span className="relative z-10">Try Live Demo</span>
            </Link>
          </div>

          {/* Key Stats - Glassmorphic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm rounded-2xl border border-white/10"></div>
              <div className="relative p-8 text-center">
                <div className="text-4xl mb-3">⚡</div>
                <div className="text-2xl font-bold text-white mb-1">Real-Time</div>
                <div className="text-white/50">Live Collaboration</div>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-sm rounded-2xl border border-white/10"></div>
              <div className="relative p-8 text-center">
                <div className="text-4xl mb-3">🤖</div>
                <div className="text-2xl font-bold text-white mb-1">AI-Powered</div>
                <div className="text-white/50">Smart Automation</div>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-sm rounded-2xl border border-white/10"></div>
              <div className="relative p-8 text-center">
                <div className="text-4xl mb-3">🚀</div>
                <div className="text-2xl font-bold text-white mb-1">Lightning Fast</div>
                <div className="text-white/50">Instant Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Phase Development Showcase */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Three Powerful Phases, One Amazing Product
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Built from the ground up with a clear vision: Start with core functionality, 
              add real-time collaboration, then supercharge with AI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Phase 1: Base Project */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10"></div>
                <div className="relative p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10">
                      <Database className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Phase 1: Core</h3>
                      <p className="text-blue-400 font-medium text-sm">Foundation</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-white/60">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      Interactive spreadsheet grid
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      Basic formulas (SUM, AVERAGE)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      Data sorting & filtering
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      CSV import/export
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 2: Live Project */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10"></div>
                <div className="relative p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-white/10">
                      <Globe className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Phase 2: Live</h3>
                      <p className="text-purple-400 font-medium text-sm">Collaboration</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-white/60">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      Real-time cell synchronization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      Live user presence
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      Collaborative chat
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      Shareable links
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 3: AI Project */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10"></div>
                <div className="relative p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-white/10">
                      <Brain className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Phase 3: AI</h3>
                      <p className="text-cyan-400 font-medium text-sm">Intelligence</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-white/60">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      Intelligent data analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      Natural language formulas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      Automated chart generation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      Smart insights & predictions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose SheetAI Pro?
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Built for the modern team that needs speed, collaboration, and intelligence in their data workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10"></div>
            <div className="relative p-6 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4 border border-white/10">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Lightning Fast</h3>
              <p className="text-white/60">
                Real-time calculations with zero lag. Built on modern tech stack for maximum performance.
              </p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10"></div>
            <div className="relative p-6 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mb-4 border border-white/10">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Live Collaboration</h3>
              <p className="text-white/60">
                See teammates' changes instantly. Chat, presence indicators, and seamless sharing.
              </p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10"></div>
            <div className="relative p-6 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center mb-4 border border-white/10">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">AI Assistant</h3>
              <p className="text-white/60">
                Natural language queries, automated insights, and intelligent formula suggestions.
              </p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10"></div>
            <div className="relative p-6 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4 border border-white/10">
                <BarChart3 className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Smart Charts</h3>
              <p className="text-white/60">
                AI-powered chart generation from simple text commands. Visualize data effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Powered by industry-leading tools for performance, reliability, and scalability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Next.js', color: 'from-white to-gray-300', icon: '▲' },
              { name: 'React', color: 'from-cyan-400 to-blue-500', icon: '⚛' },
              { name: 'Supabase', color: 'from-green-400 to-emerald-500', icon: 'S' },
              { name: 'Tailwind', color: 'from-cyan-400 to-blue-400', icon: 'T' },
              { name: 'Gemini AI', color: 'from-purple-400 to-pink-500', icon: '✦' },
              { name: 'WebSocket', color: 'from-orange-400 to-red-500', icon: '⚡' }
            ].map((tech, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10"></div>
                <div className="relative p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-br ${tech.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <span className="text-2xl font-bold text-white">
                      {tech.icon}
                    </span>
                  </div>
                  <p className="font-semibold text-white">{tech.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="relative max-w-5xl mx-auto">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-blue-500/30 rounded-3xl blur-2xl"></div>
            
            {/* Glass Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20"></div>
              <div className="relative p-12 text-center">
                <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Transform Your Spreadsheet Experience?
                </h2>
                <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
                  Join the future of data collaboration. Start building smarter spreadsheets today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/register"
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                  <Link 
                    href="/dashboard"
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 hover:bg-white/15 font-semibold text-lg transition-all"
                  >
                    Explore Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 relative">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
        <div className="container mx-auto px-4 py-8 text-center text-white/60 relative">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            <span className="font-semibold text-white">SheetAI Pro</span>
          </div>
          <p>&copy; 2025 SheetAI Pro. Built for the future of spreadsheets.</p>
        </div>
      </footer>
    </div>
  );
}
