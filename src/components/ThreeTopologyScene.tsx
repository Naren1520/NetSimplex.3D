import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Eye, Layers, Activity } from 'lucide-react';
import { ArchitectureNode, DataPacket } from '../types';

interface ThreeTopologySceneProps {
  nodes: ArchitectureNode[];
  activeNodeId: string;
  packets: DataPacket[];
  onSelectNode: (node: ArchitectureNode) => void;
  isPaused: boolean;
  simulationSpeed: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  theme?: 'dark' | 'light';
}

export const ThreeTopologyScene: React.FC<ThreeTopologySceneProps> = ({
  nodes,
  activeNodeId,
  packets,
  onSelectNode,
  isPaused,
  simulationSpeed,
  isFullscreen = false,
  onToggleFullscreen,
  theme = 'dark',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodeMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const packetMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const splineCurvesRef = useRef<Map<string, THREE.CatmullRomCurve3>>(new Map());
  const haloMeshesRef = useRef<THREE.Mesh[]>([]);
  const blinkingLedsRef = useRef<THREE.Mesh[]>([]);
  const spinningDisksRef = useRef<THREE.Mesh[]>([]);
  
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: 0.45, phi: 0.85, radius: 26 });
  const targetCameraLookAtRef = useRef(new THREE.Vector3(0, 0.5, 0));
  const currentCameraLookAtRef = useRef(new THREE.Vector3(0, 0.5, 0));

  const [hoveredNode, setHoveredNode] = useState<ArchitectureNode | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'isometric' | 'top' | 'server_focus' | 'front'>('isometric');

  const isLight = theme === 'light';

  // Setup 3D Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene setup with Theme awareness
    const scene = new THREE.Scene();
    const bgColor = isLight ? 0xf1f5f9 : 0x070b14;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, isLight ? 0.018 : 0.022);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.05 : 1.25;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(isLight ? 0xe2e8f0 : 0x1e293b, isLight ? 2.4 : 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isLight ? 2.6 : 2.2);
    dirLight.position.set(16, 28, 16);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    // Accent Server Room / Datacenter Lightings
    const bluePointLight = new THREE.PointLight(0x38bdf8, isLight ? 2.5 : 4, 35);
    bluePointLight.position.set(-8, 8, 4);
    scene.add(bluePointLight);

    const emeraldPointLight = new THREE.PointLight(0x10b981, isLight ? 3 : 5, 35);
    emeraldPointLight.position.set(2, 7, 2);
    scene.add(emeraldPointLight);

    const purplePointLight = new THREE.PointLight(0xa855f7, isLight ? 2.5 : 4, 35);
    purplePointLight.position.set(-2, 7, -3);
    scene.add(purplePointLight);

    // High-Tech Raised Datacenter Floor Grid
    const gridHelper = new THREE.GridHelper(
      42,
      42,
      isLight ? 0x94a3b8 : 0x334155,
      isLight ? 0xcbd5e1 : 0x0f172a
    );
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);

    // Datacenter Raised Floor Platform Tile
    const groundGeo = new THREE.CylinderGeometry(24, 24, 0.4, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xe2e8f0 : 0x0a101d,
      roughness: isLight ? 0.6 : 0.7,
      metalness: isLight ? 0.3 : 0.6,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1.4;
    ground.receiveShadow = true;
    scene.add(ground);

    // Build Node Meshes & Conduits
    buildRealisticNodeMeshes(scene, nodes, isLight);
    buildSplineConduits(scene, nodes, isLight);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && rendererRef.current && cameraRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 60FPS Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera interpolation
      currentCameraLookAtRef.current.lerp(targetCameraLookAtRef.current, 0.05);
      if (cameraRef.current) {
        updateCameraPosition();
        cameraRef.current.lookAt(currentCameraLookAtRef.current);
      }

      // Rotate glowing halos & crystals
      haloMeshesRef.current.forEach((halo, idx) => {
        halo.rotation.y += delta * (0.8 + idx * 0.15);
      });

      // Blink server activity LEDs realistically
      blinkingLedsRef.current.forEach((led, idx) => {
        const blinkFreq = 4 + (idx % 5) * 3;
        const isOn = Math.sin(time * blinkFreq + idx * 1.7) > -0.2;
        const mat = led.material as THREE.MeshBasicMaterial;
        mat.opacity = isOn ? 1.0 : 0.2;
      });

      // Spin DB platters & worker gears
      spinningDisksRef.current.forEach((disk, idx) => {
        disk.rotation.y += delta * (2.5 + (idx % 3));
      });

      // Pulse active nodes with smooth scale
      nodeMeshesRef.current.forEach((group, nodeId) => {
        const isActive = nodeId === activeNodeId;
        const scaleTarget = isActive ? 1.1 + Math.sin(time * 5) * 0.03 : 1.0;
        group.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), 0.1);

        // Subtle realistic floating
        const baseY = group.userData.baseY || 0;
        group.position.y = baseY + Math.sin(time * 1.8 + group.position.x) * 0.05;
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [theme]);

  // Update Camera Orbit Coordinates
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraAngleRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(
      currentCameraLookAtRef.current.x + x,
      currentCameraLookAtRef.current.y + y,
      currentCameraLookAtRef.current.z + z
    );
  };

  // Build Realistic Server & Infrastructure Meshes
  const buildRealisticNodeMeshes = (scene: THREE.Scene, nodeList: ArchitectureNode[], lightMode: boolean) => {
    nodeMeshesRef.current.clear();
    haloMeshesRef.current = [];
    blinkingLedsRef.current = [];
    spinningDisksRef.current = [];

    nodeList.forEach((node) => {
      const group = new THREE.Group();
      const [x, y, z] = node.position;
      group.position.set(x, y, z);
      group.userData = { nodeId: node.id, nodeData: node, baseY: y };

      const baseColor = new THREE.Color(node.color);

      // Heavy Server Base Pedestal
      const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.35, 32);
      const pedestalMat = new THREE.MeshStandardMaterial({
        color: lightMode ? 0xcbd5e1 : 0x1e293b,
        metalness: 0.85,
        roughness: 0.25,
      });
      const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestal.position.y = -0.18;
      pedestal.receiveShadow = true;
      group.add(pedestal);

      // Glow Ring on Base
      const ringGeo = new THREE.TorusGeometry(1.65, 0.05, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: baseColor });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.02;
      group.add(ring);
      haloMeshesRef.current.push(ring);

      // ==========================================
      // NODE 1: CLIENT (MacBook / Thin Viewport Monitor + Keyboard)
      // ==========================================
      if (node.type === 'client') {
        const clientGroup = new THREE.Group();

        // Laptop Unibody Aluminum Base
        const laptopBaseGeo = new THREE.BoxGeometry(2.0, 0.1, 1.4);
        const laptopBaseMat = new THREE.MeshStandardMaterial({
          color: lightMode ? 0x94a3b8 : 0x334155,
          metalness: 0.9,
          roughness: 0.15,
        });
        const laptopBase = new THREE.Mesh(laptopBaseGeo, laptopBaseMat);
        laptopBase.position.y = 0.2;
        laptopBase.castShadow = true;
        clientGroup.add(laptopBase);

        // Keyboard area
        const keyboardGeo = new THREE.BoxGeometry(1.7, 0.02, 0.8);
        const keyboardMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
        const keyboard = new THREE.Mesh(keyboardGeo, keyboardMat);
        keyboard.position.set(0, 0.26, -0.1);
        clientGroup.add(keyboard);

        // Trackpad
        const trackpadGeo = new THREE.BoxGeometry(0.7, 0.01, 0.45);
        const trackpadMat = new THREE.MeshStandardMaterial({
          color: lightMode ? 0x64748b : 0x1e293b,
          metalness: 0.8,
        });
        const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
        trackpad.position.set(0, 0.26, 0.4);
        clientGroup.add(trackpad);

        // Screen Hinge & Display Bezel
        const screenGroup = new THREE.Group();
        screenGroup.position.set(0, 0.25, -0.65);
        screenGroup.rotation.x = 0.28;

        const screenFrameGeo = new THREE.BoxGeometry(1.9, 1.35, 0.06);
        const screenFrameMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.9,
          roughness: 0.3,
        });
        const screenFrame = new THREE.Mesh(screenFrameGeo, screenFrameMat);
        screenFrame.position.y = 0.68;
        screenFrame.castShadow = true;
        screenGroup.add(screenFrame);

        // Glowing High-Res Viewport Display
        const displayGeo = new THREE.PlaneGeometry(1.76, 1.22);
        const displayMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const display = new THREE.Mesh(displayGeo, displayMat);
        display.position.set(0, 0.68, 0.035);
        screenGroup.add(display);

        clientGroup.add(screenGroup);
        group.add(clientGroup);
      }

      // ==========================================
      // NODE 2: EDGE GATEWAY / REVERSE PROXY TOWER
      // ==========================================
      else if (node.type === 'edge') {
        const edgeGroup = new THREE.Group();

        // Monolith Hexagonal Server Tower
        const edgeTowerGeo = new THREE.CylinderGeometry(1.0, 1.15, 2.6, 6);
        const edgeTowerMat = new THREE.MeshStandardMaterial({
          color: 0x2e1065,
          metalness: 0.85,
          roughness: 0.2,
        });
        const edgeTower = new THREE.Mesh(edgeTowerGeo, edgeTowerMat);
        edgeTower.position.y = 1.3;
        edgeTower.castShadow = true;
        edgeGroup.add(edgeTower);

        // Edge Routing Vents & Slits
        for (let i = 0; i < 4; i++) {
          const ventGeo = new THREE.BoxGeometry(0.8, 0.08, 1.8);
          const ventMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.9 });
          const vent = new THREE.Mesh(ventGeo, ventMat);
          vent.position.set(0, 0.6 + i * 0.5, 0);
          edgeGroup.add(vent);
          blinkingLedsRef.current.push(vent);
        }

        // Floating Quantum Routing Rings
        for (let i = 0; i < 2; i++) {
          const haloGeo = new THREE.TorusGeometry(1.3 + i * 0.3, 0.04, 16, 32);
          const haloMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
          const halo = new THREE.Mesh(haloGeo, haloMat);
          halo.position.y = 0.8 + i * 1.1;
          halo.rotation.x = Math.PI / 2.2;
          edgeGroup.add(halo);
          haloMeshesRef.current.push(halo);
        }

        group.add(edgeGroup);
      }

      // ==========================================
      // NODE 3: APPLICATION SERVER (Realistic Dual 42U Enterprise Rack)
      // ==========================================
      else if (node.type === 'server') {
        const rackGroup = new THREE.Group();

        // 42U Server Rack Outer Cabinet Chassis (Heavy Black Metal)
        const rackOuterGeo = new THREE.BoxGeometry(2.0, 3.2, 1.5);
        const rackOuterMat = new THREE.MeshStandardMaterial({
          color: 0x091410,
          metalness: 0.92,
          roughness: 0.18,
        });
        const rackOuter = new THREE.Mesh(rackOuterGeo, rackOuterMat);
        rackOuter.position.y = 1.6;
        rackOuter.castShadow = true;
        rackGroup.add(rackOuter);

        // Glass Front Door Frame with Emerald Tint
        const glassGeo = new THREE.PlaneGeometry(1.8, 2.9);
        const glassMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          transparent: true,
          opacity: 0.25,
          roughness: 0.1,
          metalness: 0.9,
        });
        const glassDoor = new THREE.Mesh(glassGeo, glassMat);
        glassDoor.position.set(0, 1.6, 0.76);
        rackGroup.add(glassDoor);

        // Stacked Server Blades (6 Modular 2U Blades)
        for (let i = 0; i < 6; i++) {
          const bladeY = 0.45 + i * 0.46;

          // Blade metal tray
          const bladeGeo = new THREE.BoxGeometry(1.7, 0.34, 1.35);
          const bladeMat = new THREE.MeshStandardMaterial({
            color: 0x132e26,
            metalness: 0.8,
            roughness: 0.3,
          });
          const blade = new THREE.Mesh(bladeGeo, bladeMat);
          blade.position.set(0, bladeY, 0);
          rackGroup.add(blade);

          // Front Air Intake Honeycomb Grill
          const grillGeo = new THREE.BoxGeometry(1.5, 0.22, 0.04);
          const grillMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 });
          const grill = new THREE.Mesh(grillGeo, grillMat);
          grill.position.set(0, bladeY, 0.69);
          rackGroup.add(grill);

          // LED Status Lights (Power, Network Activity, Drive I/O)
          for (let j = 0; j < 4; j++) {
            const ledGeo = new THREE.BoxGeometry(0.08, 0.08, 0.05);
            const ledColor = j === 0 ? 0x10b981 : j === 1 ? 0x34d399 : j === 2 ? 0x38bdf8 : 0xfbbf24;
            const ledMat = new THREE.MeshBasicMaterial({ color: ledColor, transparent: true, opacity: 1.0 });
            const led = new THREE.Mesh(ledGeo, ledMat);
            led.position.set(-0.6 + j * 0.16, bladeY, 0.72);
            rackGroup.add(led);
            blinkingLedsRef.current.push(led);
          }
        }

        // Server Core Processing Hologram / CPU Crystal on top
        const cpuCoreGeo = new THREE.OctahedronGeometry(0.5);
        const cpuCoreMat = new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true });
        const cpuCore = new THREE.Mesh(cpuCoreGeo, cpuCoreMat);
        cpuCore.position.set(0, 3.6, 0);
        rackGroup.add(cpuCore);
        haloMeshesRef.current.push(cpuCore);

        group.add(rackGroup);
      }

      // ==========================================
      // NODE 4: IN-MEMORY CACHE (Redis High-Speed RAM Arrays)
      // ==========================================
      else if (node.type === 'cache') {
        const cacheGroup = new THREE.Group();

        // Memory Vault Outer Cylinder Housing
        const cacheGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.0, 12);
        const cacheMat = new THREE.MeshStandardMaterial({
          color: 0x78350f,
          metalness: 0.75,
          roughness: 0.25,
        });
        const cacheMesh = new THREE.Mesh(cacheGeo, cacheMat);
        cacheMesh.position.y = 1.0;
        cacheMesh.castShadow = true;
        cacheGroup.add(cacheMesh);

        // Glowing RAM Matrix Rings
        for (let i = 0; i < 4; i++) {
          const ringG = new THREE.TorusGeometry(0.9, 0.03, 16, 32);
          const ringM = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
          const ringMsh = new THREE.Mesh(ringG, ringM);
          ringMsh.position.y = 0.4 + i * 0.45;
          ringMsh.rotation.x = Math.PI / 2;
          cacheGroup.add(ringMsh);
        }

        // Floating In-Memory Crystal
        const crystalGeo = new THREE.IcosahedronGeometry(0.55);
        const crystalMat = new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          metalness: 0.9,
          roughness: 0.1,
          emissive: 0xd97706,
          emissiveIntensity: 0.7,
        });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.y = 2.4;
        cacheGroup.add(crystal);
        haloMeshesRef.current.push(crystal);

        group.add(cacheGroup);
      }

      // ==========================================
      // NODE 5: PRIMARY DATABASE (Multi-Platter PostgreSQL Engine)
      // ==========================================
      else if (node.type === 'database') {
        const dbGroup = new THREE.Group();

        // Multi-tier Database Cylinder Platters (Storage Array)
        for (let i = 0; i < 3; i++) {
          const platterBaseGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.55, 32);
          const platterBaseMat = new THREE.MeshStandardMaterial({
            color: 0x1e3a8a,
            metalness: 0.88,
            roughness: 0.2,
          });
          const platter = new THREE.Mesh(platterBaseGeo, platterBaseMat);
          platter.position.y = 0.4 + i * 0.7;
          platter.castShadow = true;
          dbGroup.add(platter);

          // Glowing Platter Groove & Actuator Light
          const grooveGeo = new THREE.TorusGeometry(1.08, 0.03, 16, 32);
          const grooveMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });
          const groove = new THREE.Mesh(grooveGeo, grooveMat);
          groove.position.y = 0.4 + i * 0.7;
          groove.rotation.x = Math.PI / 2;
          dbGroup.add(groove);
          spinningDisksRef.current.push(groove);

          // Database Storage Activity LEDs
          const dbLedGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
          const dbLedMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true });
          const dbLed = new THREE.Mesh(dbLedGeo, dbLedMat);
          dbLed.position.set(0.9, 0.4 + i * 0.7, 0.6);
          dbGroup.add(dbLed);
          blinkingLedsRef.current.push(dbLed);
        }

        group.add(dbGroup);
      }

      // ==========================================
      // NODE 6: WORKER / ASYNC QUEUE DISPATCHER
      // ==========================================
      else if (node.type === 'worker') {
        const workerGroup = new THREE.Group();

        // Capsule Job Queue Chamber
        const workerGeo = new THREE.CapsuleGeometry(0.75, 1.3, 8, 16);
        const workerMat = new THREE.MeshStandardMaterial({
          color: 0x831843,
          metalness: 0.8,
          roughness: 0.25,
        });
        const workerMesh = new THREE.Mesh(workerGeo, workerMat);
        workerMesh.position.y = 1.2;
        workerMesh.castShadow = true;
        workerGroup.add(workerMesh);

        // Orbiting Process Ring
        const gearGeo = new THREE.TorusGeometry(1.05, 0.05, 8, 24);
        const gearMat = new THREE.MeshBasicMaterial({ color: 0xf472b6 });
        const gear = new THREE.Mesh(gearGeo, gearMat);
        gear.position.y = 1.2;
        gear.rotation.x = Math.PI / 3;
        workerGroup.add(gear);
        haloMeshesRef.current.push(gear);

        group.add(workerGroup);
      }

      // ==========================================
      // ICN NODE 1: CONSUMER (Operations Terminal & Query Console)
      // ==========================================
      else if (node.type === 'consumer') {
        const consumerGroup = new THREE.Group();

        // Heavy Base Console Platform
        const baseBoxGeo = new THREE.BoxGeometry(2.4, 0.25, 1.8);
        const baseBoxMat = new THREE.MeshStandardMaterial({
          color: 0x082f49,
          metalness: 0.85,
          roughness: 0.25,
        });
        const baseBox = new THREE.Mesh(baseBoxGeo, baseBoxMat);
        baseBox.position.y = 0.15;
        baseBox.castShadow = true;
        consumerGroup.add(baseBox);

        // Holographic Triple-Curved Display Array
        const centerScreenG = new THREE.PlaneGeometry(1.5, 1.0);
        const centerScreenM = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.9 });
        const centerScreen = new THREE.Mesh(centerScreenG, centerScreenM);
        centerScreen.position.set(0, 1.1, -0.2);
        consumerGroup.add(centerScreen);

        // Flanking Angled Screens
        const leftScreenG = new THREE.PlaneGeometry(0.8, 0.85);
        const leftScreenM = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.85 });
        const leftScreen = new THREE.Mesh(leftScreenG, leftScreenM);
        leftScreen.position.set(-1.1, 1.1, 0.1);
        leftScreen.rotation.y = 0.45;
        consumerGroup.add(leftScreen);

        const rightScreenG = new THREE.PlaneGeometry(0.8, 0.85);
        const rightScreenM = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.85 });
        const rightScreen = new THREE.Mesh(rightScreenG, rightScreenM);
        rightScreen.position.set(1.1, 1.1, 0.1);
        rightScreen.rotation.y = -0.45;
        consumerGroup.add(rightScreen);

        // Verification Holographic Shield Ring
        const shieldGeo = new THREE.TorusGeometry(1.4, 0.05, 16, 32);
        const shieldMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        shield.position.y = 1.2;
        shield.rotation.x = Math.PI / 2.3;
        consumerGroup.add(shield);
        haloMeshesRef.current.push(shield);

        // Pulsing Name Emitter Beam Cone
        const coneGeo = new THREE.ConeGeometry(0.4, 0.7, 16, 1, true);
        const coneMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6, wireframe: true });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.set(0, 2.2, 0);
        cone.rotation.x = Math.PI;
        consumerGroup.add(cone);
        spinningDisksRef.current.push(cone);

        group.add(consumerGroup);
      }

      // ==========================================
      // ICN NODE 2: ROUTER (NDN / ICN Forwarder Mega-Hub CS·PIT·FIB)
      // ==========================================
      else if (node.type === 'router') {
        const routerGroup = new THREE.Group();

        // Massive Hexagonal Core Forwarding Tower
        const rTowerGeo = new THREE.CylinderGeometry(1.1, 1.35, 3.4, 6);
        const rTowerMat = new THREE.MeshStandardMaterial({
          color: 0x1e1b4b,
          metalness: 0.9,
          roughness: 0.15,
        });
        const rTower = new THREE.Mesh(rTowerGeo, rTowerMat);
        rTower.position.y = 1.7;
        rTower.castShadow = true;
        routerGroup.add(rTower);

        // 3 Large Distinct Planar State Discs (CS = Indigo, PIT = Cyan, FIB = Magenta)
        const stateTables = [
          { y: 0.9, r: 1.6, color: 0x6366f1, label: 'CS' },
          { y: 1.8, r: 1.8, color: 0x06b6d4, label: 'PIT' },
          { y: 2.7, r: 2.0, color: 0xec4899, label: 'FIB' },
        ];

        stateTables.forEach((st) => {
          // Disc Torus Ring
          const tableRingGeo = new THREE.TorusGeometry(st.r, 0.06, 16, 32);
          const tableRingMat = new THREE.MeshBasicMaterial({ color: st.color });
          const tableRing = new THREE.Mesh(tableRingGeo, tableRingMat);
          tableRing.position.y = st.y;
          tableRing.rotation.x = Math.PI / 2;
          routerGroup.add(tableRing);
          haloMeshesRef.current.push(tableRing);

          // Thin Glowing Planar Holographic Disc
          const discG = new THREE.CircleGeometry(st.r, 24);
          const discM = new THREE.MeshBasicMaterial({
            color: st.color,
            transparent: true,
            opacity: 0.25,
            side: THREE.DoubleSide,
          });
          const discMesh = new THREE.Mesh(discG, discM);
          discMesh.position.y = st.y;
          discMesh.rotation.x = Math.PI / 2;
          routerGroup.add(discMesh);
        });

        // 6 Radial Transceiver Interface Hubs
        for (let j = 0; j < 6; j++) {
          const portAngle = (j / 6) * Math.PI * 2;
          const portGeo = new THREE.BoxGeometry(0.3, 0.3, 0.4);
          const portMat = new THREE.MeshStandardMaterial({ color: 0x312e81, metalness: 0.8 });
          const port = new THREE.Mesh(portGeo, portMat);
          port.position.set(Math.cos(portAngle) * 1.35, 0.8, Math.sin(portAngle) * 1.35);
          port.rotation.y = -portAngle;
          routerGroup.add(port);

          // LED Blinker
          const ledGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
          const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
          const led = new THREE.Mesh(ledGeo, ledMat);
          led.position.set(Math.cos(portAngle) * 1.55, 0.8, Math.sin(portAngle) * 1.55);
          routerGroup.add(led);
          blinkingLedsRef.current.push(led);
        }

        // Top Omnidirectional Laser Antenna
        const antGeo = new THREE.CylinderGeometry(0.04, 0.08, 1.0, 8);
        const antMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.9 });
        const antenna = new THREE.Mesh(antGeo, antMat);
        antenna.position.y = 3.9;
        routerGroup.add(antenna);

        group.add(routerGroup);
      }

      // ==========================================
      // ICN NODE 3: IN-NETWORK CONTENT STORE (Large Solid-State Memory Silo)
      // ==========================================
      else if (node.type === 'in_network_cache') {
        const cacheGroup = new THREE.Group();

        // Heavy Cylindrical Vault Body
        const cGeo = new THREE.CylinderGeometry(1.2, 1.25, 3.2, 20);
        const cMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.88,
          roughness: 0.18,
        });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.position.y = 1.6;
        cMesh.castShadow = true;
        cacheGroup.add(cMesh);

        // 5 Glowing Solid-State Flash Memory Tier Rings
        for (let i = 0; i < 5; i++) {
          const ringG = new THREE.TorusGeometry(1.28, 0.05, 16, 32);
          const ringColor = i % 2 === 0 ? 0x3b82f6 : 0x06b6d4;
          const ringM = new THREE.MeshBasicMaterial({ color: ringColor });
          const ringMesh = new THREE.Mesh(ringG, ringM);
          ringMesh.position.y = 0.5 + i * 0.55;
          ringMesh.rotation.x = Math.PI / 2;
          cacheGroup.add(ringMesh);
          spinningDisksRef.current.push(ringMesh);
        }

        // Vertical Blue Coolant Rods
        for (let k = 0; k < 4; k++) {
          const rodAngle = (k / 4) * Math.PI * 2;
          const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8);
          const rodMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
          const rod = new THREE.Mesh(rodGeo, rodMat);
          rod.position.set(Math.cos(rodAngle) * 1.35, 1.6, Math.sin(rodAngle) * 1.35);
          cacheGroup.add(rod);
        }

        // Top Floating Cached-Content Icosahedron
        const icoGeo = new THREE.IcosahedronGeometry(0.7, 0);
        const icoMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true });
        const ico = new THREE.Mesh(icoGeo, icoMat);
        ico.position.y = 3.6;
        cacheGroup.add(ico);
        haloMeshesRef.current.push(ico);

        group.add(cacheGroup);
      }

      // ==========================================
      // ICN NODE 4: DATA PRODUCER (Big Enterprise Server Citadel / Origin)
      // ==========================================
      else if (node.type === 'producer') {
        const prodGroup = new THREE.Group();

        // Heavy Datacenter Foundation Plinth
        const plinthGeo = new THREE.BoxGeometry(3.6, 0.3, 2.4);
        const plinthMat = new THREE.MeshStandardMaterial({ color: 0x1e1035, metalness: 0.9, roughness: 0.2 });
        const plinth = new THREE.Mesh(plinthGeo, plinthMat);
        plinth.position.y = 0.15;
        plinth.castShadow = true;
        prodGroup.add(plinth);

        // 1. CENTER BIG SERVER MONOLITH (Height 3.6m)
        const centerRackGeo = new THREE.BoxGeometry(1.6, 3.4, 1.4);
        const rackMat = new THREE.MeshStandardMaterial({
          color: 0x2e1065,
          metalness: 0.92,
          roughness: 0.12,
        });
        const centerRack = new THREE.Mesh(centerRackGeo, rackMat);
        centerRack.position.set(0, 1.85, 0);
        centerRack.castShadow = true;
        prodGroup.add(centerRack);

        // Center Server Blade Slots (8 glowing horizontal server trays)
        for (let b = 0; b < 8; b++) {
          const bladeGeo = new THREE.BoxGeometry(1.4, 0.18, 0.05);
          const bladeColor = b % 2 === 0 ? 0xa855f7 : 0xc084fc;
          const bladeMat = new THREE.MeshBasicMaterial({ color: bladeColor });
          const blade = new THREE.Mesh(bladeGeo, bladeMat);
          blade.position.set(0, 0.6 + b * 0.36, 0.72);
          prodGroup.add(blade);

          // LED Status Lights per server blade
          const ledGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
          const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
          const led = new THREE.Mesh(ledGeo, ledMat);
          led.position.set(0.6, 0.6 + b * 0.36, 0.74);
          prodGroup.add(led);
          blinkingLedsRef.current.push(led);
        }

        // 2. LEFT AUXILIARY SERVER RACK
        const leftRackGeo = new THREE.BoxGeometry(0.85, 2.8, 1.2);
        const auxMat = new THREE.MeshStandardMaterial({ color: 0x1f0d3d, metalness: 0.88, roughness: 0.2 });
        const leftRack = new THREE.Mesh(leftRackGeo, auxMat);
        leftRack.position.set(-1.3, 1.55, 0);
        prodGroup.add(leftRack);

        // Left Server Slots
        for (let lb = 0; lb < 6; lb++) {
          const lbladeG = new THREE.BoxGeometry(0.7, 0.16, 0.04);
          const lbladeM = new THREE.MeshBasicMaterial({ color: 0x9333ea });
          const lblade = new THREE.Mesh(lbladeG, lbladeM);
          lblade.position.set(-1.3, 0.6 + lb * 0.38, 0.62);
          prodGroup.add(lblade);
        }

        // 3. RIGHT AUXILIARY SERVER RACK
        const rightRackGeo = new THREE.BoxGeometry(0.85, 2.8, 1.2);
        const rightRack = new THREE.Mesh(rightRackGeo, auxMat);
        rightRack.position.set(1.3, 1.55, 0);
        prodGroup.add(rightRack);

        // Right Server Slots
        for (let rb = 0; rb < 6; rb++) {
          const rbladeG = new THREE.BoxGeometry(0.7, 0.16, 0.04);
          const rbladeM = new THREE.MeshBasicMaterial({ color: 0x9333ea });
          const rblade = new THREE.Mesh(rbladeG, rbladeM);
          rblade.position.set(1.3, 0.6 + rb * 0.38, 0.62);
          prodGroup.add(rblade);
        }

        // High-Voltage Overhead Power Conduits
        const busGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8);
        const busMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
        const busBar = new THREE.Mesh(busGeo, busMat);
        busBar.position.set(0, 3.7, 0);
        busBar.rotation.z = Math.PI / 2;
        prodGroup.add(busBar);

        // Floating Cryptographic Ed25519 Signing Core (Rotating Octahedron)
        const crystalGeo = new THREE.OctahedronGeometry(0.75);
        const crystalMat = new THREE.MeshStandardMaterial({
          color: 0xc084fc,
          emissive: 0x9333ea,
          emissiveIntensity: 1.2,
          wireframe: true,
        });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.y = 4.4;
        prodGroup.add(crystal);
        haloMeshesRef.current.push(crystal);

        group.add(prodGroup);
      }

      // ==========================================
      // ICN NODE 5: DISTRIBUTED CONTENT MESH (IPFS Merkle DAG Swarm)
      // ==========================================
      else if (node.type === 'ipfs_mesh') {
        const meshGroup = new THREE.Group();

        // Central Polyhedral Hash Aggregator Core
        const polyGeo = new THREE.DodecahedronGeometry(1.2);
        const polyMat = new THREE.MeshStandardMaterial({
          color: 0x831843,
          metalness: 0.85,
          roughness: 0.2,
        });
        const poly = new THREE.Mesh(polyGeo, polyMat);
        poly.position.y = 1.6;
        meshGroup.add(poly);

        // 6 Orbiting Merkle DAG Data Block Nodes
        for (let i = 0; i < 6; i++) {
          const blkGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
          const blkColor = i % 2 === 0 ? 0xec4899 : 0xf43f5e;
          const blkMat = new THREE.MeshBasicMaterial({ color: blkColor });
          const blk = new THREE.Mesh(blkGeo, blkMat);
          const angle = (i / 6) * Math.PI * 2;
          const dist = 1.7 + (i % 2) * 0.3;
          blk.position.set(Math.cos(angle) * dist, 1.6 + Math.sin(angle) * 0.6, Math.sin(angle) * dist);
          meshGroup.add(blk);
          spinningDisksRef.current.push(blk);

          // Connecting Laser Line from Core to Block
          const lineGeo = new THREE.CylinderGeometry(0.02, 0.02, dist, 6);
          const lineMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.6 });
          const line = new THREE.Mesh(lineGeo, lineMat);
          line.position.set(Math.cos(angle) * (dist / 2), 1.6 + Math.sin(angle) * 0.3, Math.sin(angle) * (dist / 2));
          line.rotation.z = Math.PI / 2;
          line.rotation.y = -angle;
          meshGroup.add(line);
        }

        // Floating CID Ring
        const cidRingGeo = new THREE.TorusGeometry(1.9, 0.04, 16, 32);
        const cidRingMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
        const cidRing = new THREE.Mesh(cidRingGeo, cidRingMat);
        cidRing.position.y = 1.6;
        meshGroup.add(cidRing);
        haloMeshesRef.current.push(cidRing);

        group.add(meshGroup);
      }

      // ==========================================
      // ICN NODE 6: KEY AUTHORITY (Sovereign Root Trust Arch)
      // ==========================================
      else if (node.type === 'key_authority') {
        const authGroup = new THREE.Group();

        // Twin Emerald Monolithic Columns
        const colGeo = new THREE.BoxGeometry(0.8, 3.2, 0.8);
        const colMat = new THREE.MeshStandardMaterial({
          color: 0x064e3b,
          metalness: 0.9,
          roughness: 0.2,
        });

        // Left Column
        const leftCol = new THREE.Mesh(colGeo, colMat);
        leftCol.position.set(-1.0, 1.6, 0);
        leftCol.castShadow = true;
        authGroup.add(leftCol);

        // Right Column
        const rightCol = new THREE.Mesh(colGeo, colMat);
        rightCol.position.set(1.0, 1.6, 0);
        rightCol.castShadow = true;
        authGroup.add(rightCol);

        // Arch Transom Beam
        const archGeo = new THREE.BoxGeometry(2.8, 0.45, 0.9);
        const arch = new THREE.Mesh(archGeo, colMat);
        arch.position.set(0, 3.2, 0);
        authGroup.add(arch);

        // Floating Sovereign Cryptographic Key Crystal & Torus
        const keyRingGeo = new THREE.TorusGeometry(0.9, 0.06, 16, 32);
        const keyRingMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        const keyRing = new THREE.Mesh(keyRingGeo, keyRingMat);
        keyRing.position.y = 2.0;
        authGroup.add(keyRing);
        haloMeshesRef.current.push(keyRing);

        // Inner Octahedron Trust Seal
        const sealGeo = new THREE.OctahedronGeometry(0.45);
        const sealMat = new THREE.MeshStandardMaterial({
          color: 0x34d399,
          emissive: 0x059669,
          emissiveIntensity: 1.0,
          wireframe: true,
        });
        const seal = new THREE.Mesh(sealGeo, sealMat);
        seal.position.y = 2.0;
        authGroup.add(seal);
        spinningDisksRef.current.push(seal);

        group.add(authGroup);
      }

      scene.add(group);
      nodeMeshesRef.current.set(node.id, group);
    });
  };

  // Build Spline Conduits (Connecting nodes with high-speed 3D fiber conduits)
  const buildSplineConduits = (scene: THREE.Scene, nodeList: ArchitectureNode[], lightMode: boolean) => {
    splineCurvesRef.current.clear();
    const nodeMap = new Map(nodeList.map((n) => [n.id, n]));

    const connections: Array<[string, string, string]> = [
      // Server-Centric conduits
      ['client', 'edge', '#a855f7'],
      ['edge', 'server', '#10b981'],
      ['server', 'cache', '#f59e0b'],
      ['server', 'database', '#3b82f6'],
      ['server', 'worker', '#ec4899'],
      ['worker', 'cache', '#f59e0b'],
      ['server', 'client', '#38bdf8'],

      // Information-Centric conduits
      ['consumer', 'router', '#06b6d4'],
      ['router', 'in_network_cache', '#6366f1'],
      ['in_network_cache', 'producer', '#8b5cf6'],
      ['router', 'producer', '#8b5cf6'],
      ['router', 'ipfs_mesh', '#ec4899'],
      ['in_network_cache', 'ipfs_mesh', '#ec4899'],
      ['producer', 'key_authority', '#10b981'],
      ['consumer', 'key_authority', '#10b981'],
      ['in_network_cache', 'router', '#6366f1'],
      ['router', 'consumer', '#06b6d4'],
      ['producer', 'consumer', '#06b6d4'],
      ['ipfs_mesh', 'consumer', '#ec4899'],
    ];

    connections.forEach(([fromId, toId, color]) => {
      const fromNode = nodeMap.get(fromId);
      const toNode = nodeMap.get(toId);
      if (!fromNode || !toNode) return;

      const p1 = new THREE.Vector3(fromNode.position[0], 0.2, fromNode.position[2]);
      const p2 = new THREE.Vector3(toNode.position[0], 0.2, toNode.position[2]);

      // Elevated midpoint curve
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y = 1.35;

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
      splineCurvesRef.current.set(`${fromId}->${toId}`, curve);
      splineCurvesRef.current.set(`${toId}->${fromId}`, new THREE.CatmullRomCurve3([p2, mid, p1]));

      // High-grade Tube Conduit Geometry
      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.05, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.3,
        metalness: 0.8,
        transparent: true,
        opacity: lightMode ? 0.6 : 0.45,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);
    });
  };

  // Manage Dynamic Packets in 3D scene
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    const currentPacketIds = new Set(packets.map((p) => p.id));

    // Remove old packet meshes
    packetMeshesRef.current.forEach((group, id) => {
      if (!currentPacketIds.has(id)) {
        scene.remove(group);
        packetMeshesRef.current.delete(id);
      }
    });

    // Create or update packet meshes
    packets.forEach((packet) => {
      let group = packetMeshesRef.current.get(packet.id);

      if (!group) {
        group = new THREE.Group();

        // Glowing core sphere
        const sphereGeo = new THREE.SphereGeometry(0.24, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(packet.color),
          emissive: new THREE.Color(packet.color),
          emissiveIntensity: 1.8,
          roughness: 0.1,
          metalness: 0.9,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        group.add(sphere);

        // Point Light source
        const pLight = new THREE.PointLight(new THREE.Color(packet.color), 2.5, 7);
        group.add(pLight);

        // Outer halo
        const haloGeo = new THREE.TorusGeometry(0.32, 0.025, 8, 16);
        const haloMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(packet.color) });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2;
        group.add(halo);

        scene.add(group);
        packetMeshesRef.current.set(packet.id, group);
      }

      // Position along spline
      const key = `${packet.fromNodeId}->${packet.toNodeId}`;
      const curve = splineCurvesRef.current.get(key);

      if (curve) {
        const clampedProgress = Math.max(0, Math.min(1, packet.progress));
        const pos = curve.getPoint(clampedProgress);
        group.position.copy(pos);
      } else {
        const fromNode = nodes.find((n) => n.id === packet.fromNodeId);
        const toNode = nodes.find((n) => n.id === packet.toNodeId);
        if (fromNode && toNode) {
          const t = Math.max(0, Math.min(1, packet.progress));
          group.position.set(
            THREE.MathUtils.lerp(fromNode.position[0], toNode.position[0], t),
            THREE.MathUtils.lerp(fromNode.position[1] + 0.5, toNode.position[1] + 0.5, t) + Math.sin(t * Math.PI) * 0.8,
            THREE.MathUtils.lerp(fromNode.position[2], toNode.position[2], t)
          );
        }
      }
    });
  }, [packets, nodes]);

  // Focus Camera on Active Node
  useEffect(() => {
    if (!activeNodeId) return;
    const targetNode = nodes.find((n) => n.id === activeNodeId);
    if (targetNode) {
      targetCameraLookAtRef.current.set(
        targetNode.position[0] * 0.35,
        targetNode.position[1] + 0.6,
        targetNode.position[2] * 0.35
      );
    }
  }, [activeNodeId, nodes]);

  // Mouse Orbit & Raycasting
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      cameraAngleRef.current.theta -= deltaX * 0.006;
      cameraAngleRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2.1, cameraAngleRef.current.phi - deltaY * 0.006));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    }

    if (mountRef.current && cameraRef.current && sceneRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const interactiveObjects: THREE.Object3D[] = [];
      nodeMeshesRef.current.forEach((group) => {
        interactiveObjects.push(group);
      });

      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let topGroup: THREE.Object3D | null = intersects[0].object;
        while (topGroup && !topGroup.userData.nodeId && topGroup.parent) {
          topGroup = topGroup.parent;
        }
        if (topGroup && topGroup.userData.nodeData) {
          setHoveredNode(topGroup.userData.nodeData);
          mountRef.current.style.cursor = 'pointer';
          return;
        }
      }

      setHoveredNode(null);
      mountRef.current.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const wasDragging = Math.abs(e.clientX - previousMousePositionRef.current.x) > 4;
    isDraggingRef.current = false;

    if (!wasDragging && hoveredNode) {
      onSelectNode(hoveredNode);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    cameraAngleRef.current.radius = Math.max(10, Math.min(46, cameraAngleRef.current.radius + e.deltaY * 0.02));
  };

  const setViewPreset = (preset: 'isometric' | 'top' | 'server_focus' | 'front') => {
    setCameraPreset(preset);
    if (preset === 'isometric') {
      cameraAngleRef.current = { theta: 0.45, phi: 0.85, radius: 26 };
      targetCameraLookAtRef.current.set(0, 0.5, 0);
    } else if (preset === 'top') {
      cameraAngleRef.current = { theta: 0, phi: 0.18, radius: 28 };
      targetCameraLookAtRef.current.set(0, 0, 0);
    } else if (preset === 'server_focus') {
      cameraAngleRef.current = { theta: 0.6, phi: 0.95, radius: 14 };
      targetCameraLookAtRef.current.set(1.5, 1.2, 1.5);
    } else if (preset === 'front') {
      cameraAngleRef.current = { theta: 0, phi: 1.1, radius: 24 };
      targetCameraLookAtRef.current.set(0, 0.8, 0);
    }
  };

  return (
    <div className={`relative w-full h-full select-none overflow-hidden ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Floating 3D Node Selector Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none">
        {nodes.map((node) => {
          const isActive = node.id === activeNodeId;
          return (
            <button
              key={node.id}
              onClick={() => onSelectNode(node)}
              className={`pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold backdrop-blur-md transition-all shadow-md ${
                isActive
                  ? isLight
                    ? 'bg-white/95 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/30 scale-105 shadow-emerald-500/20'
                    : 'bg-slate-900/90 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30 scale-105 shadow-emerald-500/20'
                  : isLight
                  ? 'bg-white/80 border-slate-300 text-slate-700 hover:bg-white hover:text-slate-900'
                  : 'bg-slate-900/70 border-slate-700/60 text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
                style={{ backgroundColor: node.color }}
              />
              <span>{node.name}</span>
              {isActive && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Camera Presets & Fullscreen Toolbar */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/90 dark:bg-slate-900/90 light:bg-white/90 backdrop-blur-md border border-slate-700 dark:border-slate-800 light:border-slate-300 p-1.5 rounded-xl text-xs text-slate-300 shadow-2xl">
        <span className="text-slate-400 text-[11px] font-mono px-2 hidden sm:inline">Camera:</span>

        <button
          onClick={() => setViewPreset('isometric')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            cameraPreset === 'isometric'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Isometric Overview Angle"
        >
          3D Iso
        </button>

        <button
          onClick={() => setViewPreset('server_focus')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            cameraPreset === 'server_focus'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Zoom to Server Rack Core"
        >
          Rack View
        </button>

        <button
          onClick={() => setViewPreset('top')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            cameraPreset === 'top'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Top-Down Datacenter Topology"
        >
          Top View
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        {/* Fullscreen Toggle Button */}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            title={isFullscreen ? 'Exit Fullscreen Canvas' : 'Enter Fullscreen Simulation Canvas'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4 text-emerald-400" />}
          </button>
        )}
      </div>

      {/* Hover Info Tooltip */}
      {hoveredNode && (
        <div className="absolute top-16 right-4 z-20 w-76 bg-slate-900/95 dark:bg-slate-900/95 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-md pointer-events-none animate-fadeIn">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-3.5 h-3.5 rounded-full shadow"
              style={{ backgroundColor: hoveredNode.color }}
            />
            <h4 className="font-bold text-sm text-slate-100">{hoveredNode.name}</h4>
          </div>
          <p className="text-xs text-slate-400 mb-2">{hoveredNode.subtitle}</p>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
            <div>
              <span className="text-slate-500">Latency:</span>{' '}
              <span className="text-emerald-400 font-semibold">{hoveredNode.metrics.latencyMs}ms</span>
            </div>
            <div>
              <span className="text-slate-500">CPU:</span>{' '}
              <span className="text-cyan-400 font-semibold">{hoveredNode.metrics.cpuPercent}%</span>
            </div>
            <div>
              <span className="text-slate-500">Memory:</span>{' '}
              <span className="text-amber-400 font-semibold">{hoveredNode.metrics.memoryMb}MB</span>
            </div>
            <div>
              <span className="text-slate-500">Requests:</span>{' '}
              <span className="text-purple-400 font-semibold">{hoveredNode.metrics.requestCount}</span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-emerald-300 font-sans leading-relaxed">
            💡 Click to inspect deep architecture telemetry & real production code.
          </p>
        </div>
      )}
    </div>
  );
};
