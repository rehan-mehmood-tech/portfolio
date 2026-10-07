import asyncio
import json
from uuid import UUID
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from slowapi import _rate_limit_exceeded_handler
from .agent import graph
from .settings import settings
from .store import save_message

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Rehan Portfolio Agent", docs_url=None, redoc_url=None)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(CORSMiddleware, allow_origins=[x.strip() for x in settings.allowed_origins.split(",")], allow_methods=["POST","GET"], allow_headers=["content-type"], allow_credentials=False)

class ChatRequest(BaseModel):
    session_id: UUID
    message: str = Field(min_length=1, max_length=1000)

@app.get("/health")
async def health(): return {"status": "ok"}

@app.post("/chat")
@limiter.limit("20/10minutes")
async def chat(request: Request, payload: ChatRequest):
    async def events():
        try:
            save_message(str(payload.session_id), "user", payload.message)
            result = await asyncio.wait_for(graph.ainvoke({"message": payload.message, "response": ""}), timeout=30)
            response = result["response"]
            save_message(str(payload.session_id), "assistant", response)
            for word in response.split(" "):
                yield f"event: token\ndata: {json.dumps({'t': word + ' '})}\n\n"
                await asyncio.sleep(0.015)
            yield f"event: done\ndata: {json.dumps({'message_id': str(payload.session_id)})}\n\n"
        except asyncio.TimeoutError:
            yield f"event: error\ndata: {json.dumps({'code':'llm_unavailable','message':'The assistant timed out. Please use the contact form.'})}\n\n"
    return StreamingResponse(events(), media_type="text/event-stream", headers={"Cache-Control":"no-cache","X-Accel-Buffering":"no"})
