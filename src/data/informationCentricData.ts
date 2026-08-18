import { ArchitectureNode, ScenarioDefinition, ArchitectureComparison, QuizQuestion } from '../types';

export const INITIAL_ICN_SYSTEM_NODES: ArchitectureNode[] = [
  {
    id: 'consumer',
    name: 'Consumer Node',
    subtitle: 'Requesting Device & Signature Verifier',
    type: 'consumer',
    position: [-6, 0, 2],
    color: '#06b6d4', // cyan
    status: 'idle',
    metrics: {
      cpuPercent: 5,
      memoryMb: 45,
      latencyMs: 8,
      activeConnections: 3,
      requestCount: 38,
    },
    details: {
      role: 'Expresses interest in content by hierarchical Name or cryptographic CID. Verifies data signatures upon arrival.',
      techStack: 'NDN-JS, IPFS Kubo/Helia, libp2p, WebCrypto Subsystem',
      keyResponsibilities: [
        'Generate Interest Packets containing Content Name, Selectors, and Nonce',
        'Maintain zero binding to physical host IP addresses or server hostnames',
        'Verify asymmetric cryptographic signatures using publisher public keys',
        'Assemble chunked Merkle DAG blocks into cohesive data streams',
      ],
      sampleConfig: `// Express Interest in Named Data Object (NDN)
const interest = new Interest(new Name('/media/science/quantum-2026/paper.pdf'));
interest.setMustBeFresh(true);
interest.setInterestLifetimeMilliseconds(4000);
face.expressInterest(interest, (interest, data) => {
  const verified = await KeyChain.verifyData(data);
  console.log('Verified Content Received:', data.getContent().toString());
});`,
      informationCentricAdvantage: 'Consumers request WHAT they need (Information Name), not WHERE it is hosted (IP/Server). Content can be served by any peer or router safely because the data itself is cryptographically signed.',
    },
  },
  {
    id: 'router',
    name: 'ICN Access Forwarder',
    subtitle: 'CS · PIT · FIB State Engine',
    type: 'router',
    position: [-2.5, 0, -1],
    color: '#6366f1', // indigo
    status: 'idle',
    metrics: {
      cpuPercent: 18,
      memoryMb: 256,
      latencyMs: 2,
      activeConnections: 480,
      requestCount: 1890,
    },
    details: {
      role: 'Core routing switch maintaining Content Store (CS), Pending Interest Table (PIT), and Forwarding Information Base (FIB).',
      techStack: 'NFD (Named Data Networking Forwarding Daemon), DPDK, eBPF / XDP',
      keyResponsibilities: [
        'Content Store (CS): Lookup cached Data Packets by name for sub-millisecond local reply',
        'Pending Interest Table (PIT): Record pending downstream interfaces & aggregate duplicate Interests',
        'Forwarding Information Base (FIB): Name prefix longest-match routing to upstream interfaces',
        'Multicast Data Packet fanout back along PIT trail without source routing',
      ],
      sampleConfig: `# NDN Forwarding Daemon (NFD) Rule
tables:
  cs_max_packets: 65536
  cs_policy: lru
  pit_max_entries: 131072
strategy_choice:
  prefix: /media/science
  strategy: /localhost/nfd/strategy/multicast/%FD%01`,
      informationCentricAdvantage: 'Collapses storm traffic through PIT aggregation: 1,000 users asking for the same live video segment generate only 1 upstream request, with the response multicasted locally.',
    },
  },
  {
    id: 'in_network_cache',
    name: 'In-Network Content Store',
    subtitle: 'Ubiquitous Transit Cache Node',
    type: 'in_network_cache',
    position: [0.5, 0, 2],
    color: '#3b82f6', // blue
    status: 'idle',
    metrics: {
      cpuPercent: 14,
      memoryMb: 1024,
      latencyMs: 1,
      activeConnections: 210,
      requestCount: 3100,
    },
    details: {
      role: 'Transparent, router-integrated in-network cache storing cryptographically verified Named Data Objects.',
      techStack: 'NVMe Fast Store, Content Store Memory Index, LRU Cache Eviction',
      keyResponsibilities: [
        'Intercept transit Interest packets and resolve instantly on cache hits',
        'Store signed data objects regardless of who requested or published them',
        'Deduplicate byte storage across multiple applications via content hashing',
        'Provide sub-millisecond edge data distribution across the transit mesh',
      ],
      sampleConfig: `// In-Network Cache Lookup Pipeline
if (contentStore.has(interest.getName())) {
  const signedData = contentStore.get(interest.getName());
  if (!signedData.isExpired()) {
    sendDataDownstream(interest.getIncomingFace(), signedData);
    return; // Served locally without touching upstream publisher
  }
}`,
      informationCentricAdvantage: 'Data is cached natively at the network layer in intermediate routers. Every hop is a CDN without requiring third-party commercial reverse proxies or DNS hacks.',
    },
  },
  {
    id: 'producer',
    name: 'Origin Data Producer',
    subtitle: 'Authoritative Cryptographic Signer',
    type: 'producer',
    position: [4.5, 0, 1.5],
    color: '#8b5cf6', // violet
    status: 'idle',
    metrics: {
      cpuPercent: 22,
      memoryMb: 512,
      latencyMs: 4,
      activeConnections: 64,
      requestCount: 420,
    },
    details: {
      role: 'Generates original information objects and signs every chunk with its cryptographic private key before publishing.',
      techStack: 'Ed25519 / RSA-4096 Signer, NDN Producer Library, Content Chunking Pipeline',
      keyResponsibilities: [
        'Structure information into hierarchical canonical name spaces (e.g., /org/dept/dataset/v1)',
        'Sign (Name + Content + Metadata + KeyLocator) as an immutable Data Packet',
        'Publish routing prefixes to network FIB tables',
        'Maintain zero continuous point-to-point connection state with consumers',
      ],
      sampleConfig: `// Producer signs Data Object
const data = new Data(new Name('/media/science/quantum-2026/paper.pdf/v1/s0'));
data.setContent(pdfChunkBuffer);
data.getMetaInfo().setFreshnessPeriod(86400000); // 24 hours
await keyChain.sign(data, signingCertificate);
face.putData(data);`,
      informationCentricAdvantage: 'The producer can go offline immediately after publishing. Because data objects are self-verifying, intermediate caches and peer nodes continue serving authentic content indefinitely.',
    },
  },
  {
    id: 'ipfs_mesh',
    name: 'Distributed Content Mesh',
    subtitle: 'DHT & Content Addressing (CID/IPFS)',
    type: 'ipfs_mesh',
    position: [2.5, 0, -2],
    color: '#ec4899', // pink
    status: 'idle',
    metrics: {
      cpuPercent: 11,
      memoryMb: 380,
      latencyMs: 5,
      activeConnections: 120,
      requestCount: 750,
    },
    details: {
      role: 'Decentralized peer mesh indexing data objects by cryptographic hash (CID) over a Kademlia Distributed Hash Table (DHT).',
      techStack: 'IPFS / libp2p, Kademlia DHT, Bitswap Block Exchange, UnixFS',
      keyResponsibilities: [
        'Content Addressing: Map SHA-256 / Blake3 hash CIDs to provider peer multiaddresses',
        'Bitswap Swarm: Exchange Merkle DAG blocks in parallel from multiple peer nodes',
        'Self-healing resilient topology without single point of failure',
        'Deduplicate files globally: identical byte contents share exact same CID',
      ],
      sampleConfig: `// Bitswap Block Swarm Fetch
const cid = CID.parse('bafybeihdwdcefgh4dqkjv67...');
const block = await ipfs.block.get(cid);
// Validate block hash matches CID
assert(hash(block.data) === cid.multihash);`,
      informationCentricAdvantage: 'Downloads chunks concurrently from 10 nearest peers simultaneously, saturated full bandwidth without overloading any single origin server.',
    },
  },
  {
    id: 'key_authority',
    name: 'Trust Schema & Key Root',
    subtitle: 'Cryptographic Provenance & PKI',
    type: 'key_authority',
    position: [5.5, 0, -1],
    color: '#10b981', // emerald
    status: 'idle',
    metrics: {
      cpuPercent: 8,
      memoryMb: 190,
      latencyMs: 3,
      activeConnections: 35,
      requestCount: 310,
    },
    details: {
      role: 'Establishes cryptographic trust schemas defining which keys are authorized to sign specific name prefixes.',
      techStack: 'NDN Trust Schemas, X.509 / DID (Decentralized Identifiers), Web of Trust',
      keyResponsibilities: [
        'Issue and anchor publisher signing certificates and KeyLocator chains',
        'Enforce prefix-to-key authorization rules (e.g., only /gov/weather/key can sign /gov/weather/*)',
        'Provide public key certificates via standard Named Data Packets',
        'Enable offline verification of information provenance without contacting central CAs',
      ],
      sampleConfig: `// Trust Schema Definition
rule {
  for data
  filter { type name regex ^<media><science><>*$ }
  checker {
    type customized
    sig-type rsa-sha256
    key-locator { type name regex ^<media><science><KEY><>*$ }
  }
}`,
      informationCentricAdvantage: 'Security is bound directly to the DATA itself, not to the TLS communication channel. Even if a router is malicious or compromised, it cannot alter data without invalidating the cryptographic signature.',
    },
  },
];

export const ICN_SYSTEM_NODES = INITIAL_ICN_SYSTEM_NODES;

export const ICN_SIMULATION_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'icn_scenario_name_routing',
    name: 'Name-Based Routing & In-Network Content Store Hit',
    shortName: 'Name Routing & CS Hit',
    tagline: 'Requesting by Name (/media/science/paper.pdf) & Sub-ms In-Network Cache Reply',
    icon: 'Search',
    category: 'Name-Based Routing',
    description: 'Demonstrates how a consumer requests content by hierarchical name rather than IP address. The Interest packet travels across ICN forwarders until an in-network router discovers the verified signed Data Packet in its Content Store (CS) and returns it immediately.',
    whyInformationCentric: 'In traditional networking (TCP/IP), the client must know the IP address of a specific server. In Information-Centric Networking (NDN/ICN), the network routes by the name of the data itself, enabling any intermediate router with a cached copy to reply securely.',
    steps: [
      {
        stepNumber: 1,
        title: 'Consumer Expresses Interest Packet',
        description: 'The consumer application needs a research paper. Instead of opening a TCP connection to a server IP, it emits an Interest Packet addressed to the hierarchical name /media/science/quantum-2026/paper.pdf with a unique random Nonce.',
        activeNodeId: 'consumer',
        packetType: 'INTEREST_PACKET',
        fromNodeId: 'consumer',
        toNodeId: 'router',
        durationMs: 1200,
        codeSnippet: {
          language: 'javascript',
          filename: 'consumer_client.js',
          code: `import { Interest, Name } from '@ndn/packet';

// 1. Create hierarchical content name
const contentName = new Name('/media/science/quantum-2026/paper.pdf');

// 2. Build Interest packet with Freshness selector and Nonce
const interest = new Interest(contentName);
interest.mustBeFresh = true;
interest.nonce = crypto.randomBytes(4);

// 3. Dispatch to local ICN Forwarder face
console.log('[NDN] Expressing Interest for:', interest.name.toString());
await face.expressInterest(interest);`,
          explanation: 'The application states WHAT information it desires without any knowledge of server locations or IP addresses. The random Nonce prevents routing loops.',
        },
        networkDetails: {
          protocol: 'NDN / ICN (Layer 3)',
          method: 'EXPRESS_INTEREST',
          url: 'ndn:/media/science/quantum-2026/paper.pdf',
          status: 100,
          headers: {
            'Packet-Type': 'Interest',
            'Content-Name': '/media/science/quantum-2026/paper.pdf',
            'Nonce': '0x8FA4B219',
            'Interest-Lifetime': '4000ms',
            'Hop-Limit': '32',
          },
        },
        serverStateDiff: {
          action: 'CONSUMER_INTEREST_EMITTED',
          previousState: 'Consumer State: Awaiting user action',
          newState: 'Consumer State: Pending Interest [/media/science/quantum-2026/paper.pdf]',
        },
        clientVisualState: {
          browserUrl: 'ndn://media/science/quantum-2026/paper.pdf',
          domAction: 'Displaying fetching state: Looking up verified Named Data in mesh...',
          renderedComponent: 'ResearchPaperView (Loading State)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 2,
        title: 'Access Router CS Lookup & PIT Table Entry',
        description: 'The access router checks its local Content Store (CS). It is a Cache Miss. The router records the incoming interface face in its Pending Interest Table (PIT) so it knows where to return the data when received.',
        activeNodeId: 'router',
        packetType: 'PIT_LOOKUP',
        fromNodeId: 'router',
        toNodeId: 'in_network_cache',
        durationMs: 1100,
        codeSnippet: {
          language: 'javascript',
          filename: 'nfd_forwarder.c',
          code: `// Step A: Check local Content Store
Data* cachedData = ContentStore_lookup(interest->name);
if (cachedData != NULL) {
  // CS Hit -> Return immediately
  Forwarder_sendData(interest->incomingFace, cachedData);
  return;
}

// Step B: Record in Pending Interest Table (PIT)
PitEntry* pitEntry = PIT_insertOrAggregate(interest->name, interest->incomingFace);
printf("[PIT] Aggregated Interest on Face %d for %s\\n", 
       interest->incomingFace, interest->name);

// Step C: FIB Longest-Prefix Match for Next Hop
FibEntry* fibEntry = FIB_longestPrefixMatch(interest->name);
Forwarder_sendInterest(fibEntry->nextHopFace, interest);`,
          explanation: 'The forwarder executes the 3-tier ICN forwarding pipeline: Content Store (CS) -> Pending Interest Table (PIT) -> Forwarding Information Base (FIB).',
        },
        networkDetails: {
          protocol: 'NDN / ICN Forwarding Pipeline',
          method: 'CS_MISS_AND_PIT_REGISTER',
          url: 'nfd://forwarder/pit/register',
          status: 200,
          headers: {
            'CS-Status': 'MISS',
            'PIT-Entry': 'CREATED [Face 0 -> /media/science/quantum-2026/paper.pdf]',
            'FIB-Next-Hop': 'Face 3 (Transit Mesh Link)',
          },
        },
        serverStateDiff: {
          action: 'PIT_ENTRY_REGISTERED',
          previousState: 'PIT Entries: 14 pending',
          newState: 'PIT Entries: 15 pending (+ /media/science/quantum-2026/paper.pdf on Face 0)',
        },
        clientVisualState: {
          browserUrl: 'ndn://media/science/quantum-2026/paper.pdf',
          domAction: 'Interest routed across access forwarder into high-speed fiber transit mesh',
          renderedComponent: 'ResearchPaperView (Mesh Traversal)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 3,
        title: 'Transit In-Network Cache Content Store HIT',
        description: 'The Interest packet arrives at an intermediate in-network transit router. The transit router checks its high-capacity Content Store and finds a MATCH: a fresh, cryptographically signed Data Packet published earlier by the author.',
        activeNodeId: 'in_network_cache',
        packetType: 'CONTENT_STORE_HIT',
        fromNodeId: 'in_network_cache',
        toNodeId: 'router',
        durationMs: 1200,
        codeSnippet: {
          language: 'javascript',
          filename: 'transit_content_store.rs',
          code: `// Transit Node In-Network Content Store Match
let name_query = interest.name();
if let Some(signed_data) = cs_index.get(name_query) {
    if !signed_data.is_freshness_expired() {
        println!("[CS HIT] Serving signed payload from NVMe In-Network Cache in 0.4ms");
        // No need to query origin producer! Return signed data immediately.
        router.send_data_downstream(interest.incoming_face(), &signed_data)?;
    }
}`,
          explanation: 'Because data is self-verifying, ANY router that previously forwarded this object can safely satisfy subsequent requests without contacting the origin producer.',
        },
        networkDetails: {
          protocol: 'NDN / ICN Data Transmission',
          method: 'CONTENT_STORE_HIT_REPLY',
          url: 'ndn:/media/science/quantum-2026/paper.pdf',
          status: 200,
          headers: {
            'Cache-Result': 'CONTENT_STORE_HIT',
            'Latency-Served': '0.4ms',
            'Signature-Algorithm': 'Ed25519',
            'Key-Locator': '/media/science/KEY/author-pubkey',
          },
        },
        serverStateDiff: {
          action: 'CONTENT_STORE_HIT_SERVED',
          previousState: 'Transit CS Hits: 4,120',
          newState: 'Transit CS Hits: 4,121 (Sub-millisecond local reply)',
        },
        clientVisualState: {
          browserUrl: 'ndn://media/science/quantum-2026/paper.pdf',
          domAction: 'In-network cache hit located! Data Packet traveling down reverse PIT trail...',
          renderedComponent: 'ResearchPaperView (Data Inbound)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 4,
        title: 'Data Packet Follows Reverse PIT Trail',
        description: 'The signed Data Packet travels backwards along the exact trail of Pending Interest Table breadcrumbs. The access router caches the object in its own Content Store and forwards it to the consumer interface face.',
        activeNodeId: 'router',
        packetType: 'NAMED_DATA_PACKET',
        fromNodeId: 'router',
        toNodeId: 'consumer',
        durationMs: 1100,
        codeSnippet: {
          language: 'javascript',
          filename: 'nfd_reverse_path.c',
          code: `// On Data Packet Arrival at Access Forwarder:
PitEntry* entry = PIT_findMatch(data->name);
if (entry != NULL) {
  // 1. Populate local Content Store for future users
  ContentStore_insert(data);
  
  // 2. Multicast out to all recorded downstream faces
  for (int faceIdx = 0; faceIdx < entry->downstreamFaceCount; faceIdx++) {
    Forwarder_sendData(entry->downstreamFaces[faceIdx], data);
  }
  
  // 3. Consume & erase PIT entry
  PIT_erase(entry);
}`,
          explanation: 'Data packets require no destination IP headers. They follow the stateful PIT breadcrumb trail set up by the forward Interest packet.',
        },
        networkDetails: {
          protocol: 'NDN / ICN Data Propagation',
          method: 'PIT_BREADCRUMB_CONSUMPTION',
          url: 'ndn:/media/science/quantum-2026/paper.pdf',
          status: 200,
          headers: {
            'Payload-Size': '48,290 bytes',
            'Freshness-Period': '86400s',
            'Content-Type': 'application/pdf',
            'PIT-Entries-Consumed': '1',
          },
        },
        serverStateDiff: {
          action: 'ACCESS_ROUTER_CS_CACHED',
          previousState: 'Access Router CS: 8,420 items',
          newState: 'Access Router CS: 8,421 items (+ cached /media/science/quantum-2026/paper.pdf)',
        },
        clientVisualState: {
          browserUrl: 'ndn://media/science/quantum-2026/paper.pdf',
          domAction: 'Signed Data Packet received by Consumer. Verifying Ed25519 signature against Publisher Trust Schema...',
          renderedComponent: 'ResearchPaperView (Cryptographic Verification)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 5,
        title: 'Consumer Cryptographic Verification & Display',
        description: 'The consumer client verifies the author’s digital signature using the Public Key specified in the Data Packet KeyLocator. The cryptographic proof passes 100%, proving zero tampering occurred during transit. The document renders instantly.',
        activeNodeId: 'consumer',
        packetType: 'CRYPTO_VERIFY',
        fromNodeId: 'key_authority',
        toNodeId: 'consumer',
        durationMs: 1000,
        codeSnippet: {
          language: 'javascript',
          filename: 'client_crypto_verifier.js',
          code: `// Verify Cryptographic Provenance
const isSignatureValid = await KeyChain.verifySignature({
  signedData: dataPacket.getContent(),
  signatureBits: dataPacket.getSignature(),
  keyLocatorName: dataPacket.getKeyLocator().getName()
});

if (isSignatureValid) {
  console.log('✅ Signature verified authentic by /media/science/KEY/author-pubkey');
  document.getElementById('paper-container').innerHTML = renderPdfDoc(dataPacket.getContent());
} else {
  throw new Error('❌ Cryptographic verification failed! Discarding poisoned packet.');
}`,
          explanation: 'Security is bound directly to the DATA object, not to a TLS tunnel. The consumer knows the data is authentic even though it was fetched from an untrusted intermediate router cache.',
        },
        networkDetails: {
          protocol: 'WebCrypto / NDN Trust Schema',
          method: 'ASYMMETRIC_VERIFY_SUCCESS',
          url: 'trust://media/science/KEY/author-pubkey',
          status: 200,
          headers: {
            'Verification-Status': 'CRYPTOGRAPHICALLY_AUTHENTIC',
            'Signer': '/media/science/author/dr-chen',
            'Trust-Root': 'Verified by National Science Foundation Key Root',
          },
        },
        serverStateDiff: {
          action: 'CLIENT_VERIFICATION_COMPLETE',
          previousState: 'Consumer Document: Blank',
          newState: 'Consumer Document: Rendered authentic Research Paper (Total fetch time: 14ms)',
        },
        clientVisualState: {
          browserUrl: 'ndn://media/science/quantum-2026/paper.pdf',
          domAction: 'Rendered authentic paper: "Scalable Quantum Coherence in Room-Temperature Nanowires"',
          renderedComponent: 'ResearchPaperView (Active Display)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
    ],
  },
  {
    id: 'icn_scenario_content_addressing',
    name: 'Content Addressing (CID) & Swarm Assembly',
    shortName: 'CID & Swarm Assembly',
    tagline: 'Cryptographic Hash Addressing (bafy...) & Multi-Peer Parallel Retrieval',
    icon: 'Cpu',
    category: 'Content Addressing',
    description: 'Demonstrates content addressing using cryptographic hashes (CIDs/IPFS). The consumer queries a unique content hash; the DHT resolves nearest peer providers, and chunks are retrieved simultaneously from multiple peers and verified against a Merkle DAG root.',
    whyInformationCentric: 'Content addressing ensures mathematical immutability. If a single bit in a 100GB file is altered, its CID changes. Clients can download separate chunks simultaneously from 10 different peers without trusting any of them.',
    steps: [
      {
        stepNumber: 1,
        title: 'Consumer Queries Content Identifier (CID)',
        description: 'The consumer requests an immutable 4K video asset by its Content Identifier (CID): bafybeihdwdcefgh4dqkjv67...',
        activeNodeId: 'consumer',
        packetType: 'DHT_RESOLVE',
        fromNodeId: 'consumer',
        toNodeId: 'ipfs_mesh',
        durationMs: 1100,
        codeSnippet: {
          language: 'javascript',
          filename: 'ipfs_client.js',
          code: `import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { CID } from 'multiformats/cid';

const helia = await createHelia();
const fs = unixfs(helia);

const targetCid = CID.parse('bafybeihdwdcefgh4dqkjv67vxomr7oml');
console.log('Querying DHT for providers of CID:', targetCid.toString());
const providers = await helia.routing.findProviders(targetCid);`,
          explanation: 'The request is for an exact cryptographic hash. It does not specify which server or domain hosts it.',
        },
        networkDetails: {
          protocol: 'libp2p Kademlia DHT',
          method: 'FIND_PROVIDERS',
          url: 'dht://providers/bafybeihdwdcefgh4dqkjv67vxomr7oml',
          status: 200,
          headers: {
            'Target-CID': 'bafybeihdwdcefgh4dqkjv67vxomr7oml',
            'Hash-Algorithm': 'SHA-256 (Multihash 0x12)',
            'Codec': 'dag-pb (0x70)',
          },
        },
        serverStateDiff: {
          action: 'DHT_LOOKUP_INITIATED',
          previousState: 'DHT Peer Table: 45 connected peers',
          newState: 'DHT Peer Table: Discovered 4 provider multiaddresses for CID',
        },
        clientVisualState: {
          browserUrl: 'ipfs://bafybeihdwdcefgh4dqkjv67vxomr7oml',
          domAction: 'DHT query complete: Found 4 active swarm peers holding Merkle DAG chunks',
          renderedComponent: 'MediaAssetPlayer (Swarm Connect)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 2,
        title: 'Parallel Bitswap Multi-Peer Retrieval',
        description: 'The consumer opens parallel Bitswap channels to 3 peer nodes simultaneously, fetching Chunk #0, Chunk #1, and Chunk #2 concurrently at line rate.',
        activeNodeId: 'ipfs_mesh',
        packetType: 'NAMED_DATA_PACKET',
        fromNodeId: 'ipfs_mesh',
        toNodeId: 'consumer',
        durationMs: 1200,
        codeSnippet: {
          language: 'javascript',
          filename: 'bitswap_swarm.js',
          code: `// Bitswap Block Exchange across Swarm
const chunkPromises = [
  fetchBlockFromPeer(peer1, chunk0Cid),
  fetchBlockFromPeer(peer2, chunk1Cid),
  fetchBlockFromPeer(peer3, chunk2Cid),
];

const blocks = await Promise.all(chunkPromises);
console.log('Retrieved 3 chunks concurrently in 6.2ms over peer mesh');`,
          explanation: 'Bandwidth is aggregated across all nearby peers rather than bottlenecking on a single centralized origin.',
        },
        networkDetails: {
          protocol: 'Bitswap 1.2.0 / libp2p',
          method: 'BLOCK_EXCHANGE_MULTI_PEER',
          url: 'bitswap://mesh/stream',
          status: 200,
          headers: {
            'Chunks-Transferred': '3 blocks (768 KB total)',
            'Peers-Utilized': 'Peer_Alpha, Peer_Beta, Peer_Gamma',
            'Throughput': '124 MB/s',
          },
        },
        serverStateDiff: {
          action: 'SWARM_CHUNKS_RECEIVED',
          previousState: 'Client Buffer: 0 KB',
          newState: 'Client Buffer: 768 KB (All 3 Merkle chunks received)',
        },
        clientVisualState: {
          browserUrl: 'ipfs://bafybeihdwdcefgh4dqkjv67vxomr7oml',
          domAction: 'All Merkle blocks received from swarm. Computing SHA-256 DAG root...',
          renderedComponent: 'MediaAssetPlayer (DAG Verifying)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 3,
        title: 'Merkle DAG Root Verification & Render',
        description: 'The consumer computes the cryptographic hash of the assembled blocks and confirms it matches the root CID exactly. The 4K video asset begins playing instantly.',
        activeNodeId: 'consumer',
        packetType: 'MERKLE_PROOF',
        fromNodeId: 'consumer',
        toNodeId: 'consumer',
        durationMs: 1000,
        codeSnippet: {
          language: 'javascript',
          filename: 'dag_validator.js',
          code: `// Compute Merkle Root of assembled chunks
const computedRoot = await computeMerkleRoot(blocks);
if (computedRoot.equals(targetCid)) {
  console.log('✅ Merkle DAG integrity mathematically proven!');
  videoPlayer.src = URL.createObjectURL(new Blob(blocks));
  videoPlayer.play();
}`,
          explanation: 'Mathematically guarantees that no peer provided corrupted or malicious data without needing TLS certificates or centralized audits.',
        },
        networkDetails: {
          protocol: 'Merkle DAG Validation',
          method: 'ROOT_HASH_VERIFY',
          url: 'ipfs://dag/verify',
          status: 200,
          headers: {
            'Merkle-Root-Match': 'TRUE (Exact Bitwise Equality)',
            'Assembled-Asset': 'quantum_simulation_4k.mp4',
            'Integrity-Score': '100%',
          },
        },
        serverStateDiff: {
          action: 'MERKLE_ASSEMBLY_COMPLETE',
          previousState: 'Player: Idle',
          newState: 'Player: Playing verified decentralized media stream',
        },
        clientVisualState: {
          browserUrl: 'ipfs://bafybeihdwdcefgh4dqkjv67vxomr7oml',
          domAction: 'Video playing smoothly: Verified Merkle DAG 4K Stream',
          renderedComponent: 'MediaAssetPlayer (Active Playback)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
    ],
  },
  {
    id: 'icn_scenario_interest_aggregation',
    name: 'Interest Aggregation & Flash Crowd Storm Defense',
    shortName: 'Flash Crowd Storm Defense',
    tagline: 'Collapsing 1,000 Concurrent Requests into 1 Upstream Packet via PIT Tables',
    icon: 'Radio',
    category: 'Interest Aggregation',
    description: 'Demonstrates how ICN eliminates server-crushing flash crowds. When thousands of consumers request the same live stream chunk simultaneously, routers collapse all requests into a single Pending Interest Table (PIT) entry, forwarding only 1 request upstream and multicasting the single response back to all consumers.',
    whyInformationCentric: 'In TCP/IP, 10,000 users watching a live event generate 10,000 independent TCP connections and 10,000 duplicate packet streams from the server. In ICN, the network natively aggregates Interests, saving 99%+ bandwidth.',
    steps: [
      {
        stepNumber: 1,
        title: 'Flash Crowd: 50 Consumers Express Same Interest',
        description: 'A breaking news event goes live at /live/news/stream/chunk-940. Fifty distinct consumer devices request the chunk at the exact same millisecond.',
        activeNodeId: 'consumer',
        packetType: 'INTEREST_PACKET',
        fromNodeId: 'consumer',
        toNodeId: 'router',
        durationMs: 1200,
        codeSnippet: {
          language: 'javascript',
          filename: 'simulated_flash_crowd.js',
          code: `// 50 concurrent consumer devices request live chunk
for (let i = 0; i < 50; i++) {
  const interest = new Interest('/live/news/stream/chunk-940');
  face[i].expressInterest(interest);
}`,
          explanation: 'A sudden burst of interest packets arrives at the access router simultaneously.',
        },
        networkDetails: {
          protocol: 'NDN / ICN Multi-Face Ingress',
          method: 'CONCURRENT_INTEREST_BURST',
          url: 'ndn:/live/news/stream/chunk-940',
          status: 100,
          headers: {
            'Concurrent-Requests': '50 consumers',
            'Target-Chunk': '/live/news/stream/chunk-940',
          },
        },
        serverStateDiff: {
          action: 'BURST_INGRESS_DETECTED',
          previousState: 'Ingress Load: Normal',
          newState: 'Ingress Load: 50 concurrent Interests on /live/news/stream/chunk-940',
        },
        clientVisualState: {
          browserUrl: 'ndn://live/news/stream/chunk-940',
          domAction: 'Flash crowd detected! 50 consumers requesting live video chunk...',
          renderedComponent: 'LiveStreamPlayer (Burst Ingress)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 2,
        title: 'Router Collapses Requests into 1 PIT Entry',
        description: 'The router detects that an Interest for /live/news/stream/chunk-940 is already pending. Instead of forwarding 50 requests upstream, it records all 50 incoming interfaces into 1 single PIT table entry and forwards only ONE packet upstream!',
        activeNodeId: 'router',
        packetType: 'PIT_LOOKUP',
        fromNodeId: 'router',
        toNodeId: 'producer',
        durationMs: 1100,
        codeSnippet: {
          language: 'javascript',
          filename: 'pit_aggregation.c',
          code: `// PIT Aggregation Engine
PitEntry* entry = PIT_find('/live/news/stream/chunk-940');
if (entry != NULL) {
  // Existing entry found! Aggregate downstream face list:
  entry->downstreamFaces.push_back(newIncomingFace);
  printf("[PIT] Aggregated face %d. Total waiting: %d (Zero upstream packets sent!)\\n", 
         newIncomingFace, entry->downstreamFaces.size());
  return; // Suppress duplicate upstream forward
}`,
          explanation: 'Massive bandwidth savings: 98% of upstream traffic is eliminated right at the network edge.',
        },
        networkDetails: {
          protocol: 'PIT Interest Aggregation',
          method: 'COLLAPSE_DUPLICATES',
          url: 'nfd://pit/aggregate',
          status: 200,
          headers: {
            'Total-Interests-Received': '50',
            'Interests-Forwarded-Upstream': '1 (98% reduction)',
            'PIT-Downstream-Faces': '50 registered faces',
          },
        },
        serverStateDiff: {
          action: 'PIT_AGGREGATION_ACTIVE',
          previousState: 'Upstream Traffic: 50 potential requests',
          newState: 'Upstream Traffic: Exactly 1 single Interest sent to Producer',
        },
        clientVisualState: {
          browserUrl: 'ndn://live/news/stream/chunk-940',
          domAction: 'Router aggregated 50 requests into 1 upstream packet. Awaiting Producer response...',
          renderedComponent: 'LiveStreamPlayer (Aggregated)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 3,
        title: 'Single Response Multicast Fanout to All 50 Clients',
        description: 'The Producer sends back ONE signed Data Packet. The router receives it, caches it in its Content Store, and natively multicasts copies out to all 50 waiting consumer interfaces in a single clock cycle.',
        activeNodeId: 'router',
        packetType: 'MULTICAST_FANOUT',
        fromNodeId: 'producer',
        toNodeId: 'consumer',
        durationMs: 1200,
        codeSnippet: {
          language: 'javascript',
          filename: 'multicast_dispatch.c',
          code: `// Fanout Data Packet to all 50 waiting faces
ContentStore_insert(dataPacket);
for (Face* face : pitEntry->downstreamFaces) {
  face->send(dataPacket);
}
PIT_erase(pitEntry);
printf("[MULTICAST] Successfully satisfied 50 consumers from 1 upstream response!\\n");`,
          explanation: 'Every consumer receives the live stream chunk simultaneously without server degradation.',
        },
        networkDetails: {
          protocol: 'NDN Native In-Network Multicast',
          method: 'PARALLEL_FANOUT',
          url: 'ndn:/live/news/stream/chunk-940',
          status: 200,
          headers: {
            'Data-Packets-Received': '1',
            'Consumers-Satisfied': '50',
            'Origin-Server-Load': 'Minimal (1 request handled)',
          },
        },
        serverStateDiff: {
          action: 'FANOUT_COMPLETE',
          previousState: 'Waiting Clients: 50',
          newState: 'Waiting Clients: 0 (All 50 streaming live synchronously)',
        },
        clientVisualState: {
          browserUrl: 'ndn://live/news/stream/chunk-940',
          domAction: 'All 50 consumer screens painting live news broadcast smoothly!',
          renderedComponent: 'LiveStreamPlayer (Active Broadcast)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
    ],
  },
  {
    id: 'icn_scenario_pubsub_mesh',
    name: 'Pub/Sub Information Mesh & Cryptographic Provenance',
    shortName: 'Pub/Sub Information Mesh',
    tagline: 'Decoupled Publish-Subscribe Event Mesh with Asymmetric Signature Chaining',
    icon: 'Zap',
    category: 'Pub/Sub Mesh',
    description: 'Demonstrates distributed publish-subscribe without centralized message brokers. Producers publish signed data into topic namespaces; network forwarders match subscribers and route data autonomously while consumers verify cryptographic provenance.',
    whyInformationCentric: 'Traditional Pub/Sub requires large centralized clusters (Kafka/RabbitMQ) with broker single points of failure. ICN turns the physical network fabric into a native, decentralized pub/sub broker.',
    steps: [
      {
        stepNumber: 1,
        title: 'IoT Sensor Node Publishes Signed Telemetry',
        description: 'An environmental IoT sensor records telemetry data, prefixes it to /iot/city/air-quality/sensor-88, and signs the payload with its onboard hardware secure element.',
        activeNodeId: 'producer',
        packetType: 'NAMED_DATA_PACKET',
        fromNodeId: 'producer',
        toNodeId: 'router',
        durationMs: 1100,
        codeSnippet: {
          language: 'javascript',
          filename: 'iot_producer.js',
          code: `const telemetryPayload = JSON.stringify({
  pm25: 12.4,
  co2: 410,
  tempC: 21.8,
  timestamp: Date.now()
});

const data = new Data('/iot/city/air-quality/sensor-88/v1');
data.setContent(Buffer.from(telemetryPayload));
await secureElement.sign(data);
face.publish(data);`,
          explanation: 'The sensor publishes signed telemetry directly into the information fabric.',
        },
        networkDetails: {
          protocol: 'NDN Pub/Sub Fabric',
          method: 'PUBLISH_NAMED_DATA',
          url: 'ndn:/iot/city/air-quality/sensor-88/v1',
          status: 200,
          headers: {
            'Topic': '/iot/city/air-quality/sensor-88',
            'Signature': 'ECDSA-SHA256',
            'Key-Locator': '/iot/city/KEY/sensor-88-pubkey',
          },
        },
        serverStateDiff: {
          action: 'TELEMETRY_PUBLISHED',
          previousState: 'Sensor State: Sampling',
          newState: 'Sensor State: Signed Data Packet Published to Fabric',
        },
        clientVisualState: {
          browserUrl: 'ndn://iot/city/air-quality/sensor-88',
          domAction: 'IoT Sensor published telemetry. Network forwarders matching active prefix subscribers...',
          renderedComponent: 'CityTelemetryDashboard (Subscribed)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 2,
        title: 'Fabric Dispatches to Subscribed City Dashboards',
        description: 'Network forwarders check active prefix subscriptions and immediately route the Data Packet to all registered city monitoring dashboards without contacting any central server.',
        activeNodeId: 'router',
        packetType: 'NAMED_DATA_PACKET',
        fromNodeId: 'router',
        toNodeId: 'consumer',
        durationMs: 1200,
        codeSnippet: {
          language: 'javascript',
          filename: 'city_dashboard_subscriber.js',
          code: `// Subscribe to all sensors under /iot/city/air-quality/*
face.subscribe('/iot/city/air-quality', async (data) => {
  const isValid = await verifyTrustSchema(data);
  if (isValid) {
    const reading = JSON.parse(data.getContent().toString());
    updateAirQualityGauge(reading);
  }
});`,
          explanation: 'Subscribers receive data purely based on the prefix subscription. No broker IP or port configuration needed.',
        },
        networkDetails: {
          protocol: 'NDN Prefix Forwarding',
          method: 'PREFIX_MATCH_DISPATCH',
          url: 'ndn:/iot/city/air-quality/sensor-88/v1',
          status: 200,
          headers: {
            'Matched-Subscribers': 'City Environmental Operations, Public Map Viewers',
            'Transit-Hops': '2',
            'Brokerless-Latency': '1.8ms',
          },
        },
        serverStateDiff: {
          action: 'DASHBOARD_UPDATED',
          previousState: 'Dashboard Gauge: PM2.5 = 15.1',
          newState: 'Dashboard Gauge: PM2.5 = 12.4 (Live verified update)',
        },
        clientVisualState: {
          browserUrl: 'ndn://iot/city/air-quality/sensor-88',
          domAction: 'City Environmental Dashboard updated live: PM2.5 = 12.4 µg/m³ (Verified)',
          renderedComponent: 'CityTelemetryDashboard (Live Feed Active)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
    ],
  },
  {
    id: 'icn_scenario_partition_resilience',
    name: 'Offline Mesh & Disaster Partition Resilience',
    shortName: 'Offline Mesh Resilience',
    tagline: 'Serving Verified Authentic Content Peer-to-Peer without Internet Uplinks',
    icon: 'Globe',
    category: 'Peer Partition',
    description: 'Demonstrates ICN survival during complete WAN internet blackout. When the connection to the origin is severed, nearby consumer and peer nodes discover and exchange cryptographically authentic signed Data Packets locally over ad-hoc Wi-Fi/Bluetooth meshes.',
    whyInformationCentric: 'In host-centric architectures, losing connection to google.com or a cloud server breaks everything, even if your neighbor has the exact file you need. In ICN, data is self-verifying, so any local peer can safely serve you.',
    steps: [
      {
        stepNumber: 1,
        title: 'Simulated Internet Uplink Failure (WAN Blackout)',
        description: 'A storm severs the main fiber optic link to the central cloud datacenter. Central servers are 100% unreachable.',
        activeNodeId: 'router',
        packetType: 'INTEREST_PACKET',
        fromNodeId: 'consumer',
        toNodeId: 'router',
        durationMs: 1100,
        codeSnippet: {
          language: 'javascript',
          filename: 'mesh_failover.c',
          code: `// Primary WAN interface link DOWN
if (interface_status(WAN_FACE) == DOWN) {
  printf("[ALERT] WAN Link down! Switching FIB to Local Ad-Hoc Peer Mesh Face\\n");
  FIB_setNextHop('/emergency', LOCAL_WIFI_MESH_FACE);
}`,
          explanation: 'The forwarder re-routes Interest packets to local ad-hoc peer interfaces.',
        },
        networkDetails: {
          protocol: 'ICN Dynamic Ad-Hoc Routing',
          method: 'FAILOVER_TO_LOCAL_MESH',
          url: 'ndn:/emergency/evacuation-map/v4',
          status: 503,
          headers: {
            'WAN-Status': 'DISCONNECTED (Simulated Blackout)',
            'Local-Mesh-Status': 'ACTIVE (3 Ad-Hoc Peers)',
          },
        },
        serverStateDiff: {
          action: 'WAN_BLACKOUT_ACTIVE',
          previousState: 'Network Mode: Cloud-Connected',
          newState: 'Network Mode: Isolated Local Ad-Hoc Peer Mesh',
        },
        clientVisualState: {
          browserUrl: 'ndn://emergency/evacuation-map/v4',
          domAction: 'WAN severed! Scanning local ad-hoc Wi-Fi/Bluetooth peer mesh for signed emergency map...',
          renderedComponent: 'EmergencyEvacuationView (Offline Mesh Search)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 2,
        title: 'Local Peer Content Store Hit & Delivery',
        description: 'An adjacent peer device in the local mesh received the signed evacuation map prior to the storm. Its Content Store answers the Interest packet and serves the signed map locally over peer Wi-Fi in 2ms.',
        activeNodeId: 'in_network_cache',
        packetType: 'NAMED_DATA_PACKET',
        fromNodeId: 'in_network_cache',
        toNodeId: 'consumer',
        durationMs: 1200,
        codeSnippet: {
          language: 'javascript',
          filename: 'peer_mesh_reply.js',
          code: `// Peer device serves cached emergency map
const cachedMap = localContentStore.get('/emergency/evacuation-map/v4');
if (cachedMap) {
  console.log('[PEER MESH] Serving signed emergency map to neighboring device');
  peerFace.send(cachedMap);
}`,
          explanation: 'The peer device can safely serve the file because the signature proves the municipal government signed it, not the peer.',
        },
        networkDetails: {
          protocol: 'NDN Over Ad-Hoc 802.11 Wi-Fi Direct',
          method: 'PEER_CS_HIT',
          url: 'ndn:/emergency/evacuation-map/v4',
          status: 200,
          headers: {
            'Served-By': 'Peer_Device_Near_User',
            'WAN-Required': 'FALSE (100% Offline)',
            'Signature-Status': 'Municipal Government Public Key Match',
          },
        },
        serverStateDiff: {
          action: 'OFFLINE_DELIVERY_SUCCESS',
          previousState: 'User Map: Unavailable',
          newState: 'User Map: 100% Loaded & Verified from Neighboring Peer',
        },
        clientVisualState: {
          browserUrl: 'ndn://emergency/evacuation-map/v4',
          domAction: 'Verified Emergency Evacuation Map rendered successfully via peer mesh!',
          renderedComponent: 'EmergencyEvacuationView (Map Active)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
    ],
  },
];

export const ICN_ARCHITECTURE_COMPARISONS: ArchitectureComparison[] = [
  {
    dimension: 'Core Addressing Principle',
    serverCentric: {
      value: 'Location / Host-Centric (IP & Port)',
      detail: 'Packets addressed to a physical machine (e.g. 192.0.2.1:443). If that host is down or partitioned, communication fails.',
      score: 3,
      badgeType: 'neutral',
    },
    informationCentric: {
      value: 'Information / Named Data Object',
      detail: 'Packets addressed to the name or cryptographic hash of content (e.g. /media/video/chunk-1). Any node holding authentic data can reply.',
      score: 5,
      badgeType: 'positive',
    },
  },
  {
    dimension: 'Security & Trust Model',
    serverCentric: {
      value: 'Channel-Based Security (TLS/HTTPS)',
      detail: 'Secures the pipe between client and specific server. Once data leaves the pipe or enters an untrusted proxy, trust is lost.',
      score: 3,
      badgeType: 'neutral',
    },
    informationCentric: {
      value: 'Data-Centric Inherent Signatures',
      detail: 'Every single Named Data Object is cryptographically signed by its producer. Security travels WITH the data wherever it is cached.',
      score: 5,
      badgeType: 'positive',
    },
  },
  {
    dimension: 'In-Network Caching & CDN',
    serverCentric: {
      value: 'Overlay Reverse Proxies (Third-Party CDN)',
      detail: 'Requires commercial CDN providers (Cloudflare/Fastly), complex DNS routing, and specialized edge server deployments.',
      score: 3,
      badgeType: 'neutral',
    },
    informationCentric: {
      value: 'Ubiquitous Layer-3 In-Network Caching',
      detail: 'Every router switch natively caches passing Data Packets in its Content Store (CS). Sub-millisecond replies at every hop.',
      score: 5,
      badgeType: 'positive',
    },
  },
  {
    dimension: 'Multicast & Flash Crowd Resistance',
    serverCentric: {
      value: 'Unicast Proliferation (1 Connection per User)',
      detail: '10,000 users watching a live stream create 10,000 duplicate streams originating from server/edge clusters.',
      score: 2,
      badgeType: 'warning',
    },
    informationCentric: {
      value: 'Native PIT Aggregation & Multicast Fanout',
      detail: '10,000 requests for the same chunk collapse into 1 upstream Interest. The single response is multicasted natively.',
      score: 5,
      badgeType: 'positive',
    },
  },
  {
    dimension: 'Network Partition & Offline Resiliency',
    serverCentric: {
      value: 'Brittle to WAN Disconnection',
      detail: 'If internet link to cloud server is severed, applications crash even if nearby local peers possess the requested data.',
      score: 2,
      badgeType: 'warning',
    },
    informationCentric: {
      value: 'Seamless Ad-Hoc Peer Mesh Resiliency',
      detail: 'Peers exchange self-verifying signed data over local Wi-Fi/Bluetooth meshes completely offline with zero central server dependency.',
      score: 5,
      badgeType: 'positive',
    },
  },
  {
    dimension: 'Dynamic Computations & ACID Mutations',
    serverCentric: {
      value: 'Exceptional (Server-Authoritative ACID)',
      detail: 'Centralized server cores execute complex transaction locks, relational joins, and atomic business mutations effortlessly.',
      score: 5,
      badgeType: 'positive',
    },
    informationCentric: {
      value: 'Requires Append-Only CRDT / Pub-Sub Models',
      detail: 'Dynamic state mutations require synchronization schemas, append-only logs, or integration with server-centric compute layers.',
      score: 3,
      badgeType: 'neutral',
    },
  },
];

export const ICN_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the fundamental difference in addressing between Host-Centric (IP) and Information-Centric (ICN/NDN) architectures?',
    options: [
      'Host-Centric addresses physical endpoints (WHERE); Information-Centric addresses content by Name/Hash (WHAT).',
      'Host-Centric uses Wi-Fi, while Information-Centric only works over cellular networks.',
      'Information-Centric eliminates all routers and requires direct satellite uplinks.',
      'Host-Centric is only for databases, while Information-Centric is for web browsers.',
    ],
    correctIndex: 0,
    explanation: 'In traditional networking, packets are addressed to an IP address (a specific computer). In ICN/NDN, packets express Interest in a Named Data Object (e.g. /news/article/v2) regardless of which physical computer hosts it.',
    deepDiveNote: 'Named Data Networking (NDN) replaces the IP layer with named, cryptographically signed data packets.',
  },
  {
    id: 2,
    question: 'How does an ICN router prevent flash crowds from overloading content producers?',
    options: [
      'It drops all requests that exceed 10 per second.',
      'It collapses duplicate Interests into a single Pending Interest Table (PIT) entry and multicasts the single returning response.',
      'It asks clients to solve heavy Proof-of-Work puzzles.',
      'It requires clients to create a paid account before querying.',
    ],
    correctIndex: 1,
    explanation: 'When multiple consumers request the same content name simultaneously, the router adds their incoming faces to one PIT entry, forwards only ONE Interest upstream, and multicasts the returning Data Packet to all of them.',
    deepDiveNote: 'PIT-based Interest aggregation achieves 98%+ bandwidth reductions during viral live streams and flash crowds.',
  },
  {
    id: 3,
    question: 'In Information-Centric Networking, why is it safe to download data from an untrusted intermediate router or neighboring peer?',
    options: [
      'Because all routers on the internet are government certified.',
      'Because every Data Packet is cryptographically signed by the original Producer, and the Consumer verifies the signature directly.',
      'Because intermediate routers cannot read the contents of packets.',
      'Because peers are physically close to each other.',
    ],
    correctIndex: 1,
    explanation: 'ICN binds security directly to the DATA object rather than to the communication channel (TLS). Even if an intermediate router attempts to modify the data, the digital signature will fail verification.',
    deepDiveNote: 'This concept is known as "Data-Centric Security" or "Self-Verifying Content".',
  },
  {
    id: 4,
    question: 'What are the three primary state tables maintained by an NDN/ICN Forwarding Daemon (NFD)?',
    options: [
      'Content Store (CS), Pending Interest Table (PIT), and Forwarding Information Base (FIB).',
      'Redux Store, React Virtual DOM, and SQLite Database.',
      'DNS Cache, ARP Table, and BGP Routing Table.',
      'Session Table, Cookie Jar, and Web Storage.',
    ],
    correctIndex: 0,
    explanation: 'The forwarding engine checks: 1) Content Store (CS) for in-network cached data, 2) Pending Interest Table (PIT) to record and aggregate waiting requests, and 3) Forwarding Information Base (FIB) to route unmatched Interests upstream.',
    deepDiveNote: 'These three tables form the heart of wire-speed name-based forwarding in NDN/ICN architectures.',
  },
  {
    id: 5,
    question: 'What is Content Addressing (as used in IPFS and Merkle DAGs)?',
    options: [
      'Identifying data uniquely by the cryptographic hash (CID) of its exact byte contents.',
      'Addressing data by the physical street address of the datacenter.',
      'Assigning a random serial number to every webpage.',
      'Storing data in a relational MySQL database table.',
    ],
    correctIndex: 0,
    explanation: 'Content addressing uses cryptographic multihashes (such as SHA-256 / Blake3) to generate a Content Identifier (CID). If even a single byte changes, the CID changes, guaranteeing mathematical immutability and tamper resistance.',
    deepDiveNote: 'Content addressing enables multi-source swarming, where different chunks of the same file are fetched simultaneously from 10 different peers.',
  },
];
