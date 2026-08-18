import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Gauge,
  Flame,
  Zap,
  Radio,
  Search,
  Globe,
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import { ScenarioDefinition, SimulationStep } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SimulationControlsProps {
  scenarios: ScenarioDefinition[];
  currentScenario: ScenarioDefinition;
  onSelectScenario: (scenario: ScenarioDefinition) => void;
  currentStepIndex: number;
  totalSteps: number;
  currentStep: SimulationStep;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  trafficRate: number;
  onChangeTrafficRate: (rate: number) => void;
  chaosMode: {
    dbLatency: boolean;
    cacheMiss: boolean;
    slowNetwork: boolean;
  };
  onToggleChaos: (key: 'dbLatency' | 'cacheMiss' | 'slowNetwork') => void;
  onTriggerManualAction: (actionType: string) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  scenarios,
  currentScenario,
  onSelectScenario,
  currentStepIndex,
  totalSteps,
  currentStep,
  isPlaying,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onReset,
  playbackSpeed,
  onChangeSpeed,
  trafficRate,
  onChangeTrafficRate,
  chaosMode,
  onToggleChaos,
  onTriggerManualAction,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-4 h-4 text-sky-500" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-emerald-500" />;
      case 'Search':
        return <Search className="w-4 h-4 text-amber-500" />;
      case 'Radio':
        return <Radio className="w-4 h-4 text-pink-500" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-purple-500" />;
      default:
        return <Flame className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className={`border-t backdrop-blur-xl p-3 sm:p-4 flex flex-col gap-3 shadow-2xl transition-colors ${
      isLight ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-slate-100'
    }`}>
      {/* Top Row: Scenario Selector Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className={`text-[11px] font-mono uppercase tracking-wider mr-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Workflows:
          </span>
          {scenarios.map((sc) => {
            const isSelected = sc.id === currentScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? isLight
                      ? 'bg-slate-100 text-slate-900 border-2 border-emerald-500 shadow-sm'
                      : 'bg-slate-800 text-slate-100 border border-slate-600 shadow-md ring-1 ring-emerald-500/40'
                    : isLight
                    ? 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                    : 'bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                {getScenarioIcon(sc.icon)}
                <span>{sc.shortName}</span>
                <span className="text-[10px] font-mono opacity-60 hidden sm:inline">
                  [{sc.category}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Trigger Actions */}
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => onTriggerManualAction('GET_CATALOG')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-mono transition-colors font-semibold ${
              isLight
                ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-300'
                : 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border-sky-500/30'
            }`}
            title="Send Instant HTTP GET /products"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>GET /catalog</span>
          </button>
          <button
            onClick={() => onTriggerManualAction('POST_MUTATION')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-mono transition-colors font-semibold ${
              isLight
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
            title="Submit Instant Server Action POST /cart/add"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>POST /cart</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Step Progress & Stepper Debugger */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-3 items-center p-3 rounded-xl border ${
        isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950/60 border-slate-800/80'
      }`}>
        {/* Playback Controls & Step Indicator */}
        <div className="lg:col-span-4 flex items-center gap-2">
          <button
            onClick={onReset}
            className={`p-2 rounded-lg border transition-colors ${
              isLight ? 'bg-white hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/80'
            }`}
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className={`p-2 rounded-lg border transition-colors disabled:opacity-40 ${
              isLight ? 'bg-white hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/80'
            }`}
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs shadow-lg transition-all ${
              isPlaying
                ? isLight
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : isLight
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>SIMULATE</span>
              </>
            )}
          </button>
          <button
            onClick={onNextStep}
            disabled={currentStepIndex >= totalSteps - 1 && !isPlaying}
            className={`p-2 rounded-lg border transition-colors disabled:opacity-40 ${
              isLight ? 'bg-white hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/80'
            }`}
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className={`flex items-center gap-1 ml-2 px-2 py-1 rounded-lg border ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <span className="text-[10px] font-mono text-slate-400">Speed:</span>
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-emerald-500 text-white dark:text-slate-950'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Details Bar */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Step {currentStepIndex + 1} of {totalSteps}: {currentStep.title}
            </span>
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded border font-bold ${
              isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {currentStep.packetType}
            </span>
          </div>
          {/* Progress Track */}
          <div className={`w-full h-2 rounded-full overflow-hidden flex gap-1 p-0.5 ${isLight ? 'bg-slate-300' : 'bg-slate-800'}`}>
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-full flex-1 rounded-full transition-all duration-300 ${
                  idx === currentStepIndex
                    ? 'bg-emerald-500 shadow-sm shadow-emerald-500'
                    : idx < currentStepIndex
                    ? 'bg-emerald-700/80'
                    : isLight ? 'bg-slate-400/40' : 'bg-slate-700/50'
                }`}
              />
            ))}
          </div>
          <p className={`text-[11px] mt-1 line-clamp-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {currentStep.description}
          </p>
        </div>

        {/* Traffic Generator & Chaos Simulator Controls */}
        <div className="lg:col-span-3 flex items-center justify-end gap-3">
          {/* Traffic Simulator Slider */}
          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-1.5 text-[11px] font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <Gauge className="w-3.5 h-3.5 text-cyan-500" />
              <span>Load: {trafficRate} req/s</span>
            </div>
            <input
              type="range"
              min="1"
              max="150"
              value={trafficRate}
              onChange={(e) => onChangeTrafficRate(parseInt(e.target.value))}
              className="w-28 accent-emerald-500 cursor-pointer h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg"
            />
          </div>

          {/* Chaos Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleChaos('dbLatency')}
              className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
                chaosMode.dbLatency
                  ? 'bg-red-500/20 border-red-500/60 text-red-500 ring-1 ring-red-500/40 font-bold'
                  : isLight ? 'bg-white border-slate-300 text-slate-500 hover:text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Inject +250ms Database Latency Spikes"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleChaos('cacheMiss')}
              className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
                chaosMode.cacheMiss
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-500 ring-1 ring-amber-500/40 font-bold'
                  : isLight ? 'bg-white border-slate-300 text-slate-500 hover:text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Simulate 100% Cache Cold Misses"
            >
              <Cpu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
