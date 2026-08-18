export type ArchitectureMode = 'server-centric' | 'information-centric';

export type NodeType = 
  | 'client' 
  | 'edge' 
  | 'server' 
  | 'cache' 
  | 'database' 
  | 'worker'
  | 'consumer'
  | 'router'
  | 'in_network_cache'
  | 'producer'
  | 'ipfs_mesh'
  | 'key_authority';

export interface ArchitectureNode {
  id: string;
  name: string;
  subtitle: string;
  type: NodeType;
  position: [number, number, number]; // 3D coordinates [x, y, z]
  color: string;
  status: 'idle' | 'processing' | 'success' | 'warning' | 'error';
  metrics: {
    cpuPercent: number;
    memoryMb: number;
    latencyMs: number;
    activeConnections: number;
    requestCount: number;
  };
  details: {
    role: string;
    techStack: string;
    keyResponsibilities: string[];
    sampleConfig: string;
    serverCentricAdvantage?: string;
    informationCentricAdvantage?: string;
  };
}

export type PacketType = 
  | 'HTTP_GET' 
  | 'HTTP_POST_ACTION' 
  | 'CACHE_LOOKUP' 
  | 'CACHE_HIT' 
  | 'CACHE_MISS' 
  | 'SQL_QUERY' 
  | 'SQL_RESULT' 
  | 'SSR_COMPILE' 
  | 'HTML_STREAM' 
  | 'DOM_PATCH' 
  | 'SSE_EVENT'
  | 'INTEREST_PACKET'
  | 'NAMED_DATA_PACKET'
  | 'PIT_LOOKUP'
  | 'FIB_FORWARD'
  | 'CONTENT_STORE_HIT'
  | 'CONTENT_STORE_MISS'
  | 'MERKLE_PROOF'
  | 'CRYPTO_VERIFY'
  | 'MULTICAST_FANOUT'
  | 'DHT_RESOLVE';

export interface DataPacket {
  id: string;
  type: PacketType;
  fromNodeId: string;
  toNodeId: string;
  progress: number; // 0 to 1
  speed: number;
  label: string;
  sizeBytes: number;
  color: string;
  payloadPreview: string;
  stepIndex?: number;
  timestamp: number;
}

export interface SimulationStep {
  stepNumber: number;
  title: string;
  description: string;
  activeNodeId: string;
  packetType: PacketType;
  fromNodeId: string;
  toNodeId: string;
  durationMs: number;
  codeSnippet: {
    language: 'javascript' | 'html' | 'sql' | 'http' | 'json';
    filename: string;
    code: string;
    explanation: string;
  };
  networkDetails: {
    protocol: string;
    method: string;
    url: string;
    status: number;
    headers: Record<string, string>;
    body?: string;
  };
  serverStateDiff?: {
    action: string;
    previousState: string;
    newState: string;
  };
  clientVisualState: {
    browserUrl: string;
    domAction: string;
    renderedComponent: string;
    hydrationStatus: 'no_hydration_needed' | 'minimal_island' | 'complete';
  };
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  icon: string;
  category: 
    | 'SSR' 
    | 'Server Actions' 
    | 'Hypermedia/HTMX' 
    | 'Realtime/SSE' 
    | 'Caching' 
    | 'Resilience'
    | 'Name-Based Routing'
    | 'Content Addressing'
    | 'Pub/Sub Mesh'
    | 'Interest Aggregation'
    | 'Peer Partition';
  description: string;
  whyServerCentric?: string;
  whyInformationCentric?: string;
  steps: SimulationStep[];
}

export interface SystemMetrics {
  totalRequests: number;
  avgLatencyMs: number;
  cacheHitRatio: number;
  serverCpuUsage: number;
  clientJsMemoryMb: number;
  bandwidthSavedPercent: number;
  ttfbMs: number;
  fcpMs: number;
}

export interface ArchitectureComparison {
  dimension: string;
  serverCentric: {
    value: string;
    detail: string;
    score: number; // 1 to 5
    badgeType: 'positive' | 'neutral' | 'warning';
  };
  clientCentric?: {
    value: string;
    detail: string;
    score: number;
    badgeType: 'positive' | 'neutral' | 'warning';
  };
  informationCentric?: {
    value: string;
    detail: string;
    score: number;
    badgeType: 'positive' | 'neutral' | 'warning';
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  deepDiveNote: string;
}
