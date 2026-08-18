import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Shield,
  Layers,
  Zap,
  Globe,
  Terminal,
  RotateCcw,
  Award,
  Cpu,
  Server,
  Lock,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/simulationData';
import { ICN_QUIZ_QUESTIONS } from '../data/informationCentricData';
import { useTheme } from '../context/ThemeContext';
import { ArchitectureMode } from '../types';

interface DeepDiveProps {
  currentMode?: ArchitectureMode;
}

export const ArchitectureDeepDive: React.FC<DeepDiveProps> = ({ currentMode = 'server-centric' }) => {
  const [activeTab, setActiveTab] = useState<ArchitectureMode>(currentMode);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const isServer = activeTab === 'server-centric';
  const questions = isServer ? QUIZ_QUESTIONS : ICN_QUIZ_QUESTIONS;

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    const score = calculateScore();
    if (score >= 4) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleSwitchTab = (tab: ArchitectureMode) => {
    setActiveTab(tab);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8 select-text transition-colors">
      {/* Paradigm Switcher Header */}
      <div className={`p-4 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isLight ? 'bg-white/90 border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <BookOpen className={`w-5 h-5 ${isServer ? 'text-emerald-500' : 'text-cyan-400'}`} />
          <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Masterclass & Certification Exam
          </h2>
        </div>

        <div className={`flex items-center gap-1 p-1 rounded-xl border ${
          isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
        }`}>
          <button
            onClick={() => handleSwitchTab('server-centric')}
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
            onClick={() => handleSwitchTab('information-centric')}
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
      </div>

      {/* Introduction Hero Card */}
      {isServer ? (
        <div className={`rounded-2xl p-6 shadow-2xl backdrop-blur-md border ${
          isLight ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-slate-100'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                The Server-Centric Architecture Masterclass
              </h2>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                SSR · RSC · Server Actions · Hypermedia · Zero-Leak Security
              </span>
            </div>
          </div>
          <p className={`text-sm leading-relaxed mb-6 mt-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Server-Centric architecture is a software design paradigm where the backend server remains the authoritative source of truth for data mutations, security enforcement, business workflows, and user interface composition.
          </p>

          {/* 4 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-2 mb-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>1. Zero Client Hydration Waterfall</span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Renders pure semantic HTML at the edge or origin server. Eliminates the multi-megabyte JavaScript bundles that cause device lag on budget mobile phones.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-2 mb-1.5 text-purple-600 dark:text-purple-400 font-bold text-sm">
                <Shield className="w-4 h-4" />
                <span>2. Air-Gapped Security & Zero Secret Leakage</span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Private API keys, database credentials, and algorithmic IP live strictly on the server and are physically impossible to extract from browser DevTools.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-2 mb-1.5 text-sky-600 dark:text-sky-400 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <span>3. Hypermedia & Server-Driven State</span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                The server returns HTML fragments directly representing updated UI states. Eliminates complex client-side state stores (Redux/Zustand) and out-of-sync cache bugs.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-2 mb-1.5 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <Globe className="w-4 h-4" />
                <span>4. 1ms Colocated Data Layer Queries</span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Database and cache lookups execute over high-speed intra-datacenter networks with sub-millisecond latencies, avoiding multiple round-trips over high-latency cellular networks.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`rounded-2xl p-6 shadow-2xl backdrop-blur-md border ${
          isLight ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-slate-100'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                The Information-Centric Networking (ICN/NDN) Masterclass
              </h2>
              <span className="text-xs text-cyan-400 font-mono font-bold">
                Named Data Networking · Content Stores (CS) · PIT · FIB · Asymmetric Merkle Proofs
              </span>
            </div>
          </div>
          <p className={`text-sm leading-relaxed mb-6 mt-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Information-Centric Networking fundamentally reimagines network architecture: instead of connecting to a specific host IP (WHERE), the network routes by immutable, cryptographically verifiable content names (WHAT).
          </p>

          {/* 4 Core ICN Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-2 mb-1.5 text-cyan-400 font-bold text-sm">
                <Share2 className="w-4 h-4" />
                <span>1. Universal In-Network Caching (CS)</span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Every router holds a Content Store. The nearest node with the data responds instantly, cutting origin server traffic by 90%+ without separate CDN contracts.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-2 mb-1.5 text-purple-400 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>2. Securing the Data, Not the Pipe</span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                In traditional IP, TLS only protects the point-to-point tunnel. In ICN/NDN, each packet is cryptographically signed at origin, making it safe to fetch from untrusted peers.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>3. Native Multicast & PIT Aggregation</span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                When 10,000 users stream the same live event, Pending Interest Tables (PIT) collapse matching requests into a single upstream request, saving massive bandwidth.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex items-center gap-2 mb-1.5 text-amber-400 font-bold text-sm">
                <Globe className="w-4 h-4" />
                <span>4. Disaster & Partition Resilience</span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                If submarine cables or central datacenters go offline, local mesh networks continue serving cached, signed knowledge without central server DNS resolution.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Certification Quiz */}
      <div className={`rounded-2xl p-6 shadow-2xl backdrop-blur-md border ${
        isLight ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-slate-100'
      }`}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${isServer ? 'text-emerald-500' : 'text-cyan-400'}`} />
              <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {isServer ? 'Server-Centric Mastery Exam' : 'Information-Centric (NDN) Exam'}
              </h3>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Test your deep comprehension of {isServer ? 'server-authoritative lifecycles' : 'named-data routing and cryptographic integrity'}.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-500">Progress: </span>
            <span className={`text-sm font-bold font-mono ${isServer ? 'text-emerald-500' : 'text-cyan-400'}`}>
              {answeredCount}/{questions.length} Answered
            </span>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q, qIndex) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    isServer ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    Q{qIndex + 1}
                  </span>
                  <h4 className={`text-sm font-semibold leading-snug ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {q.question}
                  </h4>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    let optionStyle = isLight
                      ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                      : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300';

                    if (showResults) {
                      if (optIdx === q.correctIndex) {
                        optionStyle = 'bg-emerald-500/20 border-emerald-500/80 text-emerald-300 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-500/20 border-rose-500/80 text-rose-300';
                      }
                    } else if (isSelected) {
                      optionStyle = isServer
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-semibold'
                        : 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={showResults}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {showResults && optIdx === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {showResults && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {showResults && (
                  <div className={`mt-3 p-3 rounded-xl text-xs font-mono border ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                  }`}>
                    <span className="font-bold block mb-1">
                      {isCorrect ? '✓ Correct!' : '✗ Explanation:'}
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit & Reset Bar */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {showResults && (
              <div className="flex items-center gap-2">
                <Award className={`w-5 h-5 ${calculateScore() >= 4 ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                <span className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  Your Score: {calculateScore()} / {questions.length} (
                  {Math.round((calculateScore() / questions.length) * 100)}%)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {showResults ? (
              <button
                onClick={handleResetQuiz}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  isLight
                    ? 'bg-slate-200 hover:bg-slate-300 border-slate-400 text-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Exam</span>
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={answeredCount === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                  answeredCount === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : isServer
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Grade My Exam ({answeredCount}/{questions.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
