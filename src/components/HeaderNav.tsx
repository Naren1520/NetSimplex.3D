import React from 'react';
import {
  Server,
  Globe,
  BarChart3,
  BookOpen,
  ShieldCheck,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Home,
  Cpu,
  RefreshCw,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ArchitectureMode } from '../types';

export type ActiveTab = 'topology' | 'comparison' | 'masterclass' | 'notes';

interface HeaderNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  currentMode: ArchitectureMode;
  onSwitchMode: (mode: ArchitectureMode) => void;
  onNavigateHome: () => void;
  onRestart?: () => void;
  totalRequests: number;
  avgLatencyMs: number;
  cacheHitRatio: number;
  serverHealth: 'optimal' | 'degraded' | 'high_load';
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onChangeTab,
  currentMode,
  onSwitchMode,
  onNavigateHome,
  onRestart,
  totalRequests,
  avgLatencyMs,
  cacheHitRatio,
  serverHealth,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const isServerCentric = currentMode === 'server-centric';

  return (
    <header className={`${isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'} border-b shrink-0 z-20 transition-colors`}>
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Home & Mode Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          {/* Home & Reboot Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onNavigateHome}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-750 text-slate-300'
              }`}
              title="Return to Landing Page & Paradigm Directory"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>

            {onRestart && (
              <button
                onClick={onRestart}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-750 text-slate-300'
                }`}
                title="Restart 3D Simulation Engine (3s Calibration Boot Loader)"
              >
                <RotateCcw className="w-4 h-4 text-emerald-500" />
                <span className="hidden sm:inline">Reboot</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border shadow-sm ${
              isServerCentric
                ? isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : isLight ? 'bg-cyan-50 border-cyan-300 text-cyan-600' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}>
              {isServerCentric ? <Server className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`font-extrabold text-sm sm:text-base tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'} font-sans`}>
                  {isServerCentric ? 'SERVER-CENTRIC LAB' : 'INFORMATION-CENTRIC LAB'}
                </h1>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isServerCentric
                    ? isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-300' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                }`}>
                  3D Interactive
                </span>
              </div>
              <p className={`text-[11px] font-mono hidden sm:block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {isServerCentric
                  ? 'SSR · Server Actions · Hypermedia / HTMX · Livewire · Edge Caching'
                  : 'NDN / ICN · Content Addressing (CID) · In-Network Caching · Merkle DAG'}
              </p>
            </div>
          </div>

          {/* Quick Switch Mode Pill */}
          <button
            onClick={() => onSwitchMode(isServerCentric ? 'information-centric' : 'server-centric')}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono font-semibold transition-all ${
              isServerCentric
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
            }`}
            title="Switch Architecture Paradigm"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Switch to {isServerCentric ? 'Information-Centric' : 'Server-Centric'}</span>
          </button>
        </div>

        {/* View Switcher Tabs & Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/90 border-slate-800'}`}>
            <button
              onClick={() => onChangeTab('topology')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'topology'
                  ? isServerCentric
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Simulation</span>
            </button>

            <button
              onClick={() => onChangeTab('comparison')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'comparison'
                  ? isServerCentric
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Architectural Matrix</span>
            </button>

            <button
              onClick={() => onChangeTab('masterclass')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'masterclass'
                  ? isServerCentric
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Masterclass</span>
            </button>

            <button
              onClick={() => onChangeTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'notes'
                  ? isServerCentric
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Study Notes</span>
            </button>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-300'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Fullscreen Trigger */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className={`p-2 rounded-xl border transition-all hidden sm:flex ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className={`w-4 h-4 ${isServerCentric ? 'text-emerald-500' : 'text-cyan-400'}`} />
              ) : (
                <Maximize2 className={`w-4 h-4 ${isServerCentric ? 'text-emerald-500' : 'text-cyan-400'}`} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Live System Telemetry Ticker Strip */}
      <div className={`border-t px-4 py-1.5 overflow-x-auto text-[11px] font-mono ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-900/70 border-slate-800/80 text-slate-400'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-max">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full animate-ping ${isServerCentric ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
              <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>PARADIGM:</span>
              <span className={`font-semibold ${isServerCentric ? 'text-emerald-500' : 'text-cyan-400'}`}>
                {isServerCentric ? 'SERVER AUTHORITATIVE (ACID)' : 'NAMED DATA / CONTENT-ADDRESSED (NDN)'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>
                {isServerCentric ? 'Datacenter Latency:' : 'In-Network Hop Latency:'}
              </span>
              <span className={`font-bold ${isServerCentric ? 'text-emerald-500' : 'text-cyan-400'}`}>{avgLatencyMs}ms</span>
            </div>

            <div className="flex items-center gap-1">
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>
                {isServerCentric ? 'Edge Cache Hit:' : 'Content Store (CS) Hit:'}
              </span>
              <span className="text-sky-500 font-bold">{cacheHitRatio}%</span>
            </div>

            <div className="flex items-center gap-1">
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Processed Packets:</span>
              <span className="text-purple-500 font-bold">{totalRequests}</span>
            </div>

            <div className="flex items-center gap-1">
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>
                {isServerCentric ? 'Client JS Footprint:' : 'Cryptographic Integrity:'}
              </span>
              <span className="text-amber-500 font-bold">
                {isServerCentric ? '~15 KB (Zero Hydration Waterfall)' : 'Ed25519 / Merkle Proof (100% Provenance)'}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <ShieldCheck className={`w-3.5 h-3.5 ${isServerCentric ? 'text-emerald-500' : 'text-cyan-400'}`} />
            <span>{isServerCentric ? 'Zero Client Secrets or Direct DB Access' : 'Location-Independent Asymmetric Security'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
