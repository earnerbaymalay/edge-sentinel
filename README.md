# Edge Sentinel

Security monitoring with a real-time telemetry dashboard. React frontend, FastAPI backend with WebSocket streaming.

[![Status](https://img.shields.io/badge/status-consolidated-81a1c1?style=for-the-badge)]()
[![Stack](https://img.shields.io/badge/stack-React_%7C_FastAPI-565f89?style=for-the-badge&logo=fastapi)]()
[![License](https://img.shields.io/badge/license-MIT-f1fa8c?style=for-the-badge)](LICENSE)

---

## What It Does

Monitors hardware metrics and runs security analysis. FastAPI backend streams battery, CPU, and memory data over WebSockets to a React dashboard with live charts.

## Features

- Real-time hardware telemetry (battery, CPU, memory)
- FastAPI backend with WebSocket streaming
- React dashboard with Recharts and Framer Motion
- Local AI analysis via llama.cpp
- Optional cloud AI analysis via Gemini
- Security scanning integration with Aether vault-scan

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
├── backend/main.py       # FastAPI + WebSocket telemetry server
├── src/App.tsx           # React dashboard
├── src/components/       # Chart, metric, and alert components
├── server.ts             # Express + Socket.io (legacy)
├── vite.config.ts
└── package.json
```

---

[MIT License](LICENSE)
