"""AI chat endpoints."""
import json
from typing import AsyncIterator

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.college import (
    ChatRequest,
    ChatResponse,
    SelfIntroRequest,
    SelfIntroResponse,
)
from app.services import ai_service, chat_service
from app.services.intro_service import generate_intro
from app.utils.errors import ApiError

router = APIRouter()


@router.post("/chat")
async def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    session_id = payload.session_id or chat_service.new_session_id()
    question = next((m.content for m in reversed(payload.messages) if m.role == "user"), "")
    if not question:
        raise ApiError("Please send at least one student question.", 400)

    prompt = chat_service.build_prompt(db, payload.messages)

    if not payload.stream:
        text = await ai_service.complete_chat(prompt)
        chat_service.save_history(db, session_id, question, text)
        return ChatResponse(answer=text, session_id=session_id)

    async def event_stream() -> AsyncIterator[str]:
        collected: list[str] = []
        try:
            async for chunk in ai_service.stream_chat(prompt):
                for line in chunk.splitlines():
                    if line.startswith("data: "):
                        raw = line[6:].strip()
                        if raw and raw != "[DONE]":
                            try:
                                delta = json.loads(raw)["choices"][0]["delta"].get("content")
                                if delta:
                                    collected.append(delta)
                            except (json.JSONDecodeError, KeyError, IndexError):
                                pass
                yield chunk
        except ApiError as exc:
            yield f"data: {json.dumps({'error': exc.message})}\n\n"
            yield "data: [DONE]\n\n"
        finally:
            chat_service.save_history(db, session_id, question, "".join(collected))

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "X-Session-Id": session_id,
        },
    )


@router.post("/self-intro", response_model=SelfIntroResponse)
async def self_intro(payload: SelfIntroRequest):
    intro = await generate_intro(payload.answers)
    return SelfIntroResponse(intro=intro)
