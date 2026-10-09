import asyncio
import json
import logging
from collections.abc import AsyncIterator
from uuid import UUID

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
from pydantic import BaseModel, Field, field_validator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from .agent import graph
from .settings import settings
from .store import save_message

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Rehan Portfolio Agent", docs_url=None, redoc_url=None)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origin_list,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
    allow_credentials=False,
)


class ChatRequest(BaseModel):
    session_id: UUID
    message: str = Field(min_length=1, max_length=1000)

    @field_validator("message")
    @classmethod
    def normalize_message(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("message cannot be blank")
        return normalized


@app.get("/health")
async def health() -> dict[str, str | bool]:
    return {
        "status": "ok",
        "configured": bool(settings.groq_api_key),
        "model": settings.groq_model,
    }


def _content_as_text(content: object) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, dict) and isinstance(item.get("text"), str):
                parts.append(item["text"])
            else:
                parts.append(str(item))
        return "".join(parts)
    return str(content)


@app.post("/chat")
@limiter.limit("20/10minutes")
async def chat(request: Request, payload: ChatRequest) -> StreamingResponse:
    async def events() -> AsyncIterator[str]:
        try:
            session_id = str(payload.session_id)
            await asyncio.to_thread(save_message, session_id, "user", payload.message)
            result = await asyncio.wait_for(
                graph.ainvoke(
                    {"messages": [HumanMessage(content=payload.message)]},
                    config={
                        "configurable": {"thread_id": session_id},
                        "recursion_limit": 4,
                    },
                ),
                timeout=40,
            )
            response = _content_as_text(result["messages"][-1].content).strip()
            if not response:
                raise RuntimeError("model returned an empty response")

            await asyncio.to_thread(save_message, session_id, "assistant", response)
            for word in response.split():
                yield f"event: token\ndata: {json.dumps({'t': word + ' '})}\n\n"
                await asyncio.sleep(0.012)
            yield f"event: done\ndata: {json.dumps({'message_id': session_id})}\n\n"
        except asyncio.CancelledError:
            raise
        except asyncio.TimeoutError:
            yield f"event: error\ndata: {json.dumps({'code': 'llm_timeout', 'message': 'The assistant timed out. Please try again.'})}\n\n"
        except Exception:
            logger.exception("Portfolio agent request failed")
            yield f"event: error\ndata: {json.dumps({'code': 'agent_unavailable', 'message': 'The assistant is temporarily unavailable. Please try again.'})}\n\n"

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-store",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
