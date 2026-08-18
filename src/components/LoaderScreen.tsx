import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, ShieldCheck, Zap, Sparkles, Database, Layers, Server, Activity, Terminal } from 'lucide-react';
import { ArchitectureMode } from '../types';

interface LoaderScreenProps {
  onComplete: () => void;
  architectureMode?: ArchitectureMode;
  durationMs?: number;
  modeTitle?: string;
  subtitle?: string;
}

const DEFAULT_BOOT_STAGES = [
  { threshold: 15, text: 'Allocating 3D WebGL Shaders & GPU Matrix Buffers...', icon: 'cpu' },
  { threshold: 35, text: 'Compiling Server-Centric SSR, RSC & Edge Cache Modules...', icon: 'layers' },
  { threshold: 60, text: 'Synthesizing Information-Centric Name Routers & PIT Engines...', icon: 'database' },
  { threshold: 85, text: 'Calibrating In-Network Content Store & Merkle DAG Verifiers...', icon: 'shield' },
  { threshold: 98, text: 'Establishing Zero-Hydration Runtime Mesh...', icon: 'zap' },
  { threshold: 100, text: 'System Operational. Launching Paradigm Studio.', icon: 'sparkles' },
];

const SERVER_BOOT_STAGES = [
  { threshold: 20, text: 'Connecting Thin Client Viewport to 100Gbps Edge CDN...', icon: 'cpu' },
  { threshold: 45, text: 'Spinning up Authoritative Node.js SSR & Server Action Workers...', icon: 'server' },
  { threshold: 75, text: 'Mounting Colocated LAN PostgreSQL & Redis Memory Clusters...', icon: 'database' },
  { threshold: 95, text: 'Enforcing Zero-Secret Browser Air-Gap Security Boundary...', icon: 'shield' },
  { threshold: 100, text: 'Server-Centric Engine Online. Entering Topology View.', icon: 'sparkles' },
];

const ICN_BOOT_STAGES = [
  { threshold: 20, text: 'Constructing Hierarchical Name Prefix Tree (/media/doc/v1)...', icon: 'cpu' },
  { threshold: 45, text: 'Initializing In-Network Content Store (CS) & PIT State Tables...', icon: 'layers' },
  { threshold: 70, text: 'Deploying Triple-Rack Enterprise Origin Signer Citadel...', icon: 'server' },
  { threshold: 95, text: 'Mounting Merkle DAG Hash Engine & Ed25519 Cryptographic Keys...', icon: 'shield' },
  { threshold: 100, text: 'Information-Centric Mesh Online. Entering Topology View.', icon: 'sparkles' },
];

export const LoaderScreen: React.FC<LoaderScreenProps> = ({
  onComplete,
  architectureMode,
  durationMs = 3000,
  modeTitle,
  subtitle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [remainingSec, setRemainingSec] = useState((durationMs / 1000).toFixed(1));
  const [currentStatus, setCurrentStatus] = useState('Initializing Architectural Simulation Engine...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const isServer = architectureMode === 'server-centric';
  const isICN = architectureMode === 'information-centric';

  const activeBootStages = isServer ? SERVER_BOOT_STAGES : isICN ? ICN_BOOT_STAGES : DEFAULT_BOOT_STAGES;

  // 3D Canvas Background Effect
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for rotating 3D architectural rings & particle cloud
    const loaderGroup = new THREE.Group();
    scene.add(loaderGroup);

    // Outer Ring
    const primaryColor = isServer ? 0x10b981 : isICN ? 0x06b6d4 : 0x10b981;
    const secondaryColor = isServer ? 0x34d399 : isICN ? 0xec4899 : 0x06b6d4;

    const ring1Geo = new THREE.TorusGeometry(8, 0.08, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: primaryColor, wireframe: true, transparent: true, opacity: 0.7 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    loaderGroup.add(ring1);

    // Middle Ring
    const ring2Geo = new THREE.TorusGeometry(6, 0.06, 16, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: secondaryColor, wireframe: true, transparent: true, opacity: 0.8 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    loaderGroup.add(ring2);

    // Inner Ring
    const ring3Geo = new THREE.TorusGeometry(4, 0.05, 16, 60);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.6 });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    loaderGroup.add(ring3);

    // Core Icosahedron Node
    const coreGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 0.7,
      wireframe: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    loaderGroup.add(core);

    // Particle Cloud
    const particleCount = 500;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 10 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Gradient particles
      const isAlt = Math.random() > 0.5;
      if (isServer) {
        colors[i * 3] = isAlt ? 0.06 : 0.2;
        colors[i * 3 + 1] = isAlt ? 0.72 : 0.82;
        colors[i * 3 + 2] = isAlt ? 0.5 : 0.6;
      } else if (isICN) {
        colors[i * 3] = isAlt ? 0.02 : 0.9;
        colors[i * 3 + 1] = isAlt ? 0.71 : 0.28;
        colors[i * 3 + 2] = isAlt ? 0.83 : 0.6;
      } else {
        colors[i * 3] = isAlt ? 0.02 : 0.06;
        colors[i * 3 + 1] = isAlt ? 0.71 : 0.72;
        colors[i * 3 + 2] = isAlt ? 0.83 : 0.5;
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Ambient & Point Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(primaryColor, 2.5, 50);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      ring1.rotation.x += 0.008;
      ring1.rotation.y += 0.012;

      ring2.rotation.y += 0.014;
      ring2.rotation.z += 0.009;

      ring3.rotation.x -= 0.012;
      ring3.rotation.z -= 0.01;

      core.rotation.y += 0.015;
      core.rotation.x += 0.01;

      particles.rotation.y += 0.002;
      particles.rotation.x += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isServer, isICN]);

  // Exact 3.0s Timer Ticker using high-precision performance.now()
  useEffect(() => {
    const totalDuration = Math.max(1000, durationMs);
    const startTime = performance.now();
    let hasEnded = false;

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progressFraction = Math.min(1, elapsed / totalDuration);
      const calculated = Math.min(100, Math.floor(progressFraction * 100));
      setProgress(calculated);

      const remain = Math.max(0, (totalDuration - elapsed) / 1000);
      setRemainingSec(remain.toFixed(1));

      const stage = activeBootStages.find((s) => calculated <= s.threshold) || activeBootStages[activeBootStages.length - 1];
      setCurrentStatus(stage.text);

      // Start fade out at 200ms before completion
      if (elapsed >= totalDuration - 200 && !hasEnded) {
        setIsFadingOut(true);
      }

      if (elapsed >= totalDuration && !hasEnded) {
        hasEnded = true;
        clearInterval(interval);
        setProgress(100);
        setRemainingSec('0.0');
        onCompleteRef.current();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [durationMs, activeBootStages]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onCompleteRef.current();
    }, 80);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 text-slate-100 p-6 select-none transition-opacity duration-500 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background 3D Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center font-mono font-bold text-xs shadow-lg ${
              isServer
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
                : isICN
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-cyan-500/10'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
            }`}
          >
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-xs sm:text-sm tracking-wider uppercase font-mono text-slate-200">
              {modeTitle || 'PARADIGM MATRIX · 3D INITIALIZATION'}
            </h1>
            <span
              className={`text-[10px] font-mono flex items-center gap-1.5 ${
                isServer ? 'text-emerald-400' : isICN ? 'text-cyan-400' : 'text-emerald-400'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
              <span>BOOT SEQUENCE IN PROGRESS ({remainingSec}s REMAINING)</span>
            </span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all backdrop-blur-md shadow-lg"
        >
          SKIP BOOT [ESC]
        </button>
      </div>

      {/* Center 3D Holographic Title Overlay */}
      <div className="relative z-10 text-center space-y-3 max-w-2xl px-4 my-auto">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono mb-2 backdrop-blur-md ${
            isServer
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : isICN
              ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {isServer
              ? 'Server-Centric Execution Engine'
              : isICN
              ? 'Information-Centric (NDN / ICN) Mesh Engine'
              : 'Server-Centric & Information-Centric Paradigms'}
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans drop-shadow-2xl">
          SYSTEMS <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">LABORATORY</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-lg mx-auto">
          {subtitle ||
            'Calibrating hardware-accelerated 3D WebGL topology, packet flow visualizers, and state-machine step engines.'}
        </p>
      </div>

      {/* Bottom Progress Card */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900/85 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-2 truncate">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
            <span className="truncate">{currentStatus}</span>
          </span>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="text-[10px] text-slate-500">{remainingSec}s</span>
            <span className="font-bold text-emerald-400">{progress}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-75 ease-out shadow-md ${
              isServer
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-emerald-500/50'
                : isICN
                ? 'bg-gradient-to-r from-cyan-500 to-pink-500 shadow-cyan-500/50'
                : 'bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 shadow-emerald-500/50'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Diagnostic Tickers */}
        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-1 truncate">
            <span className="text-emerald-500">●</span>
            <span className="truncate">SSR / RSC: READY</span>
          </div>
          <div className="flex items-center gap-1 truncate">
            <span className="text-cyan-500">●</span>
            <span className="truncate">NDN MESH: READY</span>
          </div>
          <div className="flex items-center gap-1 justify-end truncate">
            <span className="text-purple-500">●</span>
            <span className="truncate">WEBGL 3D: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Author Attribution: by Naren */}
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900/80 border border-slate-800/90 text-xs font-mono text-slate-400 backdrop-blur-md shadow-lg">
          <span className="text-slate-400">by</span>
          <span className="font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300">
            Naren
          </span>
        </div>
      </div>
    </div>
  );
};

