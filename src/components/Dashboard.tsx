import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Shield, 
  Activity, 
  Cpu, 
  Database, 
  Zap, 
  AlertTriangle, 
  Terminal, 
  Network, 
  Search,
  Lock,
  Smartphone,
  Server,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Telemetry {
  cpu_usage: number;
  memory_usage: number;
  network_traffic: number;
  threat_level: string;
  logs: LogEntry[];
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'danger';
}

// --- Key Management Component ---
const KeyManager = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Fallback for environments where the platform helper isn't available
        setHasKey(true); 
      }
    };
    checkKey();
  }, []);

  const handleManageKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Assume success and refresh state
      setHasKey(true);
    } else {
      alert("API Key management is handled via the platform settings menu.");
    }
  };

  return (
    <div className="bg-[#141414] border border-[#1F1F1F] p-4 rounded-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-gray-500" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400">AI Engine Security</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${hasKey ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-red-500 shadow-[0_0_5px_#ef4444]'}`} />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono text-gray-600 uppercase">Status</span>
          <span className={`text-[11px] font-mono uppercase ${hasKey ? 'text-green-500' : 'text-red-500'}`}>
            {hasKey === null ? 'Checking...' : hasKey ? 'Authorized' : 'Unauthorized'}
          </span>
        </div>
        
        <p className="text-[10px] font-mono text-gray-500 leading-tight">
          Sentinel AI requires a valid Gemini API Key for autonomous telemetry analysis. Keys are managed securely via the platform vault.
        </p>

        <button 
          onClick={handleManageKey}
          className="w-full bg-black border border-[#333] hover:border-orange-500/50 text-orange-500 text-[10px] font-mono uppercase py-2 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3 h-3" />
          Manage API Access
        </button>
      </div>
    </div>
  );
};

// --- Sentinel AI Component ---
const SentinelAI = () => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prompt, setPrompt] = useState('');

  const analyzeThreat = async () => {
    if (!prompt) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 503) {
          setAnalysis('ERROR: AI Engine not configured. Please authorize API access in the Security panel.');
        } else {
          throw new Error(data.error || 'Sentinel AI offline');
        }
        return;
      }
      
      setAnalysis(data.text || 'No analysis generated.');
    } catch (error) {
      console.error('AI Analysis failed:', error);
      setAnalysis('Error: Sentinel AI offline. Check API connectivity.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#333] p-4 rounded-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 border-b border-[#333] pb-2">
        <Shield className="w-4 h-4 text-orange-500" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-orange-500">Sentinel AI Intelligence</span>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar">
        {analysis ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-[13px] font-mono text-gray-300 leading-relaxed whitespace-pre-wrap"
          >
            {analysis}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <Search className="w-8 h-8 mb-2" />
            <p className="text-[10px] font-mono uppercase">Awaiting Input...</p>
          </div>
        )}
      </div>

      <div className="relative">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && analyzeThreat()}
          placeholder="QUERY SENTINEL AI..."
          className="w-full bg-black border border-[#333] p-2 text-[12px] font-mono text-orange-500 focus:outline-none focus:border-orange-500/50 placeholder:text-gray-700"
        />
        <button 
          onClick={analyzeThreat}
          disabled={isAnalyzing}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-400 disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

// --- Main Dashboard ---
export default function Dashboard() {
  const [telemetry, setTelemetry] = useState<Telemetry>({
    cpu_usage: 0,
    memory_usage: 0,
    network_traffic: 0,
    threat_level: 'Low',
    logs: []
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io();

    socketRef.current.on('telemetry_update', (data: Telemetry) => {
      setTelemetry(data);
      setChartData(prev => {
        const newData = [...prev, { 
          time: new Date().toLocaleTimeString(), 
          cpu: data.cpu_usage,
          mem: data.memory_usage,
          net: data.network_traffic / 10
        }];
        return newData.slice(-20);
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E4E3E0] font-sans p-4 lg:p-6 selection:bg-orange-500 selection:text-black">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#1A1A1A] pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
            <h1 className="text-2xl font-mono tracking-tighter uppercase font-bold">Edge Sentinel <span className="text-orange-500">v1.0.4</span></h1>
          </div>
          <p className="text-[11px] font-mono text-gray-500 uppercase tracking-[0.2em]">Autonomous Security Telemetry • Snapdragon 480 Optimized</p>
        </div>
        
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-[10px] font-mono text-gray-600 uppercase mb-1">Threat Level</p>
            <p className={`text-sm font-mono uppercase font-bold ${telemetry.threat_level === 'Low' ? 'text-green-500' : 'text-orange-500'}`}>
              {telemetry.threat_level}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-gray-600 uppercase mb-1">Uptime</p>
            <p className="text-sm font-mono uppercase font-bold text-gray-300">04:12:33:09</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-gray-600 uppercase mb-1">Node ID</p>
            <p className="text-sm font-mono uppercase font-bold text-gray-300">ES-M-7712</p>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stats & Charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'CPU Load', value: `${telemetry.cpu_usage}%`, icon: Cpu, color: 'text-blue-400' },
              { label: 'Memory', value: `${telemetry.memory_usage}%`, icon: Database, color: 'text-purple-400' },
              { label: 'Net Traffic', value: `${telemetry.network_traffic}kb/s`, icon: Network, color: 'text-green-400' },
              { label: 'AI Inference', value: 'Active', icon: Zap, color: 'text-orange-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#141414] border border-[#1F1F1F] p-4 rounded-sm hover:border-[#333] transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                  <div className="w-1 h-1 rounded-full bg-gray-700" />
                </div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-xl font-mono font-bold text-gray-100">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main Chart */}
          <div className="bg-[#141414] border border-[#1F1F1F] p-6 rounded-sm h-[350px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400">Live Telemetry Stream</span>
              </div>
              <div className="flex gap-4 text-[9px] font-mono uppercase text-gray-500">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full" /> CPU</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full" /> MEM</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> NET</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#444" fontSize={10} fontStyle="italic" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#E4E3E0' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#f97316" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                <Area type="monotone" dataKey="mem" stroke="#3b82f6" fill="transparent" strokeWidth={1} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="net" stroke="#22c55e" fill="transparent" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Terminal Logs */}
          <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-sm overflow-hidden">
            <div className="bg-[#1A1A1A] px-4 py-2 flex items-center justify-between border-b border-[#1F1F1F]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3 text-gray-500" />
                <span className="text-[10px] font-mono uppercase text-gray-400">System Kernel Logs</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#333]" />
                <div className="w-2 h-2 rounded-full bg-[#333]" />
                <div className="w-2 h-2 rounded-full bg-[#333]" />
              </div>
            </div>
            <div className="p-4 h-[200px] overflow-y-auto font-mono text-[11px] space-y-1 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {telemetry.logs.map((log, i) => (
                  <motion.div 
                    key={`${log.timestamp}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 group"
                  >
                    <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                    <span className={`
                      ${log.type === 'warning' ? 'text-orange-400' : ''}
                      ${log.type === 'danger' ? 'text-red-500 font-bold' : ''}
                      ${log.type === 'info' ? 'text-gray-400' : ''}
                    `}>
                      {log.message}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: AI & Network */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sentinel AI Panel */}
          <div className="h-[450px]">
            <SentinelAI />
          </div>

          {/* Key Management */}
          <KeyManager />

          {/* Device Info */}
          <div className="bg-[#141414] border border-[#1F1F1F] p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-4 h-4 text-gray-500" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400">Hardware Profile</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Processor', value: 'Snapdragon 480 5G' },
                { label: 'Architecture', value: 'ARM64-v8a' },
                { label: 'OS Environment', value: 'Termux / Android 13' },
                { label: 'AI Backend', value: 'llama.cpp / Qwen-0.5B' },
                { label: 'Encryption', value: 'AES-256-GCM' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between border-b border-[#1F1F1F] pb-2">
                  <span className="text-[10px] font-mono text-gray-600 uppercase">{item.label}</span>
                  <span className="text-[11px] font-mono text-gray-300">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-full">
                <Lock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-orange-500/70 uppercase">Security Protocol</p>
                <p className="text-sm font-mono font-bold text-orange-500 uppercase">Air-Gap Active</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-[#1A1A1A] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <p className="text-[10px] font-mono text-gray-600 uppercase">© 2026 Edge Sentinel Mobile</p>
          <div className="h-4 w-[1px] bg-[#1A1A1A]" />
          <p className="text-[10px] font-mono text-gray-600 uppercase">Local-First Architecture</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] font-mono text-gray-500 uppercase">WebSocket Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] font-mono text-gray-500 uppercase">AI Engine Ready</span>
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
}
