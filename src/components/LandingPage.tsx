import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Server,
  Database,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Cpu,
  ArrowRight,
  Sparkles,
  Layers,
  Search,
  CheckCircle2,
  Lock,
  Wifi,
  ExternalLink,
  ChevronDown,
  Play,
  RotateCcw,
} from 'lucide-react';
import { ArchitectureMode } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  onSelectMode: (mode: ArchitectureMode) => void;
  onRestart?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectMode, onRestart }) => {
  const heroCanvasRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeTabPreview, setActiveTabPreview] = useState<'server' | 'information'>('server');

  // Interactive 3D Hero Scene with Three.js
  useEffect(() => {
    if (!heroCanvasRef.current) return;
    const container = heroCanvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 4, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic 3D Grid Floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x10b981, 0x1e293b);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    // Floating 3D Node Clusters
    const groupNodes = new THREE.Group();
    scene.add(groupNodes);

    // Server-Centric Server Tower (Green)
    const serverGeo = new THREE.BoxGeometry(2, 4, 2);
    const serverMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const serverMesh = new THREE.Mesh(serverGeo, serverMat);
    serverMesh.position.set(-6, 0, 0);
    groupNodes.add(serverMesh);

    // Information-Centric Named Data Mesh Node (Cyan Icosahedron)
    const icnGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const icnMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: true,
    });
    const icnMesh = new THREE.Mesh(icnGeo, icnMat);
    icnMesh.position.set(6, 0, 0);
    groupNodes.add(icnMesh);

    // Center Fusion Ring (Connecting both paradigms)
    const fusionRingGeo = new THREE.TorusGeometry(3.5, 0.08, 16, 100);
    const fusionRingMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 });
    const fusionRing = new THREE.Mesh(fusionRingGeo, fusionRingMat);
    fusionRing.rotation.x = Math.PI / 2.5;
    groupNodes.add(fusionRing);

    // Floating Data Packet Particles between the nodes
    const particleCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pVel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 24;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      pVel[i * 3] = (Math.random() - 0.5) * 0.04;
      pVel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      pVel[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.18,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0x10b981, 2);
    dirLight.position.set(-10, 10, 10);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 2);
    dirLight2.position.set(10, 10, 10);
    scene.add(dirLight2);

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1);
    };

    window.addEventListener('mousemove', onMouseMove);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth floating movements
      serverMesh.rotation.y = elapsed * 0.5;
      serverMesh.position.y = Math.sin(elapsed * 1.5) * 0.3;

      icnMesh.rotation.x = elapsed * 0.4;
      icnMesh.rotation.y = elapsed * 0.6;
      icnMesh.position.y = Math.cos(elapsed * 1.5) * 0.3;

      fusionRing.rotation.z = elapsed * 0.3;

      // Particle physics
      const positions = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += pVel[i * 3];
        positions[i * 3 + 1] += pVel[i * 3 + 1];
        positions[i * 3 + 2] += pVel[i * 3 + 2];

        if (Math.abs(positions[i * 3]) > 14) pVel[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 6) pVel[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 8) pVel[i * 3 + 2] *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Camera parallax
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (4 + mouseY * 1.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!heroCanvasRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const scrollToExplore = () => {
    const el = document.getElementById('paradigms-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen w-full overflow-x-hidden font-sans transition-colors ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-between items-center px-4 sm:px-6 pt-12 pb-16">
        {/* 3D WebGL Canvas Backdrop */}
        <div ref={heroCanvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-70" />

        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 pt-6">
          {/* Top Badges & Reboot Action */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono backdrop-blur-xl shadow-lg shadow-emerald-500/10 animate-fadeIn">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">Interactive 3D Architectural Laboratories</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {onRestart && (
              <button
                onClick={onRestart}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono backdrop-blur-xl shadow-lg transition-all"
                title="Trigger 3-Second Cold Start Loader Sequence"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reboot Matrix (3s Loader)</span>
              </button>
            )}
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-sans leading-[1.1] drop-shadow-2xl">
            Architectures of the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">
              Modern Web
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-sm sm:text-lg max-w-3xl mx-auto font-sans leading-relaxed ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            Explore, debug, and simulate <strong className="text-emerald-500">Server-Centric</strong> (SSR, RSC, Hypermedia) vs{' '}
            <strong className="text-cyan-400">Information-Centric</strong> (NDN, Content Addressing, In-Network Caching) architectures in an interactive 3D WebGL simulator with live execution traces and step engines.
          </p>

          {/* PARADIGM SELECTOR CARDS (The 2 Core Choices) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 text-left max-w-4xl mx-auto">
            {/* OPTION 1: SERVER-CENTRIC CARD */}
            <div
              onClick={() => onSelectMode('server-centric')}
              className={`group relative rounded-3xl p-6 sm:p-7 border-2 transition-all duration-300 cursor-pointer backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl hover:scale-[1.02] ${
                isLight
                  ? 'bg-white/95 border-emerald-500 hover:shadow-emerald-500/20'
                  : 'bg-slate-900/90 border-emerald-500/50 hover:border-emerald-400 hover:shadow-emerald-500/20'
              }`}
            >
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-mono font-bold text-[10px] uppercase tracking-wider px-4 py-1 rounded-bl-2xl">
                ★ Server-Authoritative
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold font-sans ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Server-Centric Architecture
                    </h3>
                    <span className="text-xs font-mono text-emerald-500 font-semibold">
                      SSR · RSC · Server Actions · HTMX
                    </span>
                  </div>
                </div>

                <p className={`text-xs leading-relaxed mb-4 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  The backend remains the authoritative source of truth for state, computation, security, and UI composition. Streams lightweight semantic HTML for zero-hydration instant rendering.
                </p>

                <div className="space-y-2 mb-6 text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Zero Hydration Waterfall:</strong> ~15 KB JS footprint</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Sub-ms Datacenter Mesh:</strong> 0.5ms PostgreSQL / Redis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Zero Client Secrets:</strong> DB credentials never leak</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 group-hover:gap-3">
                <span>Launch Server-Centric Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* OPTION 2: INFORMATION-CENTRIC CARD */}
            <div
              onClick={() => onSelectMode('information-centric')}
              className={`group relative rounded-3xl p-6 sm:p-7 border-2 transition-all duration-300 cursor-pointer backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl hover:scale-[1.02] ${
                isLight
                  ? 'bg-white/95 border-cyan-500 hover:shadow-cyan-500/20'
                  : 'bg-slate-900/90 border-cyan-500/50 hover:border-cyan-400 hover:shadow-cyan-500/20'
              }`}
            >
              <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] uppercase tracking-wider px-4 py-1 rounded-bl-2xl">
                ★ Content-Addressed
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold font-sans ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Information-Centric Architecture
                    </h3>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      NDN · Content Addressing (CID) · In-Network Caching
                    </span>
                  </div>
                </div>

                <p className={`text-xs leading-relaxed mb-4 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Decouples information from physical host IP addresses. Data is identified by Name or Cryptographic Hash (CID) and cached transparently at Layer 3 across all intermediate routers.
                </p>

                <div className="space-y-2 mb-6 text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span><strong>Name-Based Routing:</strong> Request WHAT, not WHERE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span><strong>Self-Verifying Data:</strong> Asymmetric cryptographic signatures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span><strong>Storm Resistance:</strong> PIT table collapses 1,000 requests into 1</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 group-hover:gap-3">
                <span>Launch Information-Centric Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToExplore}
          className="relative z-10 mt-10 p-2.5 rounded-full border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-all animate-bounce"
          aria-label="Scroll down to explore paradigms"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </section>

      {/* SECTION 1: ARCHITECTURAL PARADIGM COMPARISON MATRIX */}
      <section id="paradigms-section" className={`py-16 px-4 sm:px-6 border-t ${
        isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-950/80 border-slate-900'
      }`}>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>Comparative Framework</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Server-Centric vs Information-Centric Matrix
            </h2>
            <p className={`text-xs sm:text-sm max-w-2xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              A comprehensive breakdown of how both paradigms resolve state, security, routing, caching, and network resiliency.
            </p>
          </div>

          {/* Detailed Comparative Grid */}
          <div className={`rounded-3xl border overflow-hidden shadow-2xl ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`grid grid-cols-1 md:grid-cols-12 p-4 border-b text-xs font-mono font-bold ${
              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}>
              <div className="md:col-span-3">ARCHITECTURAL DIMENSION</div>
              <div className="md:col-span-4 text-emerald-500">SERVER-CENTRIC ARCHITECTURE (SCA)</div>
              <div className="md:col-span-5 text-cyan-400">INFORMATION-CENTRIC ARCHITECTURE (ICA)</div>
            </div>

            <div className={`divide-y text-xs font-sans ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
              {/* Row 1 */}
              <div className={`grid grid-cols-1 md:grid-cols-12 p-5 gap-3 items-center ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}>
                <div className="md:col-span-3 font-bold flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>Addressing & Identity</span>
                </div>
                <div className="md:col-span-4">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Host / IP Endpoint Binding</span>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Packets routed to a physical server IP:Port (e.g. <code>api.example.com</code>). The server coordinates state.
                  </p>
                </div>
                <div className="md:col-span-5">
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 block mb-1">Named Data Object / CID Binding</span>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Packets express Interest in a Name (<code>/media/paper.pdf</code>) or Hash CID. Any node holding authentic data answers.
                  </p>
                </div>
              </div>

              {/* Row 2 */}
              <div className={`grid grid-cols-1 md:grid-cols-12 p-5 gap-3 items-center ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}>
                <div className="md:col-span-3 font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-sky-500" />
                  <span>Security & Trust Model</span>
                </div>
                <div className="md:col-span-4">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Channel-Based (TLS/HTTPS)</span>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Secures the communication pipe between browser and server. Zero secret tokens or DB keys ever leave the datacenter.
                  </p>
                </div>
                <div className="md:col-span-5">
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 block mb-1">Data-Centric Digital Signatures</span>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Security travels WITH the data. Every chunk is signed with asymmetric crypto (Ed25519/RSA), verified by consumers offline.
                  </p>
                </div>
              </div>

              {/* Row 3 */}
              <div className={`grid grid-cols-1 md:grid-cols-12 p-5 gap-3 items-center ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}>
                <div className="md:col-span-3 font-bold flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-500" />
                  <span>Caching & Edge Delivery</span>
                </div>
                <div className="md:col-span-4">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Edge Reverse Proxies & CDN</span>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Cloudflare/Fastly edge nodes cache pre-rendered HTML fragments using Stale-While-Revalidate (SWR) and Cache-Tags.
                  </p>
                </div>
                <div className="md:col-span-5">
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 block mb-1">Layer-3 Ubiquitous In-Network CS</span>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Every single intermediate router switch has a Content Store (CS) that caches passing Named Data Objects natively in 0.5ms.
                  </p>
                </div>
              </div>

              {/* Row 4 */}
              <div className={`grid grid-cols-1 md:grid-cols-12 p-5 gap-3 items-center ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}>
                <div className="md:col-span-3 font-bold flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-500" />
                  <span>Flash Crowd Storm Resistance</span>
                </div>
                <div className="md:col-span-4">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Auto-Scaling Server Clusters</span>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Horizontal auto-scaling server containers handle concurrent connections, backed by Redis clusters.
                  </p>
                </div>
                <div className="md:col-span-5">
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 block mb-1">PIT Request Aggregation & Multicast</span>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    1,000 concurrent requests collapse into 1 upstream Interest. The single returning Data Packet is multicasted to all 1,000 faces.
                  </p>
                </div>
              </div>

              {/* Row 5 */}
              <div className={`grid grid-cols-1 md:grid-cols-12 p-5 gap-3 items-center ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}>
                <div className="md:col-span-3 font-bold flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-rose-500" />
                  <span>Network Partition & Offline Resiliency</span>
                </div>
                <div className="md:col-span-4">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Requires Online Datacenter Link</span>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    If connectivity to the origin datacenter is severed, dynamic server actions and queries will fail.
                  </p>
                </div>
                <div className="md:col-span-5">
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 block mb-1">Ad-Hoc Peer Mesh Resilient</span>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Disaster-proof: Nearby peer devices discover and exchange self-verifying signed data over local Wi-Fi meshes with 0 internet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STEP-BY-STEP SIMULATION WALKTHROUGHS */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Interactive Step Engines</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              End-to-End Simulation Workflows
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Every scenario features full 3D packet kinematics, source code execution traces, HTTP/NDN headers, and state synchronizers.
            </p>
          </div>

          {/* Toggle preview mode */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <button
              onClick={() => setActiveTabPreview('server')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTabPreview === 'server'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Server-Centric Scenarios (5)
            </button>
            <button
              onClick={() => setActiveTabPreview('information')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTabPreview === 'information'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Information-Centric Scenarios (5)
            </button>
          </div>
        </div>

        {/* Server-Centric Scenarios Preview */}
        {activeTabPreview === 'server' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-bold">SCENARIO 01</span>
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">SSR Navigation</span>
              </div>
              <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Initial Page Load & Microsecond DB Query
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Dispatches a single HTTP GET /products request. Edge routes to Server Core, queries PostgreSQL in 0.8ms, and streams pre-rendered semantic HTML.
              </p>
              <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>5-Step Execution</span>
                <span className="text-emerald-500">0 KB Hydration</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-bold">SCENARIO 02</span>
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Server Actions</span>
              </div>
              <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Cart Mutation & Targeted DOM Morphing
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Dispatches an asynchronous POST mutation. The server updates ACID session state, invalidates tag caches, and streams an atomic HTML patch.
              </p>
              <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>4-Step Execution</span>
                <span className="text-emerald-500">ACID Safe</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-bold">SCENARIO 03</span>
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Hypermedia / HTMX</span>
              </div>
              <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Real-Time Search & Server Fragment Swapping
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Client emits a debounced hx-get query. Server renders the search results partial, swapping the HTML fragment without re-rendering the outer page.
              </p>
              <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>3-Step Execution</span>
                <span className="text-emerald-500">No Redux / State Store</span>
              </div>
            </div>
          </div>
        )}

        {/* Information-Centric Scenarios Preview */}
        {activeTabPreview === 'information' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">SCENARIO 01</span>
                <span className="bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">Name Routing</span>
              </div>
              <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Name-Based Routing & In-Network CS Hit
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Consumer expresses Interest for /media/science/paper.pdf. Transit router discovers the verified signed Data Packet in its Content Store, replying in 0.4ms.
              </p>
              <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>5-Step Execution</span>
                <span className="text-cyan-400">Zero Server Contact</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">SCENARIO 02</span>
                <span className="bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">Content Addressing</span>
              </div>
              <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                CID Hash Query & Parallel Swarm Assembly
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Consumer fetches 4K media by CID hash. Bitswap downloads chunks in parallel from 3 peer nodes simultaneously, verifying the Merkle DAG root.
              </p>
              <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>3-Step Execution</span>
                <span className="text-cyan-400">Merkle Integrity Proof</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">SCENARIO 03</span>
                <span className="bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">Storm Defense</span>
              </div>
              <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Flash Crowd Storm Defense (PIT Aggregation)
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Fifty concurrent consumers request the same live stream chunk. Ingress router collapses them into 1 PIT entry, saving 98% bandwidth.
              </p>
              <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>3-Step Execution</span>
                <span className="text-cyan-400">Native Multicast</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 3: CALL TO ACTION FOOTER */}
      <section className={`py-16 px-4 sm:px-6 border-t text-center ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-900'
      }`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <h3 className={`text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Ready to Simulate Modern Network Paradigms?
          </h3>
          <p className={`text-xs sm:text-sm max-w-xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Choose your paradigm and enter the interactive 3D laboratory with live telemetry, chaos injection, packet visualizers, and code inspectors.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onSelectMode('server-centric')}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/20"
            >
              <Server className="w-4 h-4" />
              <span>Launch Server-Centric Lab</span>
            </button>

            <button
              onClick={() => onSelectMode('information-centric')}
              className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-xl shadow-cyan-500/20"
            >
              <Cpu className="w-4 h-4" />
              <span>Launch Information-Centric Lab</span>
            </button>
          </div>

          <div className="pt-8 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-3">
            <span>SPECIFICATIONS: RFC 8569 · NDN PROJECT · W3C HYPERMEDIA · REACT SERVER COMPONENTS</span>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400">by</span>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300">
                Naren
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
