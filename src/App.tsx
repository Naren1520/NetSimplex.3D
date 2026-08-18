import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeaderNav, ActiveTab } from './components/HeaderNav';
import { ThreeTopologyScene } from './components/ThreeTopologyScene';
import { SimulationControls } from './components/SimulationControls';
import { ExecutionDebugger } from './components/ExecutionDebugger';
import { VirtualClientBrowser } from './components/VirtualClientBrowser';
import { ServerCentricComparison } from './components/ServerCentricComparison';
import { ArchitectureDeepDive } from './components/ArchitectureDeepDive';
import { ArchitecturalNotes } from './components/ArchitecturalNotes';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { LandingPage } from './components/LandingPage';
import { LoaderScreen } from './components/LoaderScreen';
import { INITIAL_SYSTEM_NODES, SIMULATION_SCENARIOS } from './data/simulationData';
import { ICN_SYSTEM_NODES, ICN_SIMULATION_SCENARIOS } from './data/informationCentricData';
import { ArchitectureMode, ArchitectureNode, DataPacket, ScenarioDefinition } from './types';
import { useTheme } from './context/ThemeContext';

export default function App() {
  // Navigation View: 'initial-boot' (3s cold start) | 'landing' | 'loading' | 'simulation'
  const [currentView, setCurrentView] = useState<'initial-boot' | 'landing' | 'loading' | 'simulation'>('initial-boot');
  const [architectureMode, setArchitectureMode] = useState<ArchitectureMode>('server-centric');
  const [activeTab, setActiveTab] = useState<ActiveTab>('topology');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Nodes & Selected Node for Inspector
  const [nodes, setNodes] = useState<ArchitectureNode[]>(INITIAL_SYSTEM_NODES);
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);

  // Scenario & Step State
  const [currentScenario, setCurrentScenario] = useState<ScenarioDefinition>(SIMULATION_SCENARIOS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [trafficRate, setTrafficRate] = useState(25);

  // Chaos Modes
  const [chaosMode, setChaosMode] = useState({
    dbLatency: false,
    cacheMiss: false,
    slowNetwork: false,
  });

  // Packets in Flight for 3D Animation
  const [packets, setPackets] = useState<DataPacket[]>([]);
  const packetIdCounterRef = useRef(1);

  // Virtual Storefront State
  const [cartCount, setCartCount] = useState(2);
  const [lastActionMessage, setLastActionMessage] = useState<string>('Welcome to the Server-Centric Simulation.');

  // System Health & Telemetry State
  const [totalRequests, setTotalRequests] = useState(1420);
  const [avgLatencyMs, setAvgLatencyMs] = useState(14);
  const [cacheHitRatio, setCacheHitRatio] = useState(94.8);

  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Handle Architecture Selection from Landing Page
  const handleSelectArchitecture = (mode: ArchitectureMode) => {
    setArchitectureMode(mode);
    setCurrentView('loading');

    // Configure the appropriate initial state for the selected mode
    if (mode === 'server-centric') {
      setNodes(INITIAL_SYSTEM_NODES);
      setCurrentScenario(SIMULATION_SCENARIOS[0]);
      setAvgLatencyMs(14);
      setCacheHitRatio(94.8);
      setLastActionMessage('Server-Centric Engine Initialized: Server-Authoritative execution.');
    } else {
      setNodes(ICN_SYSTEM_NODES);
      setCurrentScenario(ICN_SIMULATION_SCENARIOS[0]);
      setAvgLatencyMs(0.8);
      setCacheHitRatio(98.2);
      setLastActionMessage('Information-Centric (NDN) Mesh Initialized: Content-based routing active.');
    }
    setCurrentStepIndex(0);
  };

  // Switch architecture from Header Nav or anywhere inside simulation
  const handleSwitchArchitectureMode = (mode: ArchitectureMode) => {
    handleSelectArchitecture(mode);
  };

  // Return to Landing Page
  const handleNavigateHome = () => {
    setCurrentView('landing');
  };

  // Restart Entire Studio (Triggers 3-second Initial Boot Loader)
  const handleRestartBoot = useCallback(() => {
    setCurrentView('initial-boot');
    setCurrentStepIndex(0);
    setPackets([]);
    setCartCount(2);
    setLastActionMessage('Rebooting Paradigm Studio Simulation Engine...');
  }, []);

  // Complete Initial Boot Loader Transition (Landing Page Entry)
  const handleInitialBootComplete = useCallback(() => {
    setCurrentView('landing');
  }, []);

  // Complete Architecture Preparation Loader Transition
  const handleLoaderComplete = useCallback(() => {
    setCurrentView('simulation');
    setIsPlaying(true);
  }, []);

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Listen for fullscreen change events (e.g. Esc key)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const activeScenarios = architectureMode === 'server-centric' ? SIMULATION_SCENARIOS : ICN_SIMULATION_SCENARIOS;
  const currentStep = currentScenario.steps[currentStepIndex] || currentScenario.steps[0] || {
    id: 'fallback',
    stepNumber: 1,
    title: 'Initializing Simulation',
    description: 'System preparing...',
    activeNodeId: 'client',
    fromNodeId: 'client',
    toNodeId: 'server',
    packetType: 'HTTP_GET',
    durationMs: 1000,
    serverCentricAdvantage: 'High-speed processing',
    clientVisualState: {
      browserUrl: 'localhost:3000',
      browserTitle: 'Ready',
      renderedHtmlSnippet: '<div>Ready</div>',
    },
    codeSnippet: '// Initializing',
  };
  const activeNodeId = currentStep.activeNodeId;

  // Step Progress Advancement Timer
  useEffect(() => {
    if (!isPlaying || currentView !== 'simulation') return;

    const baseDuration = currentStep.durationMs || 1000;
    const adjustedDuration = Math.max(250, baseDuration / playbackSpeed);

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev < currentScenario.steps.length - 1) {
          return prev + 1;
        } else {
          // Loop seamlessly
          return 0;
        }
      });
    }, adjustedDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, currentScenario, playbackSpeed, currentStep, currentView]);

  // Dispatch 3D Data Packets whenever step changes
  useEffect(() => {
    if (currentView !== 'simulation') return;

    const newPacket: DataPacket = {
      id: `p_${packetIdCounterRef.current++}`,
      type: currentStep.packetType,
      fromNodeId: currentStep.fromNodeId,
      toNodeId: currentStep.toNodeId,
      progress: 0,
      speed: 1.2 * playbackSpeed,
      label: currentStep.packetType,
      sizeBytes: currentStep.packetType === 'HTML_STREAM' ? 14200 : currentStep.packetType === 'NAMED_DATA_PACKET' ? 4096 : 256,
      color: getNodeColor(currentStep.fromNodeId),
      payloadPreview: currentStep.title,
      stepIndex: currentStepIndex,
      timestamp: Date.now(),
    };

    setPackets((prev) => [...prev.slice(-12), newPacket]);
    setTotalRequests((prev) => prev + 1);

    // Update node metrics dynamically
    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        if (n.id === currentStep.activeNodeId) {
          return {
            ...n,
            status: 'processing',
            metrics: {
              ...n.metrics,
              requestCount: n.metrics.requestCount + 1,
              cpuPercent: Math.min(95, Math.max(5, n.metrics.cpuPercent + Math.floor(Math.random() * 6 - 2))),
            },
          };
        }
        return { ...n, status: 'idle' };
      })
    );
  }, [currentStepIndex, currentScenario, currentView]);

  // Animate Packets Progress smoothly (60 FPS)
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const updatePacketPositions = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setPackets((prev) =>
        prev
          .map((p) => ({
            ...p,
            progress: p.progress + delta * p.speed * 0.9,
          }))
          .filter((p) => p.progress < 1.05)
      );

      animFrame = requestAnimationFrame(updatePacketPositions);
    };

    animFrame = requestAnimationFrame(updatePacketPositions);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Ambient Background Traffic Generator based on Traffic Rate Slider
  useEffect(() => {
    if (trafficRate <= 0 || currentView !== 'simulation') return;
    const intervalMs = Math.max(150, 4000 / trafficRate);

    const interval = setInterval(() => {
      const connections: Array<[string, string, string]> =
        architectureMode === 'server-centric'
          ? [
              ['client', 'edge', '#38bdf8'],
              ['edge', 'server', '#a855f7'],
              ['server', 'cache', '#f59e0b'],
              ['server', 'database', '#3b82f6'],
            ]
          : [
              ['consumer', 'router', '#06b6d4'],
              ['router', 'in_network_cache', '#6366f1'],
              ['router', 'producer', '#a855f7'],
              ['router', 'ipfs_mesh', '#ec4899'],
            ];

      const randomConn = connections[Math.floor(Math.random() * connections.length)];

      const bgPacket: DataPacket = {
        id: `bg_${packetIdCounterRef.current++}`,
        type: architectureMode === 'server-centric' ? 'HTTP_GET' : 'INTEREST_PACKET',
        fromNodeId: randomConn[0],
        toNodeId: randomConn[1],
        progress: 0,
        speed: 1.5,
        label: architectureMode === 'server-centric' ? 'Ambient HTTP' : 'Ambient Interest',
        sizeBytes: 128,
        color: randomConn[2],
        payloadPreview: architectureMode === 'server-centric' ? 'GET /status' : '/prefix/ambient/packet',
        timestamp: Date.now(),
      };

      setPackets((prev) => [...prev.slice(-15), bgPacket]);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [trafficRate, currentView, architectureMode]);

  // Helper for Node Colors
  const getNodeColor = (nodeId: string) => {
    switch (nodeId) {
      case 'client':
      case 'consumer':
        return '#38bdf8';
      case 'edge':
      case 'router':
        return '#a855f7';
      case 'server':
        return '#10b981';
      case 'cache':
      case 'in_network_cache':
        return '#f59e0b';
      case 'database':
      case 'key_authority':
        return '#3b82f6';
      case 'worker':
      case 'ipfs_mesh':
        return '#ec4899';
      case 'producer':
        return '#8b5cf6';
      default:
        return '#10b981';
    }
  };

  // Switch Scenario Handler
  const handleSelectScenario = (scenario: ScenarioDefinition) => {
    setCurrentScenario(scenario);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setLastActionMessage(`Simulating: ${scenario.name}`);
  };

  // Next / Prev Step Handlers
  const handleNextStep = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev < currentScenario.steps.length - 1 ? prev + 1 : 0));
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  // Chaos Mode Toggles
  const handleToggleChaos = (key: 'dbLatency' | 'cacheMiss' | 'slowNetwork') => {
    setChaosMode((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (updated.dbLatency) {
        setAvgLatencyMs(260);
        setLastActionMessage('⚠️ Injected +250ms Database Latency Spikes!');
      } else {
        setAvgLatencyMs(architectureMode === 'server-centric' ? 14 : 0.8);
      }
      return updated;
    });
  };

  // Manual Trigger Actions
  const handleTriggerManualAction = (actionType: string) => {
    if (architectureMode === 'server-centric') {
      if (actionType === 'GET_CATALOG' || actionType === 'SSR_NAV') {
        const sc = SIMULATION_SCENARIOS.find((s) => s.id === 'scenario_ssr_nav') || SIMULATION_SCENARIOS[0];
        handleSelectScenario(sc);
        setLastActionMessage('Dispatched SSR page request GET /products (1 roundtrip)');
      } else if (actionType === 'POST_MUTATION') {
        const sc = SIMULATION_SCENARIOS.find((s) => s.id === 'scenario_server_action') || SIMULATION_SCENARIOS[1];
        handleSelectScenario(sc);
        setCartCount((c) => c + 1);
        setLastActionMessage('Server Action executed: Added item to cart & morphed DOM!');
      } else if (actionType === 'HTMX_SEARCH') {
        const sc = SIMULATION_SCENARIOS.find((s) => s.id === 'scenario_htmx_search') || SIMULATION_SCENARIOS[2];
        handleSelectScenario(sc);
        setLastActionMessage('HTMX partial HTML fragment swap executed');
      } else if (actionType === 'SSE_PUSH') {
        const sc = SIMULATION_SCENARIOS.find((s) => s.id === 'scenario_realtime_sse') || SIMULATION_SCENARIOS[3];
        handleSelectScenario(sc);
        setLastActionMessage('⚡ Realtime SSE State pushed to thin client!');
      }
    } else {
      // Information-Centric Actions
      if (actionType === 'GET_CATALOG' || actionType === 'SSR_NAV') {
        const sc = ICN_SIMULATION_SCENARIOS[0];
        handleSelectScenario(sc);
        setLastActionMessage('Broadcasted NDN Interest /catalog/items/101');
      } else if (actionType === 'POST_MUTATION') {
        const sc = ICN_SIMULATION_SCENARIOS[1];
        handleSelectScenario(sc);
        setLastActionMessage('Requested Content-Addressed CID bafy... with cryptographic verification');
      } else {
        const sc = ICN_SIMULATION_SCENARIOS[2];
        handleSelectScenario(sc);
        setLastActionMessage('Aggregated multi-consumer Interests in PIT table');
      }
    }
  };

  // VIEW 0: 3-SECOND INITIAL COLD BOOT LOADER (RUNS ON FIRST ENTRY & RESTART)
  if (currentView === 'initial-boot') {
    return (
      <LoaderScreen
        durationMs={3000}
        onComplete={handleInitialBootComplete}
        modeTitle="PARADIGM MATRIX · 3D BOOT SEQUENCE"
        subtitle="Calibrating dual-architecture state engines, 3D WebGL topology shaders, and interactive systems laboratories."
      />
    );
  }

  // VIEW 1: LANDING PAGE
  if (currentView === 'landing') {
    return (
      <LandingPage
        onSelectMode={handleSelectArchitecture}
        onRestart={handleRestartBoot}
      />
    );
  }

  // VIEW 2: 3D ARCHITECTURE TRANSITION LOADER
  if (currentView === 'loading') {
    return (
      <LoaderScreen
        durationMs={2000}
        architectureMode={architectureMode}
        onComplete={handleLoaderComplete}
        modeTitle={
          architectureMode === 'server-centric'
            ? 'SERVER-CENTRIC ENGINE · CALIBRATION'
            : 'INFORMATION-CENTRIC MESH · CALIBRATION'
        }
        subtitle={
          architectureMode === 'server-centric'
            ? 'Spinning up Authoritative SSR / RSC instances, Edge Proxy and Database Clusters...'
            : 'Synthesizing Content Store, PIT state matrices, and Merkle DAG hash verifiers...'
        }
      />
    );
  }

  // VIEW 3: FULL 3D INTERACTIVE SIMULATION & COMPARISON LAB
  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    } font-sans transition-colors`}>
      {/* Top Header & Telemetry Bar */}
      <HeaderNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        currentMode={architectureMode}
        onSwitchMode={handleSwitchArchitectureMode}
        onNavigateHome={handleNavigateHome}
        onRestart={handleRestartBoot}
        totalRequests={totalRequests}
        avgLatencyMs={avgLatencyMs}
        cacheHitRatio={cacheHitRatio}
        serverHealth={chaosMode.dbLatency ? 'degraded' : 'optimal'}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Tab Content */}
      <main className="flex-1 overflow-hidden relative">
        {/* VIEW 1: 3D TOPOLOGY & INTERACTIVE SIMULATION */}
        {activeTab === 'topology' && (
          <div className="h-full w-full flex flex-col">
            {/* Split Screen: 3D Scene (Top/Left) + Debugger & Virtual Browser (Bottom/Right) */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 relative">
              {/* 3D WebGL Topology Canvas (Takes 7 cols on desktop) */}
              <div className="lg:col-span-7 h-full w-full relative min-h-[340px]">
                <ThreeTopologyScene
                  nodes={nodes}
                  activeNodeId={activeNodeId}
                  packets={packets}
                  onSelectNode={setSelectedNode}
                  isPaused={!isPlaying}
                  simulationSpeed={playbackSpeed}
                />
              </div>

              {/* Inspector & Virtual Client Browser (Takes 5 cols on desktop) */}
              <div className={`lg:col-span-5 h-full flex flex-col p-3 gap-3 overflow-hidden border-l ${
                isLight ? 'bg-slate-200/60 border-slate-300' : 'bg-slate-950/70 border-slate-800'
              }`}>
                {/* Virtual Browser Viewport */}
                <div className="flex-1 min-h-0">
                  <VirtualClientBrowser
                    currentStep={currentStep}
                    onTriggerAction={handleTriggerManualAction}
                    cartCount={cartCount}
                    lastActionMessage={lastActionMessage}
                  />
                </div>

                {/* Step-by-Step Code & Execution Debugger */}
                <div className="flex-1 min-h-0">
                  <ExecutionDebugger
                    currentStep={currentStep}
                    currentStepIndex={currentStepIndex}
                    totalSteps={currentScenario.steps.length}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <SimulationControls
              scenarios={activeScenarios}
              currentScenario={currentScenario}
              onSelectScenario={handleSelectScenario}
              currentStepIndex={currentStepIndex}
              totalSteps={currentScenario.steps.length}
              currentStep={currentStep}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
              onReset={handleReset}
              playbackSpeed={playbackSpeed}
              onChangeSpeed={setPlaybackSpeed}
              trafficRate={trafficRate}
              onChangeTrafficRate={setTrafficRate}
              chaosMode={chaosMode}
              onToggleChaos={handleToggleChaos}
              onTriggerManualAction={handleTriggerManualAction}
            />
          </div>
        )}

        {/* VIEW 2: ARCHITECTURAL PARADIGM COMPARISON LAB */}
        {activeTab === 'comparison' && (
          <div className="h-full w-full overflow-y-auto">
            <ServerCentricComparison currentMode={architectureMode} />
          </div>
        )}

        {/* VIEW 3: CONCEPT DEEP DIVE & QUIZ LAB */}
        {activeTab === 'masterclass' && (
          <div className="h-full w-full overflow-y-auto">
            <ArchitectureDeepDive currentMode={architectureMode} />
          </div>
        )}

        {/* VIEW 4: COMPREHENSIVE STUDY NOTES & BLUEPRINT */}
        {activeTab === 'notes' && (
          <div className="h-full w-full overflow-y-auto">
            <ArchitecturalNotes currentMode={architectureMode} />
          </div>
        )}
      </main>

      {/* Interactive Node Telemetry Inspector Modal */}
      <NodeInspectorModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
