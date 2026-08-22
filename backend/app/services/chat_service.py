"""Chat orchestration: SQL context retrieval + AI call + history persistence."""
import logging
import uuid
from typing import Dict, List

from sqlalchemy.orm import Session

from app.models.college import ChatHistory
from app.schemas.college import ChatMessage
from app.services import ai_service
from app.services.context_service import build_context

logger = logging.getLogger("vsm.chat")

MAX_TURNS = 20


def new_session_id() -> str:
    return uuid.uuid4().hex


def build_prompt(db: Session, messages: List[ChatMessage]) -> List[Dict[str, str]]:
    last_question = next(
        (m.content for m in reversed(messages) if m.role == "user"), ""
    )
    system = build_context(db, last_question)
    history = [{"role": m.role, "content": m.content} for m in messages[-MAX_TURNS:]]
    return [{"role": "system", "content": system}, *history]


def save_history(db: Session, session_id: str, question: str, answer: str) -> None:
    if not question or not answer:
        return
    try:
        db.add(ChatHistory(session_id=session_id, question=question, answer=answer))
        db.commit()
    except Exception:  # history must never break the chat response
        db.rollback()
        logger.exception("Failed to persist chat history")


async def answer(db: Session, messages: List[ChatMessage], session_id: str) -> str:
    prompt = build_prompt(db, messages)
    text = await ai_service.complete_chat(prompt)
    question = next((m.content for m in reversed(messages) if m.role == "user"), "")
    save_history(db, session_id, question, text)
    return text
