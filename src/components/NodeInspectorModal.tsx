import React from 'react';
import {
  X,
  Cpu,
  HardDrive,
  Clock,
  Activity,
  FileCode,
  Zap,
} from 'lucide-react';
import { ArchitectureNode } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NodeInspectorModalProps {
  node: ArchitectureNode | null;
  onClose: () => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({
  node,
  onClose,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col ${
        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700/80 text-slate-100'
      }`}>
        {/* Modal Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full shadow-lg"
              style={{ backgroundColor: node.color }}
            />
            <div>
              <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{node.name}</h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{node.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-sans text-xs">
          {/* Live Telemetry Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-1.5 text-slate-400 mb-1 text-[10px]">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>LATENCY</span>
              </div>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {node.metrics.latencyMs}ms
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-1.5 text-slate-400 mb-1 text-[10px]">
                <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                <span>CPU LOAD</span>
              </div>
              <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">
                {node.metrics.cpuPercent}%
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-1.5 text-slate-400 mb-1 text-[10px]">
                <HardDrive className="w-3.5 h-3.5 text-amber-500" />
                <span>MEMORY</span>
              </div>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                {node.metrics.memoryMb} MB
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-1.5 text-slate-400 mb-1 text-[10px]">
                <Activity className="w-3.5 h-3.5 text-purple-500" />
                <span>REQUESTS</span>
              </div>
              <span className="text-base font-bold text-purple-600 dark:text-purple-400">
                {node.metrics.requestCount}
              </span>
            </div>
          </div>

          {/* Role & Tech Stack */}
          <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
            <h4 className={`font-bold text-xs uppercase font-mono tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Role & Technology Stack
            </h4>
            <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{node.details.role}</p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
              <span className="text-slate-500">Tech Stack:</span>
              <span className={`px-2 py-0.5 rounded border font-semibold ${
                isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
              }`}>
                {node.details.techStack}
              </span>
            </div>
          </div>

          {/* Key Responsibilities Checklist */}
          <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
            <h4 className={`font-bold text-xs uppercase font-mono tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Core Responsibilities
            </h4>
            <ul className="space-y-1.5">
              {node.details.keyResponsibilities.map((item, idx) => (
                <li key={idx} className={`flex items-start gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Production Configuration Snippet */}
          <div className="space-y-1.5">
            <h4 className={`font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              <FileCode className="w-3.5 h-3.5 text-cyan-500" />
              <span>Production Configuration / Code</span>
            </h4>
            <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
              <code>{node.details.sampleConfig}</code>
            </pre>
          </div>

          {/* Server-Centric Advantage */}
          <div className={`border p-3.5 rounded-xl flex items-start gap-2.5 ${
            isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
          }`}>
            <Zap className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className={`font-bold block mb-0.5 ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>
                Server-Centric Architectural Advantage:
              </span>
              <p className="leading-relaxed text-xs opacity-90">
                {node.details.serverCentricAdvantage}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`px-5 py-3 border-t flex justify-end ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
