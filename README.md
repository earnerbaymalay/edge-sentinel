# Edge Sentinel Dashboard v1.0.4

Autonomous Security Telemetry Dashboard for Edge Devices, optimized for Snapdragon 480 5G and Termux environments.

## 🚀 Quick Start (Termux)

If you have an older version, follow these steps to clean up and install the latest build.

### 1. Cleanup Old Version
```bash
# Delete the existing local folder (be careful!)
rm -rf edge-sentinel-dashboard
```

### 2. Installation
```bash
# Clone the latest version from your GitHub
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install
```

### 3. Configuration
Create a `.env` file to store your API key:
```bash
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
```

### 4. Run the Dashboard
```bash
npm run dev
```
The dashboard will be available at `http://localhost:3000`.

---

## 📱 PWA Support
This dashboard is a Progressive Web App. Once running:
1. Open `http://localhost:3000` in your mobile browser (Chrome/Edge recommended).
2. Click the **"Install App"** button in the header.
3. The app will now run in standalone mode from your home screen.

## 🛠 Tech Stack
- **Frontend**: React 19, Tailwind CSS 4, Recharts, Lucide Icons
- **Backend**: Node.js, Express, Socket.IO
- **AI**: Google Gemini SDK (@google/genai)
- **PWA**: Vite PWA Plugin

## 🔒 Security
- **Local-First**: Telemetry is processed locally on the device.
- **AI Analysis**: Encrypted transmission to Gemini for threat assessment.
- **Air-Gap Ready**: Designed to function in restricted network environments.
