import React, { useState } from 'react';
import {
  Layers,
  Zap,
  Smartphone,
  Wifi,
  CheckCircle2,
  XCircle,
  BarChart3,
  Cpu,
  Server,
  Globe,
  Radio,
  Lock,
  Database,
} from 'lucide-react';
import { ARCHITECTURE_COMPARISONS } from '../data/simulationData';
import { ICN_ARCHITECTURE_COMPARISONS } from '../data/informationCentricData';
import { useTheme } from '../context/ThemeContext';
import { ArchitectureMode } from '../types';

interface ComparisonProps {
  currentMode?: ArchitectureMode;
}

export const ServerCentricComparison: React.FC<ComparisonProps> = ({ currentMode = 'server-centric' }) => {
  const [activeTab, setActiveTab] = useState<ArchitectureMode>(currentMode);
  const [networkCondition, setNetworkCondition] = useState<'3g' | '4g' | 'fiber'>('4g');
  const [deviceCpu, setDeviceCpu] = useState<'low_end_mobile' | 'desktop'>('low_end_mobile');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Dynamic calculations for Server-Centric vs Client-Centric
  const getMetrics = () => {
    let netMultiplier = 1;
    if (networkCondition === '3g') netMultiplier = 3.5;
    if (networkCondition === 'fiber') netMultiplier = 0.3;

    let cpuMultiplier = 1;
    if (deviceCpu === 'low_end_mobile') cpuMultiplier = 2.8;
    if (deviceCpu === 'desktop') cpuMultiplier = 0.5;

    return {
      serverCentric: {
        bundleKb: 18,
        ttfbMs: Math.round(22 * netMultiplier),
        fcpMs: Math.round(35 * netMultiplier),
        ttiMs: Math.round(45 * netMultiplier * (0.8 + 0.2 * cpuMultiplier)),
        jsExecMs: Math.round(8 * cpuMultiplier),
        ramMb: 32,
      },
      clientCentric: {
        bundleKb: 2450,
        ttfbMs: Math.round(65 * netMultiplier),
        fcpMs: Math.round(320 * netMultiplier),
        ttiMs: Math.round(420 * netMultiplier + 380 * cpuMultiplier),
        jsExecMs: Math.round(210 * cpuMultiplier),
        ramMb: 285,
      },
      informationCentric: {
        hopLatencyMs: Math.round(0.4 * netMultiplier),
        inNetworkCacheRate: '92%',
        multicastSavedBandwidth: '98.5%',
        stormResistanceFactor: '100x',
        tamperProofRate: '100% (Merkle Proof)',
      },
    };
  };

  const metrics = getMetrics();
  const isServer = activeTab === 'server-centric';

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 select-text transition-colors">
      {/* Header & Controls */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border backdrop-blur-md shadow-2xl ${
        isLight ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-slate-100'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className={`w-5 h-5 ${isServer ? 'text-emerald-500' : 'text-cyan-400'}`} />
            <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Architectural Paradigm Lab & Matrix
            </h2>
          </div>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Interactive performance benchmarks, protocol comparison matrices, and telemetry simulator.
          </p>
        </div>

        {/* Paradigm Toggle & Condition Tuners */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
          }`}>
            <button
              onClick={() => setActiveTab('server-centric')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'server-centric'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Server-Centric</span>
            </button>
            <button
              onClick={() => setActiveTab('information-centric')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'information-centric'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Information-Centric</span>
            </button>
          </div>

          {/* Network Selector */}
          <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
          }`}>
            <Wifi className="w-4 h-4 text-cyan-500 ml-1" />
            {(['3g', '4g', 'fiber'] as const).map((net) => (
              <button
                key={net}
                onClick={() => setNetworkCondition(net)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                  networkCondition === net
                    ? isLight
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {net === '3g' ? 'Slow 3G' : net === '4g' ? 'Fast 4G' : 'Gigabit'}
              </button>
            ))}
          </div>

          {/* Device Power Selector */}
          <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
          }`}>
            <Smartphone className="w-4 h-4 text-amber-500 ml-1" />
            {(['low_end_mobile', 'desktop'] as const).map((dev) => (
              <button
                key={dev}
                onClick={() => setDeviceCpu(dev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  deviceCpu === dev
                    ? isLight
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dev === 'low_end_mobile' ? 'Budget Phone CPU' : 'High-End PC'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SERVER-CENTRIC VIEW */}
      {isServer ? (
        <div className="space-y-6">
          {/* Side-by-Side Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Server-Centric Card */}
            <div className={`rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between border-2 ${
              isLight ? 'bg-white border-emerald-500 shadow-emerald-500/10' : 'bg-slate-900/90 border-emerald-500/40'
            }`}>
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-bold text-[10px] font-mono px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                ★ Server-Authoritative
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Server-Centric Architecture
                  </h3>
                </div>
                <p className={`text-xs mb-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  SSR, React Server Components (RSC), HTMX, Hotwire Turbo, Remix & Phoenix LiveView.
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center mb-5">
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">JS BUNDLE</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {metrics.serverCentric.bundleKb} KB
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-300/80 block font-semibold">99% lighter</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">TIME TO INTERACTIVE</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {metrics.serverCentric.ttiMs}ms
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-300/80 block font-semibold">Instant Paint</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">DEVICE MEMORY</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {metrics.serverCentric.ramMb} MB
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-300/80 block font-semibold">Ultra-low</span>
                  </div>
                </div>

                {/* Waterfall Breakdown */}
                <div className={`space-y-2 mb-4 p-3.5 rounded-xl border font-mono text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                    <span>EXECUTION LIFECYCLE WATERFALL</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{metrics.serverCentric.ttiMs}ms Total</span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-800 h-4 rounded-lg overflow-hidden flex text-[10px] font-bold text-slate-950">
                    <div style={{ width: '40%' }} className="bg-purple-400 flex items-center justify-center">
                      TTFB ({metrics.serverCentric.ttfbMs}ms)
                    </div>
                    <div style={{ width: '45%' }} className="bg-emerald-400 flex items-center justify-center">
                      HTML Paint
                    </div>
                    <div style={{ width: '15%' }} className="bg-sky-400 flex items-center justify-center">
                      Ready
                    </div>
                  </div>
                </div>
              </div>

              <div className={`space-y-1.5 text-xs pt-2 border-t ${
                isLight ? 'text-slate-700 border-slate-200' : 'text-slate-300 border-slate-800'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Zero secret API tokens or database credentials exposed to browser</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Database queries complete in 1ms over internal datacenter network</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Perfect native SEO & instant social link unfurls</span>
                </div>
              </div>
            </div>

            {/* Client-Centric Card */}
            <div className={`rounded-2xl p-5 shadow-2xl flex flex-col justify-between border ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-amber-500" />
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Client-Centric Architecture (Fat SPA)
                  </h3>
                </div>
                <p className={`text-xs mb-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Traditional Single-Page Apps (CRA, client React+Redux, Angular, client GraphQL).
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center mb-5">
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">JS BUNDLE</span>
                    <span className="text-base font-bold text-rose-500 font-mono">
                      {metrics.clientCentric.bundleKb} KB
                    </span>
                    <span className="text-[10px] text-rose-500 block font-semibold">Heavy Download</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">TIME TO INTERACTIVE</span>
                    <span className="text-base font-bold text-rose-500 font-mono">
                      {metrics.clientCentric.ttiMs}ms
                    </span>
                    <span className="text-[10px] text-rose-500 block font-semibold">Hydration Delay</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">DEVICE MEMORY</span>
                    <span className="text-base font-bold text-rose-500 font-mono">
                      {metrics.clientCentric.ramMb} MB
                    </span>
                    <span className="text-[10px] text-rose-500 block font-semibold">High Battery Drain</span>
                  </div>
                </div>

                {/* Waterfall Breakdown */}
                <div className={`space-y-2 mb-4 p-3.5 rounded-xl border font-mono text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                    <span>EXECUTION LIFECYCLE WATERFALL</span>
                    <span className="text-rose-500 font-bold">{metrics.clientCentric.ttiMs}ms Total</span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-800 h-4 rounded-lg overflow-hidden flex text-[10px] font-bold text-slate-950">
                    <div style={{ width: '15%' }} className="bg-purple-400 flex items-center justify-center">
                      HTML
                    </div>
                    <div style={{ width: '45%' }} className="bg-amber-400 flex items-center justify-center">
                      JS Bundle
                    </div>
                    <div style={{ width: '40%' }} className="bg-rose-400 flex items-center justify-center">
                      Hydrate & Fetch
                    </div>
                  </div>
                </div>
              </div>

              <div className={`space-y-1.5 text-xs pt-2 border-t ${
                isLight ? 'text-slate-700 border-slate-200' : 'text-slate-300 border-slate-800'
              }`}>
                <div className="flex items-center gap-2 text-rose-500">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Client-side waterfall: JS bundle must download before data fetching begins</span>
                </div>
                <div className="flex items-center gap-2 text-rose-500">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>High memory footprint causing lag on budget mobile phones</span>
                </div>
                <div className="flex items-center gap-2 text-rose-500">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Prone to secret key leakage in client browser bundles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Architectural Dimension Table */}
          <div className={`rounded-2xl border overflow-hidden shadow-2xl ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className={`p-4 border-b text-xs font-mono font-bold ${
              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}>
              DETAILED TECHNICAL COMPARISON MATRIX
            </div>
            <div className={`divide-y text-xs font-sans ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
              {ARCHITECTURE_COMPARISONS.map((comp, idx) => (
                <div key={idx} className={`grid grid-cols-1 md:grid-cols-12 p-4 gap-3 items-center ${
                  isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'
                }`}>
                  <div className="md:col-span-3 font-bold">{comp.dimension}</div>
                  <div className="md:col-span-4">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                      {comp.serverCentric.value}
                    </span>
                    <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {comp.serverCentric.detail}
                    </p>
                  </div>
                  <div className="md:col-span-5">
                    <span className="font-semibold text-rose-500 block mb-1">
                      {comp.clientCentric?.value}
                    </span>
                    <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {comp.clientCentric?.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* INFORMATION-CENTRIC VIEW */
        <div className="space-y-6">
          {/* Side-by-Side Information-Centric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Information-Centric (NDN / Content-Addressed) */}
            <div className={`rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between border-2 ${
              isLight ? 'bg-white border-cyan-500 shadow-cyan-500/10' : 'bg-slate-900/90 border-cyan-500/40'
            }`}>
              <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 font-bold text-[10px] font-mono px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                ★ Content-Addressed
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Information-Centric Architecture (ICN / NDN)
                  </h3>
                </div>
                <p className={`text-xs mb-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Named Data Networking (NDN), Content Addressing (CIDs/IPFS), In-Network Layer-3 Caching.
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center mb-5">
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">IN-NETWORK CACHE</span>
                    <span className="text-base font-bold text-cyan-400 font-mono">
                      {metrics.informationCentric.inNetworkCacheRate}
                    </span>
                    <span className="text-[10px] text-cyan-400 block font-semibold">Layer-3 Router CS</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">STORM DEFENSE</span>
                    <span className="text-base font-bold text-cyan-400 font-mono">
                      {metrics.informationCentric.stormResistanceFactor}
                    </span>
                    <span className="text-[10px] text-cyan-400 block font-semibold">PIT Aggregation</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">PROVENANCE</span>
                    <span className="text-base font-bold text-cyan-400 font-mono">
                      100%
                    </span>
                    <span className="text-[10px] text-cyan-400 block font-semibold">Ed25519 Signed</span>
                  </div>
                </div>

                {/* Waterfall Breakdown */}
                <div className={`space-y-2 mb-4 p-3.5 rounded-xl border font-mono text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                    <span>NAME FORWARDING & SIGNATURE LIFECYCLE</span>
                    <span className="text-cyan-400 font-bold">Sub-millisecond</span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-800 h-4 rounded-lg overflow-hidden flex text-[10px] font-bold text-slate-950">
                    <div style={{ width: '25%' }} className="bg-indigo-400 flex items-center justify-center">
                      Interest
                    </div>
                    <div style={{ width: '45%' }} className="bg-cyan-400 flex items-center justify-center">
                      CS Hit / PIT Trail
                    </div>
                    <div style={{ width: '30%' }} className="bg-emerald-400 flex items-center justify-center">
                      Verify Signature
                    </div>
                  </div>
                </div>
              </div>

              <div className={`space-y-1.5 text-xs pt-2 border-t ${
                isLight ? 'text-slate-700 border-slate-200' : 'text-slate-300 border-slate-800'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Request by Name (WHAT), not host IP (WHERE)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Ad-hoc local mesh survival during internet disaster blackouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Security bound directly to the immutable signed data payload</span>
                </div>
              </div>
            </div>

            {/* Host-Centric IP/DNS Card */}
            <div className={`rounded-2xl p-5 shadow-2xl flex flex-col justify-between border ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Host-Centric Architecture (Traditional IP & DNS)
                  </h3>
                </div>
                <p className={`text-xs mb-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Standard TCP/IP, DNS resolving, point-to-point TLS tunnels, host-bound servers.
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center mb-5">
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">ADDRESSING</span>
                    <span className="text-base font-bold text-amber-500 font-mono">
                      IP & Port
                    </span>
                    <span className="text-[10px] text-amber-500 block font-semibold">Location bound</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">MULTICAST</span>
                    <span className="text-base font-bold text-amber-500 font-mono">
                      Unicast Dupes
                    </span>
                    <span className="text-[10px] text-amber-500 block font-semibold">N streams for N users</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-500 block">PARTITION RESILIENCE</span>
                    <span className="text-base font-bold text-rose-500 font-mono">
                      Brittle
                    </span>
                    <span className="text-[10px] text-rose-500 block font-semibold">Requires WAN link</span>
                  </div>
                </div>

                {/* Waterfall Breakdown */}
                <div className={`space-y-2 mb-4 p-3.5 rounded-xl border font-mono text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                    <span>HOST-CENTRIC CONNECTION LIFECYCLE</span>
                    <span className="text-amber-500 font-bold">Multiple RTTs</span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-800 h-4 rounded-lg overflow-hidden flex text-[10px] font-bold text-slate-950">
                    <div style={{ width: '25%' }} className="bg-amber-400 flex items-center justify-center">
                      DNS Lookup
                    </div>
                    <div style={{ width: '35%' }} className="bg-purple-400 flex items-center justify-center">
                      TCP + TLS Handshake
                    </div>
                    <div style={{ width: '40%' }} className="bg-sky-400 flex items-center justify-center">
                      HTTP GET & Response
                    </div>
                  </div>
                </div>
              </div>

              <div className={`space-y-1.5 text-xs pt-2 border-t ${
                isLight ? 'text-slate-700 border-slate-200' : 'text-slate-300 border-slate-800'
              }`}>
                <div className="flex items-center gap-2 text-amber-500">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Channel-based security: Trust lost once data leaves the TLS tunnel</span>
                </div>
                <div className="flex items-center gap-2 text-amber-500">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Flash crowd viral traffic crushes servers with duplicate streams</span>
                </div>
                <div className="flex items-center gap-2 text-amber-500">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Total blackout if datacenter WAN connection is severed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Information-Centric Dimension Table */}
          <div className={`rounded-2xl border overflow-hidden shadow-2xl ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className={`p-4 border-b text-xs font-mono font-bold ${
              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}>
              INFORMATION-CENTRIC VS HOST-CENTRIC PROTOCOL MATRIX
            </div>
            <div className={`divide-y text-xs font-sans ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
              {ICN_ARCHITECTURE_COMPARISONS.map((comp, idx) => (
                <div key={idx} className={`grid grid-cols-1 md:grid-cols-12 p-4 gap-3 items-center ${
                  isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'
                }`}>
                  <div className="md:col-span-3 font-bold">{comp.dimension}</div>
                  <div className="md:col-span-4">
                    <span className="font-semibold text-cyan-400 block mb-1">
                      {comp.informationCentric?.value}
                    </span>
                    <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {comp.informationCentric?.detail}
                    </p>
                  </div>
                  <div className="md:col-span-5">
                    <span className="font-semibold text-amber-500 block mb-1">
                      {comp.serverCentric.value}
                    </span>
                    <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {comp.serverCentric.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
