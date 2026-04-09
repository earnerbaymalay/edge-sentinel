# Edge Sentinel usage guide

Instructions for setup, running, and monitoring.

---

## Installation

### Requirements

- Python 3.9+
- Node.js 14+
- `pip` and `npm` package managers

### Steps

1.  Clone the repository:
    ```bash
    git clone https://github.com/earnerbaymalay/edge-sentinel.git
    cd edge-sentinel
    ```

2.  Set up the backend:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3.  Set up the frontend:
    ```bash
    cd ../
    npm install
    ```

---

## Running Edge Sentinel

### Development mode

1.  Start the backend (from the `backend` directory):
    ```bash
    python main.py
    ```

2.  Start the frontend (from the `edge-sentinel` root directory):
    ```bash
    npm run dev
    ```

    Access the dashboard at `http://localhost:5173`.

### Production build

Instructions for building a production version will be added here based on future development.

---

## Monitoring

-   **Dashboard:** Real-time metrics are displayed on the React dashboard at `http://localhost:5173`.
-   **AI Analysis:** Check the AI section of the dashboard for insights from `llama.cpp` or Gemini.

---

## Troubleshooting

See the separate `TROUBLESHOOTING.md` for common issues and solutions.

---

[MIT License](LICENSE)
