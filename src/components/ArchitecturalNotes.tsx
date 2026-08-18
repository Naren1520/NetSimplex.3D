import React, { useState } from 'react';
import {
  BookOpen,
  Server,
  Cpu,
  Layers,
  Shield,
  Zap,
  Globe,
  Database,
  Lock,
  Share2,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Search,
  Printer,
  Sparkles,
  HelpCircle,
  FileText,
  Activity,
  Code2,
  Terminal,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ArchitectureMode } from '../types';

interface ArchitecturalNotesProps {
  currentMode?: ArchitectureMode;
}

export const ArchitecturalNotes: React.FC<ArchitecturalNotesProps> = ({
  currentMode = 'server-centric',
}) => {
  const [activeMode, setActiveMode] = useState<ArchitectureMode>(currentMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const isServer = activeMode === 'server-centric';

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8 select-text transition-colors">
      {/* Top Header & Search Bar */}
      <div
        className={`p-5 rounded-2xl border backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isLight
            ? 'bg-white/95 border-slate-300 text-slate-900'
            : 'bg-slate-900/90 border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              isServer
                ? isLight
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : isLight
                ? 'bg-cyan-50 border-cyan-300 text-cyan-600'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}
          >
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight font-sans">
                Comprehensive Architectural Study Notes & Blueprint
              </h2>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isServer
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                    : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/30'
                }`}
              >
                Study Edition
              </span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Fully detailed technical notes, structural diagrams, protocol execution models, and exam flashcards.
            </p>
          </div>
        </div>

        {/* Mode Selector & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Architecture Tab Switcher */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <button
              onClick={() => setActiveMode('server-centric')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'server-centric'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Server-Centric Notes</span>
            </button>
            <button
              onClick={() => setActiveMode('information-centric')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'information-centric'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Information-Centric Notes</span>
            </button>
          </div>

          {/* Print / Export Button */}
          <button
            onClick={() => window.print()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Print or Save as PDF Study Sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SERVER-CENTRIC STUDY NOTES SECTION */}
      {/* ========================================================================= */}
      {isServer && (
        <div className="space-y-8">
          {/* Quick Summary Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <span className="text-slate-500 block text-[10px]">CORE PRINCIPLE</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Server as Single Source of Truth</span>
            </div>
            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <span className="text-slate-500 block text-[10px]">DATA TRANSFER</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Pure HTML Fragments / RSC Wire</span>
            </div>
            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <span className="text-slate-500 block text-[10px]">SECURITY MODEL</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Zero-Secret Browser Air Gap</span>
            </div>
            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <span className="text-slate-500 block text-[10px]">DATABASE QUERY RTT</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">~1ms Colocated LAN</span>
            </div>
          </div>

          {/* DIAGRAM 1: FULL ARCHITECTURAL TOPOLOGY & DATAFLOW */}
          <section
            className={`p-6 rounded-2xl border shadow-xl ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Diagram 1: Server-Centric End-to-End System Topology
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Thin Browser Client → Edge CDN → Authoritative Application Server → Colocated DB / Worker Mesh
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    `[Browser Thin Client (15KB JS)] ---> HTTP GET / Server Action ---> [Edge CDN / Cache Proxy] ---> (Sub-ms LAN) ---> [Authoritative Server (SSR/RSC/HTMX)] <---> [Redis Cache (0.5ms)] & [PostgreSQL DB (1.2ms)] & [Background Workers]`,
                    'diag1'
                  )
                }
                className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1"
              >
                {copiedSection === 'diag1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'diag1' ? 'Copied' : 'Copy Flow'}</span>
              </button>
            </div>

            {/* Interactive Visual Box Diagram */}
            <div
              className={`p-5 rounded-xl border font-mono text-xs overflow-x-auto ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              <div className="min-w-[700px] flex items-center justify-between gap-3 relative py-4">
                {/* Node 1: Client */}
                <div className="flex-1 p-3.5 rounded-xl border border-sky-500/40 bg-sky-500/10 text-center relative group">
                  <div className="text-sky-400 font-bold mb-1 flex items-center justify-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    <span>THIN CLIENT</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">Browser DOM Viewport</p>
                  <span className="mt-2 inline-block px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded text-[10px]">
                    ~15 KB JS Runtime
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">Zero Secrets & Zero DB Access</div>
                </div>

                {/* Arrow 1 */}
                <div className="flex flex-col items-center justify-center text-slate-500 text-[10px] px-1">
                  <span className="text-emerald-400 font-bold">1 RTT</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <span>HTTP / POST</span>
                </div>

                {/* Node 2: Edge CDN */}
                <div className="flex-1 p-3.5 rounded-xl border border-purple-500/40 bg-purple-500/10 text-center relative group">
                  <div className="text-purple-400 font-bold mb-1 flex items-center justify-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>EDGE CDN</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">Global PoP Proxy</p>
                  <span className="mt-2 inline-block px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[10px]">
                    Static Asset & ISR Cache
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">Stale-While-Revalidate</div>
                </div>

                {/* Arrow 2 */}
                <div className="flex flex-col items-center justify-center text-slate-500 text-[10px] px-1">
                  <span className="text-purple-400 font-bold">WAN</span>
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                  <span>Bypass / Miss</span>
                </div>

                {/* Node 3: Server Core */}
                <div className="flex-1.2 p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 text-center relative shadow-lg shadow-emerald-500/10">
                  <div className="text-emerald-400 font-bold mb-1 flex items-center justify-center gap-1.5">
                    <Server className="w-4 h-4" />
                    <span>AUTHORITATIVE SERVER</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight font-semibold">SSR · RSC · Server Actions</p>
                  <span className="mt-2 inline-block px-2 py-0.5 bg-emerald-500/30 text-emerald-200 rounded text-[10px] font-bold">
                    Secure Execution Core
                  </span>
                  <div className="text-[10px] text-emerald-400/80 mt-1">Holds All API Keys & ACL</div>
                </div>

                {/* Arrow 3 (Colocated Bus) */}
                <div className="flex flex-col items-center justify-center text-slate-500 text-[10px] px-1">
                  <span className="text-amber-400 font-bold">1ms LAN</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                  <span>Internal Queries</span>
                </div>

                {/* Node 4: Colocated Storage Cluster */}
                <div className="flex-1 p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-center relative">
                  <div className="text-amber-400 font-bold mb-1 flex items-center justify-center gap-1.5">
                    <Database className="w-4 h-4" />
                    <span>STORAGE & WORKERS</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">Redis · Postgres · BullMQ</p>
                  <span className="mt-2 inline-block px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px]">
                    ACID Persistence
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">Colocated in same Datacenter</div>
                </div>
              </div>
            </div>
          </section>

          {/* CHAPTER 1: CORE ARCHITECTURAL CONCEPTS & DEFINITIONS */}
          <section
            className={`p-6 rounded-2xl border shadow-xl ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <span className="text-emerald-500">§ 1.</span> Fundamentals of Server-Centric Computing
            </h3>
            <p className={`text-sm leading-relaxed mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              In a <strong>Server-Centric Architecture</strong>, the server is the single authoritative runtime for state
              management, authentication, business domain logic, and UI rendering. The client browser operates primarily
              as a lightweight display viewport and event emitter rather than a heavy execution engine.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  1. Server-Side Rendering (SSR) & Streaming
                </h4>
                <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Instead of sending a blank <code>&lt;div id="root"&gt;&lt;/div&gt;</code> that downloads megabytes of JS
                  before fetching data, the server generates complete, semantic HTML directly on the wire. Modern frameworks
                  (Next.js App Router, Remix) stream HTML chunks progressively using <code>Transfer-Encoding: chunked</code>.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  2. React Server Components (RSC)
                </h4>
                <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Components execute exclusively on the server and are serialized into a lightweight JSON-like virtual DOM
                  stream. Their dependencies (heavy libraries like <code>date-fns</code>, markdown parsers, syntax highlighters)
                  are never bundled or sent to the client browser.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  3. Server Actions & Mutations
                </h4>
                <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Async functions defined with <code>'use server'</code> can be invoked directly from client event handlers or
                  forms. The framework handles RPC dispatch, parameter validation, database transactions, and cache revalidation
                  in a single round-trip.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  4. Hypermedia-Driven (HTMX / Hotwire / Livewire)
                </h4>
                <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Extends HTML with declarative attributes (e.g. <code>hx-get="/search" hx-target="#results" hx-swap="outerHTML"</code>).
                  Eliminates complex client-side state managers (Redux, MobX, Zustand) by making server responses the direct UI delta.
                </p>
              </div>
            </div>
          </section>

          {/* CHAPTER 2: PERFORMANCE & NETWORK WATERFALL COMPARISON */}
          <section
            className={`p-6 rounded-2xl border shadow-xl ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <span className="text-emerald-500">§ 2.</span> Performance Equations & Network Waterfalls
            </h3>
            <p className={`text-sm leading-relaxed mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Why does Server-Centric execution consistently beat fat client-side SPAs on Core Web Vitals (FCP, LCP, INP, CLS)?
            </p>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left font-sans border-collapse">
                <thead>
                  <tr
                    className={`border-b font-mono ${
                      isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <th className="p-3">Metric / Dimension</th>
                    <th className="p-3 text-emerald-600 dark:text-emerald-400">Server-Centric (SSR / RSC / HTMX)</th>
                    <th className="p-3 text-rose-500">Client-Centric (Fat SPA / CRA)</th>
                    <th className="p-3 text-slate-500">Physical Explanation</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
                  <tr>
                    <td className="p-3 font-semibold">First Contentful Paint (FCP)</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-mono font-bold">~35ms - 150ms</td>
                    <td className="p-3 text-rose-500 font-mono font-bold">~400ms - 2,500ms</td>
                    <td className={`p-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      HTML parsed and painted immediately; does not wait for JS bundle download.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Time to Interactive (TTI)</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-mono font-bold">Instant (0ms Hydration)</td>
                    <td className="p-3 text-rose-500 font-mono font-bold">Delayed by CPU parsing</td>
                    <td className={`p-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Browser does not spend 300ms evaluating a 3MB JavaScript bundle on mobile CPUs.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Database Query Latency</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-mono font-bold">0.8ms - 2ms</td>
                    <td className="p-3 text-rose-500 font-mono font-bold">80ms - 300ms per RTT</td>
                    <td className={`p-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Server and Database sit in the same datacenter rack over 100Gbps fiber.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Client JS Footprint</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-mono font-bold">10 KB - 40 KB</td>
                    <td className="p-3 text-rose-500 font-mono font-bold">1,500 KB - 5,000 KB</td>
                    <td className={`p-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Heavy libraries run on server Node.js runtime and are never shipped to client.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* CHAPTER 3: SECURITY & ZERO-SECRET AIR GAP */}
          <section
            className={`p-6 rounded-2xl border shadow-xl ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <span className="text-emerald-500">§ 3.</span> Security Model: Zero-Secret Air Gap
            </h3>
            <p className={`text-sm leading-relaxed mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              In modern web security, client environments (DevTools, browser extensions, compromised endpoints) are considered
              <strong> untrusted</strong>. Server-Centric design establishes a strict physical boundary.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
                  <Shield className="w-4 h-4" />
                  <span>Zero Exposed API Keys</span>
                </div>
                <p className={`${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Payment secrets (Stripe), AI tokens (Gemini / OpenAI), and database connection URIs remain locked in
                  server environment variables (<code>process.env</code>) and cannot leak into client bundles.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
                  <Lock className="w-4 h-4" />
                  <span>Enforced Authorization (RBAC)</span>
                </div>
                <p className={`${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Mutations are verified on the server using signed session cookies (<code>HttpOnly, SameSite=Lax, Secure</code>).
                  A malicious client cannot manipulate client-side state flags (e.g. <code>isAdmin: true</code>).
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
                  <Database className="w-4 h-4" />
                  <span>Direct ACID Transactions</span>
                </div>
                <p className={`${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Complex multi-step database transactions execute within a single atomic block on the server, avoiding race
                  conditions and stale client caches.
                </p>
              </div>
            </div>
          </section>

          {/* CHAPTER 4: STUDY FLASHCARDS & EXAM PREPARATION */}
          <section
            className={`p-6 rounded-2xl border shadow-xl ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span>High-Yield Revision Flashcards & Interview Questions</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Q1: What is the primary difference between CSR, SSR, and RSC?
                </span>
                <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                  <strong>CSR:</strong> Browser downloads empty HTML + big JS bundle; JS executes and fetches data to render.<br />
                  <strong>SSR:</strong> Server renders HTML on request; sends HTML + full JS bundle; browser hydrates DOM.<br />
                  <strong>RSC:</strong> Server renders server components into virtual DOM stream; zero component JS sent to client; only interactive client leaves hydrate.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Q2: Why does an HTMX / Hypermedia approach scale with less frontend code?
                </span>
                <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                  Because the server returns rendered HTML fragments directly, the client does not need client-side JSON parsing,
                  client routers, Redux store reducers, or client-side templating engines. The browser simply swaps the HTML fragment into the DOM.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Q3: What is the "Colocation Advantage" in server-centric computing?
                </span>
                <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                  The server runtime and the database reside within the same physical datacenter, connected by low-latency intra-cluster
                  switches (&lt;1ms). A server can perform 10 database queries in 5ms, whereas a client making 10 REST round-trips over cellular 4G would take 1,500ms+.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INFORMATION-CENTRIC (NDN / ICN) STUDY NOTES SECTION */}
      {/* ========================================================================= */}
      {!isServer && (
        <div className="space-y-8">
          {/* Quick Summary Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <span className="text-slate-500 block text-[10px]">ADDRESSING PARADIGM</span>
              <span className="font-bold text-cyan-400">Content-Addressed (WHAT, not WHERE)</span>
            </div>
            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <span className="text-slate-500 block text-[10px]">IN-NETWORK CACHING</span>
              <span className="font-bold text-cyan-400">Layer-3 Router Content Store (CS)</span>
            </div>
            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <span className="text-slate-500 block text-[10px]">SECURITY BOUNDARY</span>
              <span className="font-bold text-cyan-400">Signed Data (Ed25519 & Merkle Proofs)</span>
            </div>
            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <span className="text-slate-500 block text-[10px]">MULTICAST EFFICIENCY</span>
              <span className="font-bold text-cyan-400">PIT Aggregation (1 Upstream / N Users)</span>
            </div>
          </div>

          {/* DIAGRAM 1: NDN FORWARDING ENGINE (CS, PIT, FIB) */}
          <section
            className={`p-6 rounded-2xl border shadow-xl ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Diagram 1: The NDN / ICN Forwarding Engine Pipeline
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Interest Packet Arrival → Content Store (CS) → Pending Interest Table (PIT) → Forwarding Information Base (FIB)
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    `[Interest Packet] ---> [1. Check CS (Cache Hit? -> Return Data immediately)] ---> (Miss) ---> [2. Check PIT (Same Name pending? -> Add Incoming Face & Suppress Upstream)] ---> (New) ---> [3. Check FIB (Longest Prefix Match -> Forward Upstream Face)]`,
                    'icn_diag1'
                  )
                }
                className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1"
              >
                {copiedSection === 'icn_diag1' ? (
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedSection === 'icn_diag1' ? 'Copied' : 'Copy Flow'}</span>
              </button>
            </div>

            {/* Interactive Visual NDN Forwarding Flowchart */}
            <div
              className={`p-5 rounded-xl border font-mono text-xs overflow-x-auto ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              <div className="min-w-[760px] grid grid-cols-4 gap-3 py-2 text-center">
                {/* Step 1: Ingress */}
                <div className="p-3.5 rounded-xl border border-sky-500/40 bg-sky-500/10">
                  <div className="text-sky-400 font-bold mb-1">INGRESS PACKET</div>
                  <p className="text-[11px] text-slate-400">Interest: <code>/media/doc/v1</code></p>
                  <span className="mt-2 inline-block px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded text-[10px]">
                    Consumer Request
                  </span>
                </div>

                {/* Step 2: Content Store */}
                <div className="p-3.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10">
                  <div className="text-indigo-400 font-bold mb-1">1. CONTENT STORE (CS)</div>
                  <p className="text-[11px] text-slate-400">In-Network RAM Buffer</p>
                  <span className="mt-2 inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px]">
                    Hit: Instant Return
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">Miss: Forward to PIT</div>
                </div>

                {/* Step 3: Pending Interest Table */}
                <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10">
                  <div className="text-cyan-400 font-bold mb-1">2. PIT TABLE</div>
                  <p className="text-[11px] text-slate-400">Pending Request Trail</p>
                  <span className="mt-2 inline-block px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[10px]">
                    Aggregates Duplicates
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">Stops DDOS / Flash Crowds</div>
                </div>

                {/* Step 4: FIB */}
                <div className="p-3.5 rounded-xl border border-pink-500/40 bg-pink-500/10">
                  <div className="text-pink-400 font-bold mb-1">3. FIB (ROUTING)</div>
                  <p className="text-[11px] text-slate-400">Name Prefix Routing</p>
                  <span className="mt-2 inline-block px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded text-[10px]">
                    Forward to Next Hop
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">Longest Prefix Match</div>
                </div>
              </div>

              {/* Data Return Loop */}
              <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-400">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  DATA PACKET RETURN PIPELINE:
                </span>
                <span>Data follows PIT breadcrumbs back to all consumers → Cached in CS along the path → PIT entry erased</span>
              </div>
            </div>
          </section>

          {/* CHAPTER 1: NDN VS TRADITIONAL IP HOURGLASS COMPARISON */}
          <section
            className={`p-6 rounded-2xl border shadow-xl ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <span className="text-cyan-400">§ 1.</span> The Hourglass Shift: Host-Centric IP vs NDN
            </h3>
            <p className={`text-sm leading-relaxed mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              The waist of the original Internet protocol stack is the <strong>Internet Protocol (IP)</strong>, designed around
              physical host locations (IP addresses). Named Data Networking replaces IP with <strong>Named, Signed Data Packets</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-amber-500 mb-1.5">
                  <Globe className="w-4 h-4" />
                  <span>Traditional IP (Host-Centric / WHERE)</span>
                </div>
                <ul className="space-y-1.5 text-slate-400 leading-relaxed list-disc list-inside">
                  <li>Packets addressed to numeric destination IP (e.g. <code>142.250.190.46</code>).</li>
                  <li>Security bound to the TLS communication channel between two IP endpoints.</li>
                  <li>Routers have no memory of requested content (stateless packet switching).</li>
                  <li>If 10,000 users request the same video, the server sends 10,000 identical unicast streams.</li>
                </ul>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-cyan-400 mb-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>NDN / ICN (Content-Centric / WHAT)</span>
                </div>
                <ul className="space-y-1.5 text-slate-400 leading-relaxed list-disc list-inside">
                  <li>Packets addressed by hierarchical name (e.g. <code>/mit/csail/paper.pdf</code>) or cryptographic CID.</li>
                  <li>Security bound directly to the DATA: every packet carries a digital signature (Ed25519).</li>
                  <li>Routers have stateful memory (Content Store & PIT), answering requests on the spot.</li>
                  <li>PIT aggregates identical requests; only 1 stream traverses upstream, saving 98%+ bandwidth.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CHAPTER 2: CONTENT ADDRESSING, CIDs & MERKLE DAGs */}
          <section
            className={`p-6 rounded-2xl border shadow-xl ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <span className="text-cyan-400">§ 2.</span> Content Addressing, CIDs & Merkle DAGs
            </h3>
            <p className={`text-sm leading-relaxed mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              In decentralized content architectures (IPFS, Filecoin, BitTorrent), data is identified by its cryptographic hash
              (Content Identifier or CID), creating an immutable <strong>Merkle Directed Acyclic Graph (DAG)</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <span className="text-cyan-400 font-bold block mb-1">1. ROOT CID HASH</span>
                <code className="text-[11px] text-pink-400 block break-all mb-2">bafybeic7...9a2e</code>
                <p className="text-slate-400 font-sans text-xs">
                  Any change to a single byte in the file produces a completely different hash, making silent data tampering impossible.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <span className="text-cyan-400 font-bold block mb-1">2. MERKLE CHUNKING</span>
                <code className="text-[11px] text-emerald-400 block mb-2">256 KB Chunk Blocks</code>
                <p className="text-slate-400 font-sans text-xs">
                  Large video or binary datasets are split into cryptographic chunks, allowing parallel retrieval from multiple nearby peers simultaneously.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <span className="text-cyan-400 font-bold block mb-1">3. LOCATION INDEPENDENCE</span>
                <code className="text-[11px] text-amber-400 block mb-2">Fetch from Any Peer</code>
                <p className="text-slate-400 font-sans text-xs">
                  It does not matter whether the file comes from an origin server, a local router cache, or a peer's phone; verification succeeds via hash match.
                </p>
              </div>
            </div>
          </section>

          {/* CHAPTER 3: DISASTER & MESH PARTITION RESILIENCE */}
          <section
            className={`p-6 rounded-2xl border shadow-xl ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <span className="text-cyan-400">§ 3.</span> Partition & Disaster Resilience
            </h3>
            <p className={`text-sm leading-relaxed mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              What happens when an undersea fiber cable is severed or a central cloud datacenter suffers an outage?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-rose-500 mb-1.5">
                  <span>Host-Centric IP Failure Mode</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  In IP architecture, if the WAN link to <code>api.central.com</code> is severed, all local devices immediately fail,
                  even if 10 adjacent neighbors have already downloaded the vital medical emergency guide or emergency map.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1.5">
                  <span>ICN / NDN Ad-Hoc Mesh Resilience</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  In NDN, local wireless Wi-Fi / Bluetooth mesh nodes broadcast Interests for <code>/emergency/map</code>.
                  Any neighboring node with the signed cached data immediately answers, maintaining 100% operational capability offline.
                </p>
              </div>
            </div>
          </section>

          {/* CHAPTER 4: ICN FLASHCARDS & EXAM PREP */}
          <section
            className={`p-6 rounded-2xl border shadow-xl ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>High-Yield ICN Revision Flashcards & Exam Questions</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="font-bold text-cyan-400 block mb-1">
                  Q1: Explain the role of the PIT (Pending Interest Table) during a viral live broadcast.
                </span>
                <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                  When thousands of consumers request the exact same video frame <code>/stream/live/frame_992</code>, the router
                  records all incoming interfaces (Faces) in its PIT table and forwards only <strong>one</strong> Interest upstream.
                  When the single Data packet returns, it is duplicated down to all waiting Faces. This eliminates flash-crowd congestion.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="font-bold text-cyan-400 block mb-1">
                  Q2: Why is TLS channel security insufficient for in-network caching?
                </span>
                <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                  TLS encrypts the pipe between two IP addresses. An intermediate router cannot cache encrypted packets because it cannot
                  understand them or prove their integrity to other users. ICN signs the <strong>content itself</strong>, allowing intermediate
                  routers to safely store and serve verified data to third parties.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="font-bold text-cyan-400 block mb-1">
                  Q3: How does NDN handle mobility (e.g. mobile phone switching cell towers)?
                </span>
                <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                  Consumer mobility is seamless: because Interests are pull-based and name-addressed, a moving consumer simply re-sends
                  pending Interests through the new wireless interface without breaking a TCP socket connection.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
