# Edge Sentinel troubleshooting guide

Common issues and solutions.

---

## Backend issues

### FastAPI server not starting
- Check if Python dependencies are installed (`pip install -r requirements.txt`).
- Ensure no other process is using port 8000.
- Check the backend logs for specific error messages.

### WebSocket connection issues
- Verify the FastAPI backend is running.
- Check browser console for WebSocket errors.
- Ensure the frontend is configured to connect to the correct WebSocket endpoint.

---

## Frontend issues

### Dashboard not loading
- Ensure all Node.js dependencies are installed (`npm install`).
- Check browser console for JavaScript errors.
- Verify the frontend development server is running (`npm run dev`).

### Data not updating in real-time
- Check the WebSocket connection status in your browser's developer tools.
- Verify the backend is actively streaming data.

---

## AI integration issues

### Local AI (llama.cpp) not providing analysis
- Ensure `llama.cpp` is running and accessible.
- Check `llama.cpp` logs for errors.
- Verify the integration configuration in the FastAPI backend.

### Cloud AI (Gemini) not providing analysis
- Check API key configuration.
- Verify internet connectivity.
- Review API call logs for error messages.

---

[MIT License](LICENSE)
