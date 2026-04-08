<div align="center">

# 🛡️ E D G E — S E N T I N E L
### *Local-First Security Telemetry & AI Dashboard*

<p align="center">
  <a href="https://earnerbaymalay.github.io/sideload/">
    📲 <strong>Install on any device — phone, Mac, or iPad — from one place: Sideload Hub</strong>
  </a>
</p>

[![Status](https://img.shields.io/badge/status-consolidated-81a1c1?style=for-the-badge)]()
[![Stack](https://img.shields.io/badge/stack-React_%7C_FastAPI-565f89?style=for-the-badge&logo=fastapi)]()
[![AI](https://img.shields.io/badge/ai-local_%7C_cloud-4c566a?style=for-the-badge)]()

[Quick Start](#quick-start) · [Architecture](#architecture) · [Ecosystem](#ecosystem)

</div>

---

## Overview

Edge-Sentinel is a security monitoring suite that bridges raw hardware metrics with intelligent security analysis. Real-time telemetry dashboard (React) powered by a FastAPI backend with optional AI analysis.

## Features

| Feature | Status |
|---------|--------|
| Real-time hardware telemetry | ✅ Battery, CPU, Memory |
| FastAPI backend with WebSockets | ✅ |
| React dashboard with live charts | ✅ Recharts + Framer Motion |
| Local AI analysis (llama.cpp) | ✅ |
| Cloud AI analysis (Gemini) | ✅ Optional |
| Security scanning integration | ✅ Aether vault-scan |

## Quick Start

```bash
# Backend
cd backend && pip install -r requirements.txt
python main.py

# Frontend
npm install
npm run dev
```

Dashboard opens at `http://localhost:5173`, API at `http://localhost:8000`.

## Architecture

```
edge-sentinel/
├── backend/
│   └── main.py          # FastAPI + WebSocket telemetry server
├── src/
│   ├── App.tsx           # React dashboard
│   └── components/       # Chart, metric, and alert components
├── server.ts             # Express + Socket.io (legacy)
├── vite.config.ts        # Vite build config
└── package.json          # Node dependencies
```

## Ecosystem

Edge-Sentinel is part of the local-first app ecosystem:

| Project | Repo | Purpose |
|---------|------|---------|
| 🌌 Aether | [aether](https://github.com/earnerbaymalay/aether) | Local AI workstation |
| 🛡️ Edge Sentinel | (this repo) | Security telemetry dashboard |
| 🛡️ Cypherchat | [e2eecc](https://github.com/earnerbaymalay/e2eecc) | E2EE messaging |
| 🌗 Gloam | [Gloam](https://github.com/earnerbaymalay/Gloam) | Solar-timed journaling |

📲 **[Install any app from the Sideload Hub →](https://earnerbaymalay.github.io/sideload/)**

---

<div align="center">

Security at the Edge. Absolute Privacy. Total Control.

</div>
