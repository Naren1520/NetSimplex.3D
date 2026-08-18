import React, { useState } from 'react';
import {
  Code,
  Network,
  Layers,
  CheckCircle2,
  FileCode,
  ArrowRight,
  Database,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';
import { SimulationStep } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ExecutionDebuggerProps {
  currentStep: SimulationStep;
  currentStepIndex: number;
  totalSteps: number;
}

export const ExecutionDebugger: React.FC<ExecutionDebuggerProps> = ({
  currentStep,
  currentStepIndex,
  totalSteps,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'network' | 'state'>('code');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`border rounded-xl overflow-hidden shadow-2xl flex flex-col h-full backdrop-blur-md transition-colors ${
      isLight ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-slate-100'
    }`}>
      {/* Header with Navigation Tabs */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b ${
        isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950/80 border-slate-800/80'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className={`font-bold text-xs uppercase tracking-wider font-mono ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            Server Execution Trace
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            [{currentStep.activeNodeId.toUpperCase()}]
          </span>
        </div>

        <div className={`flex items-center gap-1 p-1 rounded-lg border ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
        }`}>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'code'
                ? isLight
                  ? 'bg-emerald-500 text-white shadow-sm font-bold'
                  : 'bg-slate-800 text-emerald-300 border border-slate-700'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Active Code</span>
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'network'
                ? isLight
                  ? 'bg-emerald-500 text-white shadow-sm font-bold'
                  : 'bg-slate-800 text-emerald-300 border border-slate-700'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Packet Protocol</span>
          </button>
          <button
            onClick={() => setActiveTab('state')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'state'
                ? isLight
                  ? 'bg-emerald-500 text-white shadow-sm font-bold'
                  : 'bg-slate-800 text-emerald-300 border border-slate-700'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Server State</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`p-4 flex-1 overflow-y-auto space-y-3 font-sans ${isLight ? 'bg-slate-50' : 'bg-slate-950'}`}>
        {/* Step Banner & Context */}
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${
          isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-950/60 border-slate-800/80'
        }`}>
          <div className={`p-2 rounded-lg shrink-0 ${
            isLight ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
          }`}>
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h4 className={`font-bold text-sm mb-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {currentStep.title}
            </h4>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {currentStep.description}
            </p>
          </div>
        </div>

        {/* TAB 1: CODE EXECUTION */}
        {activeTab === 'code' && (
          <div className="space-y-3">
            <div className={`rounded-lg border overflow-hidden ${
              isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className={`px-3 py-1.5 border-b flex items-center justify-between text-[11px] font-mono ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900/90 border-slate-800 text-slate-400'
              }`}>
                <span className={`flex items-center gap-1.5 font-semibold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
                  <FileCode className="w-3.5 h-3.5 text-cyan-500" />
                  {currentStep.codeSnippet.filename}
                </span>
                <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded border font-bold ${
                  isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {currentStep.codeSnippet.language}
                </span>
              </div>
              <pre className={`p-3 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre selection:bg-emerald-500/30 ${
                isLight ? 'text-slate-800 bg-slate-900 text-slate-100' : 'text-slate-200 bg-slate-950'
              }`}>
                <code>{currentStep.codeSnippet.code}</code>
              </pre>
            </div>

            {/* Architecture Insight Note */}
            <div className={`border p-3 rounded-lg flex items-start gap-2.5 ${
              isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
            }`}>
              <Zap className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className={`text-xs font-bold block mb-0.5 ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>
                  Server-Centric Execution Insight:
                </span>
                <p className="text-xs leading-relaxed opacity-90">
                  {currentStep.codeSnippet.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NETWORK & PACKET PROTOCOL */}
        {activeTab === 'network' && (
          <div className="space-y-3">
            <div className={`grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-lg border ${
              isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <div>
                <span className="text-slate-400 block text-[10px]">PROTOCOL & METHOD</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {currentStep.networkDetails.protocol} · {currentStep.networkDetails.method}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">STATUS CODE</span>
                <span className="text-sky-600 dark:text-cyan-400 font-bold">
                  {currentStep.networkDetails.status} OK
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">RESOURCE TARGET URL</span>
                <span className={`break-all font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {currentStep.networkDetails.url}
                </span>
              </div>
            </div>

            {/* Headers List */}
            <div className={`rounded-lg border p-3 ${
              isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-950 border-slate-800'
            }`}>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-2 ${
                isLight ? 'text-slate-700' : 'text-slate-400'
              }`}>
                HTTP Headers
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {Object.entries(currentStep.networkDetails.headers).map(([key, val]) => (
                  <div key={key} className={`flex items-start justify-between gap-2 border-b pb-1 ${
                    isLight ? 'border-slate-200' : 'border-slate-800/40'
                  }`}>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">{key}:</span>
                    <span className={isLight ? 'text-slate-800 text-right' : 'text-slate-300 text-right'}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badge */}
            <div className={`p-3 rounded-lg border flex items-center gap-2.5 ${
              isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-900/80 border-slate-800'
            }`}>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div className="text-xs">
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Zero Client Exposure:</span>
                <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Database credentials & internal auth salts never leave the datacenter mesh.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SERVER STATE & SESSIONS */}
        {activeTab === 'state' && (
          <div className="space-y-3">
            {currentStep.serverStateDiff ? (
              <div className={`rounded-lg border p-3 space-y-3 ${
                isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                    <Database className="w-3.5 h-3.5" />
                    Action: {currentStep.serverStateDiff.action}
                  </span>
                  <span className={`px-2 py-0.5 rounded border font-bold ${
                    isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    State Synchronized
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className={`p-2.5 rounded border ${
                    isLight ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-red-950/20 border-red-900/40 text-red-300'
                  }`}>
                    <span className="text-[10px] block font-bold opacity-80">PREVIOUS STATE:</span>
                    {currentStep.serverStateDiff.previousState}
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className={`p-2.5 rounded border ${
                    isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                  }`}>
                    <span className="text-[10px] block font-bold opacity-80">UPDATED SERVER STATE:</span>
                    {currentStep.serverStateDiff.newState}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-4 rounded-lg border text-center text-xs ${
                isLight ? 'bg-white border-slate-300 text-slate-600' : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}>
                <p>Read-only query step. No persistent server state mutation occurred.</p>
              </div>
            )}

            {/* Client Hydration Status */}
            <div className={`rounded-lg border p-3 text-xs ${
              isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-950 border-slate-800'
            }`}>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-2 ${
                isLight ? 'text-slate-700' : 'text-slate-400'
              }`}>
                Client DOM Painting Status
              </span>
              <div className={`flex items-center justify-between mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                <span>Hydration Requirement:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  0 KB (No Hydration Waterfall)
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Because the server compiled the final semantic markup, the browser does not need to re-render or rehydrate a virtual DOM tree.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
