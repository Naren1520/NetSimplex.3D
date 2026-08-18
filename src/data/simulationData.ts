import { ArchitectureNode, ScenarioDefinition, ArchitectureComparison, QuizQuestion } from '../types';

export const INITIAL_SYSTEM_NODES: ArchitectureNode[] = [
  {
    id: 'client',
    name: 'Thin Client Browser',
    subtitle: 'User Viewport & DOM Engine',
    type: 'client',
    position: [-6, 0, 2],
    color: '#38bdf8', // sky blue
    status: 'idle',
    metrics: {
      cpuPercent: 4,
      memoryMb: 38,
      latencyMs: 12,
      activeConnections: 1,
      requestCount: 42,
    },
    details: {
      role: 'Lightweight HTML consumer, DOM renderer, and user event dispatcher.',
      techStack: 'HTML5 Parser, CSS Layout Engine, Standard Web APIs, Minimal JS (~15KB)',
      keyResponsibilities: [
        'Render streamed HTML markup directly to screen',
        'Dispatch semantic form submissions & hypermedia requests',
        'Apply targeted DOM morphing without client-side state management',
        'Maintain zero client-side business secrets or database connection tokens',
      ],
      sampleConfig: `<!-- Thin Client / Hypermedia Markup -->
<form action="/cart/add" method="POST" hx-post="/cart/add" hx-target="#cart-widget" hx-swap="outerHTML">
  <input type="hidden" name="productId" value="prod_99" />
  <button type="submit" class="btn-primary">Add to Bag</button>
</form>`,
      serverCentricAdvantage: 'Extremely fast First Contentful Paint (FCP), zero bulky JS bundles (saves 90%+ download size), battery-friendly for mobile devices.',
    },
  },
  {
    id: 'edge',
    name: 'Edge CDN & Reverse Proxy',
    subtitle: 'SSL, Caching & Routing',
    type: 'edge',
    position: [-2.5, 0, -1],
    color: '#a855f7', // purple
    status: 'idle',
    metrics: {
      cpuPercent: 12,
      memoryMb: 128,
      latencyMs: 3,
      activeConnections: 340,
      requestCount: 1420,
    },
    details: {
      role: 'Terminates TLS, routes requests to nearest server cluster, and serves cached HTML fragments.',
      techStack: 'Nginx, Cloudflare Workers, Fastly VCL, HTTP/3 QUIC',
      keyResponsibilities: [
        'SSL/TLS handshakes and HTTP/2 multiplexing',
        'Stale-While-Revalidate (SWR) edge page caching',
        'DDoS mitigation and bot rate limiting',
        'Geographic edge routing with sub-5ms roundtrips',
      ],
      sampleConfig: `# Nginx Edge Reverse Proxy Rule
location / {
  proxy_pass http://app_upstream;
  proxy_cache edge_cache;
  proxy_cache_use_stale error timeout updating http_500 http_502;
  proxy_cache_valid 200 60s;
  add_header X-Cache-Status $upstream_cache_status;
}`,
      serverCentricAdvantage: 'Serves pre-rendered server HTML from the nearest global edge within 5-15ms worldwide without client cold starts.',
    },
  },
  {
    id: 'server',
    name: 'Application Server Core',
    subtitle: 'Business Logic & SSR Engine',
    type: 'server',
    position: [1.5, 0, 1.5],
    color: '#10b981', // emerald green
    status: 'idle',
    metrics: {
      cpuPercent: 24,
      memoryMb: 512,
      latencyMs: 6,
      activeConnections: 86,
      requestCount: 890,
    },
    details: {
      role: 'The brain of the system: executes business rules, enforces security, queries data, and renders HTML.',
      techStack: 'Node.js / Express / Next.js RSC / Go / Ruby on Rails / Phoenix',
      keyResponsibilities: [
        'Execute server-side business workflows and authorization',
        'Single source of truth for application session and state',
        'Direct connection to databases with microsecond latency',
        'Stream complete HTML or atomic HTML fragments (SSR / Server Actions)',
      ],
      sampleConfig: `// Server-Side Controller / Server Action
export async function handleAddToCart(formData: FormData) {
  'use server';
  const session = await auth.getSession();
  const productId = formData.get('productId');
  
  // Direct secure DB mutation (zero secret exposure to client)
  await db.cart.addItem({ userId: session.userId, productId });
  
  // Revalidate and render updated HTML component directly
  return <CartWidget count={await db.cart.getCount(session.userId)} />;
}`,
      serverCentricAdvantage: 'Eliminates API contract synchronization bugs, avoids exposing internal DB schemas, and executes DB queries on 10Gbps internal network.',
    },
  },
  {
    id: 'cache',
    name: 'In-Memory Cache (Redis)',
    subtitle: 'Session Store & Query Cache',
    type: 'cache',
    position: [4.5, 0, -2],
    color: '#f59e0b', // amber
    status: 'idle',
    metrics: {
      cpuPercent: 8,
      memoryMb: 256,
      latencyMs: 0.5,
      activeConnections: 45,
      requestCount: 2310,
    },
    details: {
      role: 'Sub-millisecond key-value storage for user sessions, authorization tokens, and hot query results.',
      techStack: 'Redis 7.2 Cluster, Valkey, In-Memory Ring Buffers',
      keyResponsibilities: [
        'Store and validate HTTP-only encrypted session cookies',
        'Cache compiled HTML fragments for high-traffic widgets',
        'Pub/Sub message broker for realtime Server-Sent Events',
        'Distributed lock manager for atomic inventory reservations',
      ],
      sampleConfig: `# Redis Session & Fragment Cache
GET session:usr_8921a -> { role: "admin", cartId: "c_44" }
SETEX html:nav_menu 3600 "<nav class='header-nav'>...</nav>"
HINCRBY cart:c_44 total_items 1`,
      serverCentricAdvantage: '0.4ms session retrieval ensures server-side authentication adds virtually zero latency to page generation.',
    },
  },
  {
    id: 'database',
    name: 'Primary SQL Database',
    subtitle: 'ACID Relational Storage',
    type: 'database',
    position: [6, 0, 2],
    color: '#3b82f6', // blue
    status: 'idle',
    metrics: {
      cpuPercent: 18,
      memoryMb: 1024,
      latencyMs: 1.8,
      activeConnections: 24,
      requestCount: 650,
    },
    details: {
      role: 'Persistent source of truth providing transactional integrity and indexed relational queries.',
      techStack: 'PostgreSQL 16, Connection Pooler (PgBouncer), WAL Replication',
      keyResponsibilities: [
        'Strict ACID transactional guarantees for financial/order data',
        'Complex SQL joins executed in sub-2ms on local fast NVMe',
        'Row-level security enforcement at database layer',
        'Automated database migrations and schema evolution',
      ],
      sampleConfig: `-- Atomic Cart & Inventory Transaction
BEGIN TRANSACTION;
UPDATE inventory SET stock = stock - 1 WHERE id = 'prod_99' AND stock > 0;
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ('c_44', 'prod_99', 1);
COMMIT;`,
      serverCentricAdvantage: 'Backend queries database over co-located internal network; zero N+1 REST API waterfalls over public mobile internet.',
    },
  },
  {
    id: 'worker',
    name: 'Async Worker / Event Queue',
    subtitle: 'Background Jobs & SSE Dispatch',
    type: 'worker',
    position: [0.5, 0, 4],
    color: '#ec4899', // pink
    status: 'idle',
    metrics: {
      cpuPercent: 14,
      memoryMb: 380,
      latencyMs: 4,
      activeConnections: 12,
      requestCount: 180,
    },
    details: {
      role: 'Offloads non-blocking asynchronous jobs (emails, analytics, image processing, SSE push).',
      techStack: 'BullMQ, RabbitMQ, Celery, Server-Sent Events Daemon',
      keyResponsibilities: [
        'Process heavy background tasks without delaying HTTP responses',
        'Push realtime event streams (SSE) directly to client browser',
        'Perform scheduled database aggregation and report generation',
      ],
      sampleConfig: `// Async Worker Job Definition
worker.process('order_confirmation', async (job) => {
  const { orderId, email } = job.data;
  await generateInvoicePdf(orderId);
  await emailService.sendReceipt(email);
  // Push live update to client SSE stream
  sseBroadcaster.publish(job.data.userId, { type: 'ORDER_CONFIRMED', orderId });
});`,
      serverCentricAdvantage: 'Keeps client lightweight; heavy computation never drains user battery or memory.',
    },
  },
];

export const SIMULATION_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'scenario_ssr_nav',
    name: '1. Full Server-Side Render (SSR)',
    shortName: 'SSR Navigation',
    tagline: 'Instant paint in 1 single round trip with zero JS waterfall',
    icon: 'Globe',
    category: 'SSR',
    description: 'Demonstrates a complete page navigation request. The server validates the session, executes SQL queries directly over co-located infrastructure, compiles full semantic HTML markup, and streams it to the thin client browser.',
    whyServerCentric: 'Client-Centric SPAs force the browser to download a 2MB JS bundle, run JS initialization, make 5-8 chained API calls, and render with high CPU overhead. Server-Centric SSR delivers ready-to-paint HTML in a single round-trip.',
    steps: [
      {
        stepNumber: 1,
        title: 'Client Dispatches HTTP GET Request',
        description: 'User enters URL /products. Thin browser sends standard HTTP GET request with session cookie. Zero JavaScript execution on client.',
        activeNodeId: 'client',
        packetType: 'HTTP_GET',
        fromNodeId: 'client',
        toNodeId: 'edge',
        durationMs: 800,
        codeSnippet: {
          language: 'http',
          filename: 'client-request.http',
          code: `GET /products?category=electronics HTTP/1.1
Host: store.example.com
User-Agent: Mozilla/5.0 (Client-Centric Thin Browser)
Accept: text/html,application/xhtml+xml
Cookie: session_id=s_98x19fa44b02; csrf_token=k9012a
Sec-Fetch-Mode: navigate
Sec-Fetch-Dest: document`,
          explanation: 'Standard semantic browser request. The browser does not need to boot a React client runtime or fetch a JSON state tree first.',
        },
        networkDetails: {
          protocol: 'HTTP/2',
          method: 'GET',
          url: 'https://store.example.com/products?category=electronics',
          status: 200,
          headers: {
            'Accept': 'text/html',
            'Cookie': 'session_id=s_98x19fa44b02',
          },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Dispatch navigation event',
          renderedComponent: 'Browser showing loading indicator, awaiting HTML stream',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 2,
        title: 'Edge Proxy Inspects Cache & Routes',
        description: 'Edge CDN terminates TLS, verifies request headers, checks for edge-cached HTML, and forwards to the upstream application cluster.',
        activeNodeId: 'edge',
        packetType: 'HTTP_GET',
        fromNodeId: 'edge',
        toNodeId: 'server',
        durationMs: 600,
        codeSnippet: {
          language: 'javascript',
          filename: 'edge-router.ts',
          code: `// Edge Gateway Pipeline
export default async function handleEdgeRequest(req: Request) {
  // Check if private personalized route
  const hasAuthCookie = req.headers.get('cookie')?.includes('session_id');
  
  if (!hasAuthCookie) {
    const cachedHtml = await edgeCache.match(req);
    if (cachedHtml) return cachedHtml; // 3ms Instant Edge Hit
  }
  
  // Forward to origin App Server with client geographic headers
  req.headers.set('x-geo-region', 'us-east-1');
  return fetch(ORIGIN_APP_SERVER, req);
}`,
          explanation: 'Edge handles TLS handshake and passes authenticated requests to the application server with sub-millisecond edge latency.',
        },
        networkDetails: {
          protocol: 'HTTP/2 (Internal Upstream)',
          method: 'GET',
          url: 'http://internal-app-mesh/products',
          status: 200,
          headers: {
            'X-Forwarded-For': '198.51.100.42',
            'X-Geo-Region': 'us-east-1',
          },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Awaiting first byte (TTFB)',
          renderedComponent: 'Awaiting origin response',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 3,
        title: 'Server Validates Session in Redis',
        description: 'App server extracts session ID and queries the co-located in-memory cache to load user privileges, cart state, and preferences in 0.4ms.',
        activeNodeId: 'cache',
        packetType: 'CACHE_LOOKUP',
        fromNodeId: 'server',
        toNodeId: 'cache',
        durationMs: 500,
        codeSnippet: {
          language: 'javascript',
          filename: 'session-middleware.ts',
          code: `// Express / Fastify Server Session Lookup
const sessionId = req.cookies['session_id'];
const sessionData = await redis.hgetall(\`session:\${sessionId}\`);

if (!sessionData || !sessionData.userId) {
  return res.redirect('/login');
}

// Attach user context to server request scope (Zero token exposure to browser)
req.user = {
  id: sessionData.userId,
  name: sessionData.name,
  role: sessionData.role,
  cartCount: parseInt(sessionData.cartCount || '0')
};`,
          explanation: 'Authentication is resolved entirely on the server. The user’s secret API tokens or role permissions are never sent to the browser.',
        },
        networkDetails: {
          protocol: 'RESP3 (Redis)',
          method: 'HGETALL',
          url: 'redis://10.0.1.4:6379/0',
          status: 200,
          headers: { 'Latency': '0.4ms', 'Hit': 'true' },
        },
        serverStateDiff: {
          action: 'LOAD_SESSION',
          previousState: 'Anonymous Scope',
          newState: 'User: Alex Rivera (ID: usr_8921, Role: PRO, Cart: 2 items)',
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Network wait',
          renderedComponent: 'Connection established',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 4,
        title: 'Direct High-Speed Database Query',
        description: 'App server executes an optimized SQL query directly against the primary Postgres database with indexed sorting and joins.',
        activeNodeId: 'database',
        packetType: 'SQL_QUERY',
        fromNodeId: 'server',
        toNodeId: 'database',
        durationMs: 700,
        codeSnippet: {
          language: 'sql',
          filename: 'product-query.sql',
          code: `-- Server-Executed SQL Query
SELECT 
  p.id, 
  p.title, 
  p.price, 
  p.rating, 
  p.in_stock,
  c.name AS category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'electronics' AND p.is_active = TRUE
ORDER BY p.sales_rank DESC
LIMIT 12;`,
          explanation: 'In a server-centric architecture, database queries run over high-speed datacenter fiber (0.8ms) rather than over slow cellular network REST APIs.',
        },
        networkDetails: {
          protocol: 'Postgres Wire Protocol v3',
          method: 'QUERY',
          url: 'postgres://10.0.1.8:5432/store_db',
          status: 200,
          headers: { 'Execution-Time': '1.2ms', 'Rows-Returned': '12' },
        },
        serverStateDiff: {
          action: 'FETCH_PRODUCTS',
          previousState: 'Empty buffer',
          newState: '12 Product Records fetched into server memory',
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Server processing',
          renderedComponent: 'Data ready on server',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 5,
        title: 'Server Compiles & Streams Semantic HTML',
        description: 'Template engine / React Server Components render the layout, inserting dynamic data directly into semantic HTML tags.',
        activeNodeId: 'server',
        packetType: 'SSR_COMPILE',
        fromNodeId: 'database',
        toNodeId: 'server',
        durationMs: 650,
        codeSnippet: {
          language: 'javascript',
          filename: 'ProductsPage.server.tsx',
          code: `// React Server Component / Template Engine
export default async function ProductsPage({ category }) {
  const products = await db.getProducts(category);
  const user = await auth.getUser();

  return (
    <div className="product-catalog">
      <Header user={user} cartCount={user.cartCount} />
      <main className="grid grid-cols-3 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </main>
    </div>
  );
}`,
          explanation: 'The entire HTML structure is generated on the server with zero client component serialization overhead.',
        },
        networkDetails: {
          protocol: 'HTTP/2 Stream',
          method: 'RESPONSE',
          url: 'https://store.example.com/products',
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'private, no-cache',
          },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Receiving HTML bytes',
          renderedComponent: 'HTML Stream Initiated',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 6,
        title: 'Client Receives HTML & Paints Instant DOM',
        description: 'Thin client browser parses the streamed HTML chunks and paints the complete UI immediately. No hydration delays, no flash of unstyled content.',
        activeNodeId: 'client',
        packetType: 'HTML_STREAM',
        fromNodeId: 'server',
        toNodeId: 'client',
        durationMs: 800,
        codeSnippet: {
          language: 'html',
          filename: 'rendered-dom.html',
          code: `<!-- Fully Rendered Semantic HTML delivered to Browser -->
<!DOCTYPE html>
<html lang="en">
<body>
  <header class="header">
    <div class="user-pill">Hello, Alex Rivera (PRO)</div>
    <div class="cart-pill">🛒 2 items</div>
  </header>
  <main class="product-grid">
    <div class="card" id="prod-1">
      <h3>Ultra Wireless Headphones</h3>
      <span class="price">$199.00</span>
      <form action="/cart/add" method="POST" hx-post="/cart/add" hx-target="#cart-pill">
        <input type="hidden" name="id" value="1">
        <button type="submit">Add to Cart</button>
      </form>
    </div>
  </main>
</body>
</html>`,
          explanation: 'Browser displays styled content in a single frame. Memory footprint is only ~38MB compared to 250MB+ for a heavy client SPA.',
        },
        networkDetails: {
          protocol: 'HTTP/2',
          method: '200 OK',
          url: 'https://store.example.com/products',
          status: 200,
          headers: {
            'Content-Length': '14.2 KB',
            'TTFB': '18ms',
            'FCP': '24ms',
          },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'DOM fully painted & interactive',
          renderedComponent: 'Products Catalog (12 items ready to buy)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
    ],
  },
  {
    id: 'scenario_server_action',
    name: '2. Server Action & Atomic Mutation',
    shortName: 'Server Action Form',
    tagline: 'Secure mutation with automatic targeted HTML revalidation',
    icon: 'Zap',
    category: 'Server Actions',
    description: 'Demonstrates modern Server Actions / Form Submissions. When a user clicks "Add to Cart", the browser submits form data to the server. The server executes transactional DB updates and returns updated HTML with zero client state management code.',
    whyServerCentric: 'In client-centric apps, mutations require REST endpoints, Redux dispatchers, optimistic UI caches, manual error rollbacks, and JWT refreshers. Server-Centric architectures handle mutation + revalidation in one unified server function.',
    steps: [
      {
        stepNumber: 1,
        title: 'User Submits Form / Action',
        description: 'User clicks "Add to Cart" on product #102. Browser sends POST request with form payload and anti-CSRF token.',
        activeNodeId: 'client',
        packetType: 'HTTP_POST_ACTION',
        fromNodeId: 'client',
        toNodeId: 'server',
        durationMs: 700,
        codeSnippet: {
          language: 'http',
          filename: 'form-post.http',
          code: `POST /products/102/add-to-cart HTTP/1.1
Host: store.example.com
Content-Type: application/x-www-form-urlencoded
Cookie: session_id=s_98x19fa44b02

productId=102&quantity=1&csrfToken=k9012a_signed`,
          explanation: 'Native form submit or lightweight fetch. No complex GraphQL payload, no 500-line client Redux reducer.',
        },
        networkDetails: {
          protocol: 'HTTP/2',
          method: 'POST',
          url: 'https://store.example.com/products/102/add-to-cart',
          status: 200,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Submitting server action',
          renderedComponent: 'Add button in pending state',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 2,
        title: 'Server Executes ACID Transaction',
        description: 'Server validates inventory, deducts available stock count, and creates a cart item record inside an atomic SQL transaction.',
        activeNodeId: 'database',
        packetType: 'SQL_QUERY',
        fromNodeId: 'server',
        toNodeId: 'database',
        durationMs: 650,
        codeSnippet: {
          language: 'sql',
          filename: 'cart-mutation.sql',
          code: `BEGIN;
-- Atomic inventory lock
UPDATE products 
SET stock_count = stock_count - 1 
WHERE id = 102 AND stock_count > 0;

-- Insert / update cart item
INSERT INTO cart_items (cart_id, product_id, quantity, unit_price)
VALUES ('cart_usr8921', 102, 1, 199.00)
ON CONFLICT (cart_id, product_id)
DO UPDATE SET quantity = cart_items.quantity + 1;

COMMIT;`,
          explanation: 'Executed with strict database consistency. Business rules (e.g. max 5 per customer) are guaranteed server-side.',
        },
        networkDetails: {
          protocol: 'Postgres Wire Protocol',
          method: 'TRANSACTION',
          url: 'postgres://10.0.1.8:5432/store_db',
          status: 200,
          headers: { 'Transaction-Status': 'COMMITTED', 'Rows-Affected': '2' },
        },
        serverStateDiff: {
          action: 'ADD_TO_CART',
          previousState: 'Cart count: 2 | Stock 102: 15',
          newState: 'Cart count: 3 | Stock 102: 14',
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Server updating database',
          renderedComponent: 'Processing mutation',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 3,
        title: 'Server Updates Session Cache & Triggers Worker',
        description: 'Server increments cached cart counter in Redis and dispatches an asynchronous analytics event to background worker.',
        activeNodeId: 'worker',
        packetType: 'CACHE_LOOKUP',
        fromNodeId: 'server',
        toNodeId: 'worker',
        durationMs: 550,
        codeSnippet: {
          language: 'javascript',
          filename: 'post-mutation-worker.ts',
          code: `// Update In-Memory Redis Session
await redis.hincrby('session:s_98x19fa44b02', 'cartCount', 1);

// Dispatch async analytics worker job (non-blocking)
await workerQueue.add('track_cart_event', {
  userId: 'usr_8921',
  productId: 102,
  price: 199.00,
  timestamp: Date.now()
});`,
          explanation: 'Background jobs run out-of-band so the user’s HTTP response remains sub-20ms.',
        },
        networkDetails: {
          protocol: 'Internal Redis Pub/Sub',
          method: 'ENQUEUE',
          url: 'queue://worker-mesh/cart_events',
          status: 200,
          headers: { 'Queue-Depth': '3', 'Priority': 'HIGH' },
        },
        serverStateDiff: {
          action: 'CACHE_UPDATE',
          previousState: 'Redis cartCount = 2',
          newState: 'Redis cartCount = 3',
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Server compiling target fragment',
          renderedComponent: 'Building updated HTML component',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 4,
        title: 'Server Returns Target HTML & Morph DOM',
        description: 'Server sends back the freshly rendered HTML widget. Thin client swaps the target element in the DOM tree seamlessly.',
        activeNodeId: 'client',
        packetType: 'DOM_PATCH',
        fromNodeId: 'server',
        toNodeId: 'client',
        durationMs: 700,
        codeSnippet: {
          language: 'html',
          filename: 'cart-widget-response.html',
          code: `<!-- Targeted HTML Fragment returned by Server Action / HTMX -->
<div id="cart-pill" class="cart-pill animate-bounce-subtle">
  <span class="icon">🛒</span>
  <span class="count">3 items ($448.00)</span>
  <span class="badge-success">Item Added!</span>
</div>`,
          explanation: 'The browser swaps just the affected DOM node. No client-side reconciliation diffing, no state desynchronization bugs.',
        },
        networkDetails: {
          protocol: 'HTTP/2',
          method: '200 OK',
          url: 'https://store.example.com/products/102/add-to-cart',
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'HX-Trigger': 'cartUpdated',
            'Content-Length': '284 B',
          },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Targeted DOM morphing applied',
          renderedComponent: 'Cart Pill updated to 🛒 3 items ($448.00)',
          hydrationStatus: 'no_hydration_needed',
        },
      },
    ],
  },
  {
    id: 'scenario_htmx_search',
    name: '3. Hypermedia Partial Swap (HTMX / Hotwire)',
    shortName: 'Hypermedia Search',
    tagline: 'Search as you type with zero client state management libraries',
    icon: 'Search',
    category: 'Hypermedia/HTMX',
    description: 'Demonstrates the power of Hypermedia-driven architectures (HATEOAS). As the user types into a live filter box, the server renders and returns pure HTML list items that the thin client inserts directly into the page.',
    whyServerCentric: 'Avoids creating duplicate client-side filtering algorithms, serialization schemas, and bloated JSON parsers. The server remains the single source of truth for both data and presentation.',
    steps: [
      {
        stepNumber: 1,
        title: 'Client Dispatches Debounced Hypermedia Request',
        description: 'User types "pro" in search input. The declarative hypermedia tag sends an async GET request for an HTML fragment.',
        activeNodeId: 'client',
        packetType: 'HTTP_GET',
        fromNodeId: 'client',
        toNodeId: 'server',
        durationMs: 650,
        codeSnippet: {
          language: 'html',
          filename: 'search-input.html',
          code: `<!-- Declarative Hypermedia Trigger -->
<input 
  type="search" 
  name="q" 
  placeholder="Search hardware..."
  hx-get="/search/live" 
  hx-trigger="keyup changed delay:250ms, search" 
  hx-target="#search-results-container"
  hx-indicator="#search-spinner"
/>`,
          explanation: 'Notice: 0 lines of custom JavaScript. The HTML itself declares what endpoint to call and where to place the returned markup.',
        },
        networkDetails: {
          protocol: 'HTTP/2',
          method: 'GET',
          url: 'https://store.example.com/search/live?q=pro',
          status: 200,
          headers: {
            'HX-Request': 'true',
            'HX-Target': 'search-results-container',
          },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Input event dispatched with 250ms debounce',
          renderedComponent: 'Search spinner active',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 2,
        title: 'Server Executes Full-Text Search in Postgres',
        description: 'Database uses optimized GIN indexed tsvector full-text search to find matching records in 1.1ms.',
        activeNodeId: 'database',
        packetType: 'SQL_QUERY',
        fromNodeId: 'server',
        toNodeId: 'database',
        durationMs: 600,
        codeSnippet: {
          language: 'sql',
          filename: 'fulltext-search.sql',
          code: `SELECT id, title, category, price, thumbnail_url
FROM products
WHERE search_vector @@ to_tsquery('english', 'pro:*')
ORDER BY ts_rank(search_vector, to_tsquery('english', 'pro:*')) DESC
LIMIT 4;`,
          explanation: 'Heavy text ranking is handled by PostgreSQL’s indexed vector engine right at the data layer.',
        },
        networkDetails: {
          protocol: 'Postgres Wire Protocol',
          method: 'QUERY',
          url: 'postgres://10.0.1.8:5432/store_db',
          status: 200,
          headers: { 'Search-Query': 'pro:*', 'Execution-Time': '1.1ms' },
        },
        serverStateDiff: {
          action: 'SEARCH_QUERY',
          previousState: 'Unfiltered dataset',
          newState: '4 ranked records (MacBook Pro, Pro Microphone, Pro Mouse, Pro Lens)',
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Server executing query',
          renderedComponent: 'Server compiling search snippet',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 3,
        title: 'Server Renders & Swaps HTML Fragment',
        description: 'Server returns pure HTML list markup. The thin client swaps the element contents without full page reload.',
        activeNodeId: 'client',
        packetType: 'HTML_STREAM',
        fromNodeId: 'server',
        toNodeId: 'client',
        durationMs: 700,
        codeSnippet: {
          language: 'html',
          filename: 'search-results-fragment.html',
          code: `<div id="search-results-container" class="dropdown-panel animate-fadeIn">
  <div class="result-item">
    <img src="/img/mbp.jpg" class="w-8 h-8 rounded" />
    <div>
      <p class="font-bold">MacBook Pro M3 Max</p>
      <p class="text-sm text-emerald-400">$3,199.00</p>
    </div>
  </div>
  <div class="result-item">
    <img src="/img/mic.jpg" class="w-8 h-8 rounded" />
    <div>
      <p class="font-bold">Studio Pro Broadcast Mic</p>
      <p class="text-sm text-emerald-400">$249.00</p>
    </div>
  </div>
</div>`,
          explanation: 'The browser swaps the target #search-results-container HTML directly. No client-side React virtual DOM diffing algorithm is needed.',
        },
        networkDetails: {
          protocol: 'HTTP/2',
          method: '200 OK',
          url: 'https://store.example.com/search/live?q=pro',
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '780 B',
          },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'HTML injected into #search-results-container',
          renderedComponent: 'Live Search Dropdown showing 4 matching products',
          hydrationStatus: 'no_hydration_needed',
        },
      },
    ],
  },
  {
    id: 'scenario_realtime_sse',
    name: '4. Server-Sent Events (Livewire / Phoenix LiveView)',
    shortName: 'Realtime State Stream',
    tagline: 'Server state pushes atomic diffs down persistent stream',
    icon: 'Radio',
    category: 'Realtime/SSE',
    description: 'Demonstrates server-authoritative realtime synchronization. When server state changes (e.g., flash sale countdown or live stock drop), the server pushes atomic HTML or binary diffs to thin connected clients.',
    whyServerCentric: 'Client code does not need complex WebSocket state machines, local Redux caches, or conflict resolution logic. The server pushes exact DOM diffs.',
    steps: [
      {
        stepNumber: 1,
        title: 'Client Establishes Lightweight SSE Stream',
        description: 'Browser connects to persistent Server-Sent Events endpoint (`/events/live-inventory`). Standard HTTP, low battery consumption.',
        activeNodeId: 'client',
        packetType: 'HTTP_GET',
        fromNodeId: 'client',
        toNodeId: 'server',
        durationMs: 650,
        codeSnippet: {
          language: 'http',
          filename: 'sse-handshake.http',
          code: `GET /events/live-inventory HTTP/1.1
Host: store.example.com
Accept: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
Cookie: session_id=s_98x19fa44b02`,
          explanation: 'Simple unidirectional stream. Requires far less overhead than complex bidirectionally stateful WebSockets.',
        },
        networkDetails: {
          protocol: 'HTTP/2 SSE',
          method: 'GET',
          url: 'https://store.example.com/events/live-inventory',
          status: 200,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'SSE stream connected',
          renderedComponent: 'Live Inventory Ticker Active 🟢',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 2,
        title: 'Background Worker Broadcasts Inventory Drop',
        description: 'A warehouse event occurs. Worker publishes stock change event to Redis Pub/Sub channel in real-time.',
        activeNodeId: 'worker',
        packetType: 'SSE_EVENT',
        fromNodeId: 'worker',
        toNodeId: 'cache',
        durationMs: 500,
        codeSnippet: {
          language: 'javascript',
          filename: 'warehouse-event-publisher.ts',
          code: `// Warehouse Inventory Decrement Event
const eventPayload = {
  productId: 102,
  remainingStock: 2,
  warningLevel: 'CRITICAL_LOW'
};

// Publish to all active server nodes via Redis PubSub
await redis.publish('inventory_updates', JSON.stringify(eventPayload));`,
          explanation: 'Worker cluster handles warehouse logistics and signals web servers to notify active sessions.',
        },
        networkDetails: {
          protocol: 'Redis Pub/Sub',
          method: 'PUBLISH',
          url: 'redis://10.0.1.4:6379/channel/inventory_updates',
          status: 200,
          headers: { 'Subscribers': '42' },
        },
        serverStateDiff: {
          action: 'INVENTORY_DROP',
          previousState: 'Stock 102: 5 units',
          newState: 'Stock 102: 2 units (URGENT LOW)',
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'Awaiting server push',
          renderedComponent: 'Stream listening',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 3,
        title: 'Server Pushes Live DOM Diff to Browser',
        description: 'Server receives event, calculates DOM diff for the stock badge, and pushes HTML chunk down the open SSE connection.',
        activeNodeId: 'client',
        packetType: 'SSE_EVENT',
        fromNodeId: 'server',
        toNodeId: 'client',
        durationMs: 700,
        codeSnippet: {
          language: 'html',
          filename: 'sse-stream-chunk.txt',
          code: `event: stock_patch
data: {"target": "#stock-badge-102", "html": "<span class='badge-urgent animate-pulse'>⚡ Only 2 units left in stock!</span>"}

event: flash_sale_ticker
data: {"target": "#live-banner", "html": "<div class='banner-alert'>🔥 Flash Sale ends in 04:12</div>"}`,
          explanation: 'Browser morphs target DOM element immediately without executing client-side state reconciliation.',
        },
        networkDetails: {
          protocol: 'HTTP/2 SSE Event Chunk',
          method: 'STREAM PUSH',
          url: 'https://store.example.com/events/live-inventory',
          status: 200,
          headers: {
            'Payload-Type': 'DOM Patch',
            'Latency': '3.4ms',
          },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/products',
          domAction: 'DOM badge updated via SSE event',
          renderedComponent: 'Badge updated: ⚡ Only 2 units left in stock!',
          hydrationStatus: 'no_hydration_needed',
        },
      },
    ],
  },
  {
    id: 'scenario_cache_hit',
    name: '5. Edge Cache & Stale-While-Revalidate (SWR)',
    shortName: 'Edge Cache Optimization',
    tagline: 'Sub-10ms TTFB global delivery with automatic background revalidation',
    icon: 'Cpu',
    category: 'Caching',
    description: 'Demonstrates high-performance server-centric edge caching. When multiple users view a catalog page, the edge cache serves the compiled HTML instantly, bypassing the database while keeping data fresh with background SWR revalidation.',
    whyServerCentric: 'Edge caching cached HTML pages is order-of-magnitude faster and cheaper than running heavy client Single-Page Application micro-frontends.',
    steps: [
      {
        stepNumber: 1,
        title: 'Client Requests Catalog Page',
        description: 'User requests `/catalog/featured`. Request hits the nearest geographic edge CDN node.',
        activeNodeId: 'client',
        packetType: 'HTTP_GET',
        fromNodeId: 'client',
        toNodeId: 'edge',
        durationMs: 550,
        codeSnippet: {
          language: 'http',
          filename: 'edge-get.http',
          code: `GET /catalog/featured HTTP/2
Host: store.example.com
Accept: text/html
If-None-Match: W/"fa98124b"`,
          explanation: 'Standard browser request with ETag conditional validation.',
        },
        networkDetails: {
          protocol: 'HTTP/3 QUIC',
          method: 'GET',
          url: 'https://store.example.com/catalog/featured',
          status: 200,
          headers: { 'CDN-Edge-Location': 'IAD (Washington DC)' },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/catalog/featured',
          domAction: 'Dispatching request to nearest edge',
          renderedComponent: 'Awaiting edge reply',
          hydrationStatus: 'no_hydration_needed',
        },
      },
      {
        stepNumber: 2,
        title: 'Edge Cache HIT (0ms Origin Database Load)',
        description: 'Edge node finds valid pre-rendered HTML in its high-speed in-memory NVMe cache. Returns 200 OK with X-Cache: HIT.',
        activeNodeId: 'edge',
        packetType: 'CACHE_HIT',
        fromNodeId: 'edge',
        toNodeId: 'client',
        durationMs: 500,
        codeSnippet: {
          language: 'http',
          filename: 'edge-cache-response.http',
          code: `HTTP/2 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=30, s-maxage=300, stale-while-revalidate=600
X-Cache: HIT (Edge-IAD)
Age: 42
Content-Length: 18450`,
          explanation: 'Zero load on origin database or application server. TTFB drops to 6ms worldwide.',
        },
        networkDetails: {
          protocol: 'HTTP/2',
          method: '200 OK (Cache HIT)',
          url: 'https://store.example.com/catalog/featured',
          status: 200,
          headers: {
            'X-Cache': 'HIT',
            'TTFB': '6ms',
            'Age': '42s',
          },
        },
        clientVisualState: {
          browserUrl: 'https://store.example.com/catalog/featured',
          domAction: 'HTML parsed & painted in 8ms',
          renderedComponent: 'Featured Catalog rendered with zero origin server overhead',
          hydrationStatus: 'no_hydration_needed',
        },
      },
    ],
  },
];

export const ARCHITECTURE_COMPARISONS: ArchitectureComparison[] = [
  {
    dimension: 'Initial JS Bundle Download Size',
    serverCentric: {
      value: '10 KB – 30 KB',
      detail: 'Only minimal hypermedia runtime or baseline CSS/HTML. No massive client React/Vue/Angular runtimes needed.',
      score: 5,
      badgeType: 'positive',
    },
    clientCentric: {
      value: '800 KB – 3.5 MB',
      detail: 'Must download full client framework, state managers (Redux/Zustand), routers, and client-side UI component graph.',
      score: 1,
      badgeType: 'warning',
    },
  },
  {
    dimension: 'Time to First Byte & First Contentful Paint (FCP)',
    serverCentric: {
      value: '15ms – 40ms',
      detail: 'Streamed ready-to-paint semantic HTML. Browser starts layout engine immediately without waiting for JS.',
      score: 5,
      badgeType: 'positive',
    },
    clientCentric: {
      value: '180ms – 1,200ms',
      detail: 'Browser gets blank `<div id="root"></div>`, downloads JS, parses AST, runs hydration, then fires 5 API calls.',
      score: 2,
      badgeType: 'warning',
    },
  },
  {
    dimension: 'Security & Secret Management',
    serverCentric: {
      value: 'Zero Secret Exposure',
      detail: 'API tokens, database credentials, and business authorization logic remain strictly on the backend behind firewalls.',
      score: 5,
      badgeType: 'positive',
    },
    clientCentric: {
      value: 'Vulnerable to Client Tampering',
      detail: 'Business rules duplicated on client, tokens stored in LocalStorage, vulnerable to XSS and token exfiltration.',
      score: 2,
      badgeType: 'warning',
    },
  },
  {
    dimension: 'Database Query Roundtrips',
    serverCentric: {
      value: 'Co-located (0.5ms – 2ms)',
      detail: 'Queries run on 10Gbps datacenter internal fiber. Multiple SQL queries complete in under 3ms.',
      score: 5,
      badgeType: 'positive',
    },
    clientCentric: {
      value: 'Public Internet Waterfalls (150ms – 600ms)',
      detail: 'Each sequential API request travels back and forth across cellular mobile networks.',
      score: 2,
      badgeType: 'warning',
    },
  },
  {
    dimension: 'Search Engine Optimization (SEO) & Social Previews',
    serverCentric: {
      value: '100% Native Perfect SEO',
      detail: 'All search crawlers (Google, Bing, Twitterbot, LinkedIn) receive complete structured semantic HTML instantly.',
      score: 5,
      badgeType: 'positive',
    },
    clientCentric: {
      value: 'Requires Prerendering Hacks',
      detail: 'Crawlers struggle with client JS execution timeouts; often requires complex headless Chromium prerender proxies.',
      score: 2,
      badgeType: 'warning',
    },
  },
  {
    dimension: 'Memory & Battery Consumption on Mobile',
    serverCentric: {
      value: 'Ultra Low (~30MB RAM)',
      detail: 'Low CPU usage; DOM trees are rendered natively by browser C++ engine without garbage collector thrashing.',
      score: 5,
      badgeType: 'positive',
    },
    clientCentric: {
      value: 'High (~200MB – 450MB RAM)',
      detail: 'Heavy virtual DOM diffing, immutable state objects, and long-lived memory leaks drain mobile batteries.',
      score: 1,
      badgeType: 'warning',
    },
  },
  {
    dimension: 'State Synchronization & API Drift',
    serverCentric: {
      value: 'Single Source of Truth',
      detail: 'No API serialization mismatches or client-side caching invalidation bugs. Server owns state.',
      score: 5,
      badgeType: 'positive',
    },
    clientCentric: {
      value: 'High Dual-State Complexity',
      detail: 'Must manually synchronize client Redux/TanStack Query cache with server database mutations.',
      score: 2,
      badgeType: 'warning',
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Why is Time to First Contentful Paint (FCP) significantly faster in Server-Centric architectures?',
    options: [
      'The browser only executes client-side WebAssembly scripts',
      'The server streams ready-to-paint HTML markup directly, eliminating large JavaScript bundle downloads and hydration delays',
      'The client stores the entire database in localStorage',
      'The server bypasses SSL/TLS handshakes',
    ],
    correctIndex: 1,
    explanation: 'In server-centric architectures (like SSR, Server Actions, or HTMX), the server compiles semantic HTML tags directly. The browser’s native C++ layout engine can parse and paint the page in a single round trip without downloading multi-megabyte JS bundles.',
    deepDiveNote: 'Contrast this with Client-Centric SPAs that return an empty `<div id="root"></div>` and force the user to wait for JS bundle download, parse, execution, and subsequent REST API calls.',
  },
  {
    id: 2,
    question: 'What is the primary security advantage of handling mutations via Server Actions or Server-Centric controllers?',
    options: [
      'Passwords are saved directly into the browser URL query parameters',
      'Client-side encryption is disabled completely',
      'Database credentials, API tokens, and business validation rules remain securely on the server and are never exposed to the client',
      'The browser automatically disables HTTPS verification',
    ],
    correctIndex: 2,
    explanation: 'Server-centric architectures keep all secret keys, database schemas, and business rules behind the server firewall. Client browsers only interact through secure HTTP requests without receiving database connection strings or authorization secrets.',
    deepDiveNote: 'In fat-client apps, developers frequently make the mistake of leaving third-party API keys or sensitive business validation algorithms inside client JavaScript bundles.',
  },
  {
    id: 3,
    question: 'How do Hypermedia-driven architectures (like HTMX or Hotwire Turbo) update specific sections of a webpage?',
    options: [
      'By replacing the entire computer operating system',
      'The server sends back targeted HTML fragments (e.g. `<div id="cart">...</div>`), which the browser morphs directly into the existing DOM',
      'By compiling new WebGL shaders on every click',
      'By generating a 500MB JSON payload and running client-side Redux reducers',
    ],
    correctIndex: 1,
    explanation: 'Hypermedia architectures treat HTML as the engine of application state (HATEOAS). When an action occurs, the server responds with the exact HTML fragment for that component, which the browser injects seamlessly with minimal JavaScript.',
    deepDiveNote: 'This eliminates hundreds of lines of client-side boilerplate code for state management, JSON serialization, and manual DOM manipulation.',
  },
  {
    id: 4,
    question: 'Why do database queries in server-centric workflows experience virtually zero network latency compared to client REST waterfalls?',
    options: [
      'The database runs inside the user’s mobile browser',
      'Databases do not use TCP connections',
      'The application server and database reside in the same datacenter cluster connected via high-speed 10–40 Gbps internal network interfaces (sub-millisecond latency)',
      'Server-centric apps avoid using SQL entirely',
    ],
    correctIndex: 2,
    explanation: 'When queries are executed on the application server, data travels over co-located internal fiber with ~0.5ms latency. If a page requires 5 database queries, they finish in under 3ms total, whereas 5 sequential client REST API calls over 4G/5G would take 500ms–1500ms.',
    deepDiveNote: 'This solves the notorious "N+1 query over the public internet" problem that plagues client-heavy mobile applications.',
  },
  {
    id: 5,
    question: 'What role does an In-Memory Cache (like Redis) play in server-centric request handling?',
    options: [
      'It downloads fonts into the client operating system',
      'It stores session credentials and cached HTML fragments in sub-millisecond RAM, allowing the server to validate authenticated users in under 1ms',
      'It replaces the client browser screen',
      'It converts HTML into Python code',
    ],
    correctIndex: 1,
    explanation: 'Redis keeps user authentication sessions, permissions, and compiled HTML fragments in high-speed RAM. When a request arrives, the server retrieves user credentials in 0.4ms, ensuring server-side authentication adds no perceptible delay.',
    deepDiveNote: 'With Redis + Edge SWR caching, server-centric architectures can easily scale to hundreds of thousands of concurrent requests with sub-20ms response times.',
  },
];
