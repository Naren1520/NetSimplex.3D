import React, { useState } from 'react';
import {
  Globe,
  Lock,
  ShoppingCart,
  Search,
  Sparkles,
  Zap,
  Radio,
} from 'lucide-react';
import { SimulationStep } from '../types';
import { useTheme } from '../context/ThemeContext';

interface VirtualClientBrowserProps {
  currentStep: SimulationStep;
  onTriggerAction: (actionType: string) => void;
  cartCount: number;
  lastActionMessage?: string;
}

export const VirtualClientBrowser: React.FC<VirtualClientBrowserProps> = ({
  currentStep,
  onTriggerAction,
  cartCount,
  lastActionMessage,
}) => {
  const [activeDevTab, setActiveDevTab] = useState<'preview' | 'network' | 'dom'>('preview');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('tech');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const products = [
    { id: 101, title: 'Pro Audio Studio Headset', price: 199.0, rating: '4.9', category: 'tech', stock: 12 },
    { id: 102, title: 'Mechanical Low-Profile Keyboard', price: 149.0, rating: '4.8', category: 'tech', stock: 3 },
    { id: 103, title: '4K Ultra-Wide IPS Display', price: 649.0, rating: '4.9', category: 'tech', stock: 8 },
    { id: 104, title: 'Ergonomic Standing Desk Frame', price: 429.0, rating: '4.7', category: 'home', stock: 5 },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`border rounded-xl overflow-hidden shadow-2xl flex flex-col h-full backdrop-blur-md transition-colors ${
      isLight ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-slate-100'
    }`}>
      {/* Browser Chrome Header */}
      <div className={`px-3 py-2 border-b flex items-center justify-between gap-2 ${
        isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
      }`}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>

        {/* URL Bar */}
        <div className={`flex-1 max-w-md border rounded-lg px-3 py-1 flex items-center gap-2 text-xs font-mono ${
          isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="text-slate-400">https://</span>
          <span className={`truncate font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            {currentStep.clientVisualState.browserUrl}
          </span>
        </div>

        {/* DevTools Tab Toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveDevTab('preview')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeDevTab === 'preview'
                ? isLight
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-800 text-emerald-300 border border-slate-700'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Browser UI
          </button>
          <button
            onClick={() => setActiveDevTab('network')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeDevTab === 'network'
                ? isLight
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-800 text-emerald-300 border border-slate-700'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Network (0ms JS)
          </button>
          <button
            onClick={() => setActiveDevTab('dom')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeDevTab === 'dom'
                ? isLight
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-800 text-emerald-300 border border-slate-700'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rendered DOM
          </button>
        </div>
      </div>

      {/* Browser Viewport Body */}
      <div className={`flex-1 overflow-y-auto p-4 font-sans select-text ${
        isLight ? 'bg-slate-50' : 'bg-slate-950'
      }`}>
        {activeDevTab === 'preview' && (
          <div className="space-y-4 max-w-xl mx-auto">
            {/* Storefront Header */}
            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
              isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Enterprise Cloud Storefront
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    ● Server-Rendered HTML Stream
                  </span>
                </div>
              </div>

              {/* Dynamic Server-Rendered Cart Widget */}
              <button
                id="cart-widget"
                onClick={() => onTriggerAction('POST_MUTATION')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 border ${
                  isLight
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{cartCount} Items</span>
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                  (${(cartCount * 149).toFixed(2)})
                </span>
              </button>
            </div>

            {/* Notification Banner */}
            {lastActionMessage && (
              <div className={`p-2.5 rounded-lg flex items-center gap-2 text-xs border animate-fadeIn ${
                isLight ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900' : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              }`}>
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold">{lastActionMessage}</span>
              </div>
            )}

            {/* Interactive Hypermedia Controls */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search Box (HTMX search simulation) */}
              <div className="relative flex-1">
                <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onTriggerAction('HTMX_SEARCH');
                  }}
                  placeholder="Live Hypermedia search (HTMX)..."
                  className={`w-full border rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500'
                  }`}
                />
              </div>

              {/* Category Filter Pills (SSR simulation) */}
              <div className={`flex items-center gap-1 p-1 rounded-lg border ${
                isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
              }`}>
                {['all', 'tech', 'home'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      onTriggerAction('SSR_NAV');
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                      activeCategory === cat
                        ? isLight
                          ? 'bg-emerald-500 text-white shadow-sm font-bold'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className={`border rounded-xl p-3.5 flex flex-col justify-between transition-all group ${
                    isLight ? 'bg-white border-slate-300 hover:border-emerald-500 shadow-sm' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900 group-hover:text-emerald-700' : 'text-slate-100 group-hover:text-emerald-300'} transition-colors`}>
                        {p.title}
                      </h4>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                      <span>★ {p.rating}</span>
                      <span>·</span>
                      <span className={p.stock < 5 ? 'text-amber-500 font-bold' : ''}>
                        {p.stock} in stock
                      </span>
                    </div>
                  </div>

                  {/* Form Submit / Server Action Button */}
                  <button
                    onClick={() => onTriggerAction('POST_MUTATION')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs py-2 rounded-lg transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Add to Cart (Server Action)</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Live SSE Stock Ticker Component */}
            <div className={`border p-3 rounded-xl flex items-center justify-between text-xs ${
              isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className={`font-mono text-[11px] ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  SSE Livewire Stream: Connected
                </span>
              </div>
              <button
                onClick={() => onTriggerAction('SSE_PUSH')}
                className="text-[11px] font-mono text-pink-600 dark:text-pink-400 hover:opacity-80 bg-pink-500/10 px-2.5 py-1 rounded border border-pink-500/30 flex items-center gap-1 font-semibold"
              >
                <Radio className="w-3 h-3" />
                <span>Simulate Warehouse Event</span>
              </button>
            </div>
          </div>
        )}

        {/* DEVTOOLS TAB: NETWORK WATERFALL */}
        {activeDevTab === 'network' && (
          <div className="space-y-3 font-mono text-xs">
            <div className={`flex items-center justify-between border-b pb-2 text-[11px] font-bold ${
              isLight ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-slate-800'
            }`}>
              <span>RESOURCE / ROUTE</span>
              <span>TYPE</span>
              <span>SIZE</span>
              <span>TIME (TTFB)</span>
            </div>
            <div className="space-y-1.5">
              <div className={`flex items-center justify-between p-2 rounded border ${
                isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900/60 border-slate-800/80'
              }`}>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">GET /products</span>
                <span className="text-purple-600 dark:text-purple-400">document (HTML)</span>
                <span>14.2 KB</span>
                <span className="text-emerald-600 dark:text-emerald-300 font-bold">18ms</span>
              </div>
              <div className={`flex items-center justify-between p-2 rounded border ${
                isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900/60 border-slate-800/80'
              }`}>
                <span className="text-sky-600 dark:text-cyan-400 font-bold">GET /styles.css</span>
                <span className="text-purple-600 dark:text-purple-400">stylesheet</span>
                <span>8.4 KB</span>
                <span className="text-emerald-600 dark:text-emerald-300 font-bold">6ms</span>
              </div>
              <div className={`flex items-center justify-between p-2 rounded border ${
                isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900/60 border-slate-800/80'
              }`}>
                <span className="text-amber-600 dark:text-amber-400 font-bold">POST /cart/add</span>
                <span className="text-purple-600 dark:text-purple-400">hypermedia fragment</span>
                <span>284 B</span>
                <span className="text-emerald-600 dark:text-emerald-300 font-bold">14ms</span>
              </div>
            </div>

            <div className={`border p-3 rounded-lg text-xs ${
              isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            }`}>
              <p className="font-bold mb-1">⚡ Zero Client Bundle Overhead:</p>
              <p className="text-[11px] leading-relaxed">
                Total JS downloaded: ~15 KB. Time to Interactive (TTI) is instantaneous because layout renders without a client framework hydration waterfall.
              </p>
            </div>
          </div>
        )}

        {/* DEVTOOLS TAB: RENDERED DOM TREE */}
        {activeDevTab === 'dom' && (
          <div className={`space-y-2 font-mono text-xs p-3 rounded-lg border leading-relaxed overflow-x-auto ${
            isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}>
            <p className="text-slate-400 dark:text-slate-500">&lt;!-- Pure Semantic DOM Rendered on Server --&gt;</p>
            <p className="text-purple-600 dark:text-purple-400">&lt;html lang="en"&gt;</p>
            <p className="text-purple-600 dark:text-purple-400 pl-4">&lt;body&gt;</p>
            <p className="text-purple-600 dark:text-purple-400 pl-8">&lt;header class="store-nav"&gt;</p>
            <p className="text-sky-600 dark:text-sky-300 pl-12">&lt;div id="cart-widget"&gt;🛒 {cartCount} Items&lt;/div&gt;</p>
            <p className="text-purple-600 dark:text-purple-400 pl-8">&lt;/header&gt;</p>
            <p className="text-purple-600 dark:text-purple-400 pl-8">&lt;main class="product-grid"&gt;</p>
            <p className="text-slate-500 dark:text-slate-400 pl-12">&lt;!-- 4 Server-Rendered Product Cards with zero client JSON payload --&gt;</p>
            <p className="text-purple-600 dark:text-purple-400 pl-8">&lt;/main&gt;</p>
            <p className="text-purple-600 dark:text-purple-400 pl-4">&lt;/body&gt;</p>
            <p className="text-purple-600 dark:text-purple-400">&lt;/html&gt;</p>
          </div>
        )}
      </div>
    </div>
  );
};
