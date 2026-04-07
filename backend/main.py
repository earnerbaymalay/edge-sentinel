import asyncio, json, httpx
from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/")
async def get(): return FileResponse('app/static/index.html')

async def analyze(data):
    try:
        async with httpx.AsyncClient(base_url="http://localhost:8080", timeout=20.0) as c:
            # Qwen-specific Chat Format to force generation
            pct = data.get('percentage', 0)
            prompt = f"<|im_start|>user\nBattery is {pct}%. Give a 5-word security status.<|im_end|>\n<|im_start|>assistant\n"
            
            payload = {
                "prompt": prompt,
                "n_predict": 20,
                "temperature": 0.7,
                "stop": ["<|im_end|>", "<|im_start|>"]
            }
            
            r = await c.post("/completion", json=payload)
            res = r.json()
            
            # Shotgun approach: catch any possible text field
            text = res.get("content", "").strip() or res.get("text", "").strip()
            
            return text if text else "System state: Nominal."
    except Exception as e:
        return "AI Engine standing by..."

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            proc = await asyncio.create_subprocess_shell("termux-battery-status", stdout=asyncio.subprocess.PIPE)
            out, _ = await proc.communicate()
            d = json.loads(out.decode())
            d["analysis"] = await analyze(d)
            await websocket.send_json(d)
            await asyncio.sleep(5)
        except:
            break
