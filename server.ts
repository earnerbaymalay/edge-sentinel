import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "Edge Sentinel Online", timestamp: new Date().toISOString() });
  });

  app.post("/api/analyze", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "AI Engine not configured. Please set API Key in settings." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `As Edge Sentinel AI, analyze this security telemetry or query: "${prompt}". Provide a concise, technical security assessment optimized for Snapdragon 480 5G edge constraints.`,
        config: {
          systemInstruction: "You are Edge Sentinel AI, a local-first security intelligence suite. Your tone is technical, precise, and authoritative. You specialize in Android/Termux security telemetry analysis.",
        }
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error('AI Analysis failed:', error);
      res.status(500).json({ error: "Sentinel AI offline" });
    }
  });

  // Telemetry Simulation
  const telemetryData = {
    cpu_usage: 0,
    memory_usage: 0,
    network_traffic: 0,
    threat_level: "Low",
    active_connections: [],
    logs: []
  };

  const generateLog = () => {
    const events = [
      "Inbound connection from 192.168.1.45",
      "Sentinel AI scanning process: 4567",
      "Memory spike detected in Termux environment",
      "Encrypted packet received on port 8001",
      "Snapdragon 480 NEON optimization active",
      "Threat analysis: No anomalies found",
      "Local-first buffer flush complete"
    ];
    return {
      timestamp: new Date().toLocaleTimeString(),
      message: events[Math.floor(Math.random() * events.length)],
      type: Math.random() > 0.8 ? "warning" : "info"
    };
  };

  setInterval(() => {
    telemetryData.cpu_usage = Math.floor(Math.random() * 40) + 10;
    telemetryData.memory_usage = Math.floor(Math.random() * 30) + 20;
    telemetryData.network_traffic = Math.floor(Math.random() * 500) + 50;
    
    if (Math.random() > 0.95) {
      telemetryData.threat_level = "Medium";
      telemetryData.logs.unshift({
        timestamp: new Date().toLocaleTimeString(),
        message: "Anomalous network pattern detected",
        type: "danger"
      });
    } else {
      telemetryData.threat_level = "Low";
    }

    if (telemetryData.logs.length > 50) telemetryData.logs.pop();
    if (Math.random() > 0.7) {
      telemetryData.logs.unshift(generateLog());
    }

    io.emit("telemetry_update", telemetryData);
  }, 2000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Edge Sentinel Dashboard running on http://localhost:${PORT}`);
  });
}

startServer();
