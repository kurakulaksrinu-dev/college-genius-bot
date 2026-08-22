"""OpenAI chat completions client (streaming and non-streaming)."""
import json
import logging
from typing import AsyncIterator, Dict, List

import httpx

from app.config import get_settings
from app.utils.errors import ApiError

logger = logging.getLogger("vsm.ai")
settings = get_settings()

TIMEOUT = httpx.Timeout(connect=10.0, read=120.0, write=30.0, pool=10.0)


def _headers() -> Dict[str, str]:
    if not settings.openai_api_key:
        raise ApiError(
            "AI is not configured. Set OPENAI_API_KEY in backend/.env and restart the server.",
            status_code=500,
        )
    return {
        "Authorization": f"Bearer {settings.openai_api_key}",
        "Content-Type": "application/json",
    }


def _raise_for_status(status: int, body: str) -> None:
    if status == 401:
        raise ApiError("AI authentication failed. Check OPENAI_API_KEY.", status_code=500)
    if status == 429:
        raise ApiError("Too many requests to the AI service. Please wait a moment and try again.", 429)
    if status in (402, 403):
        raise ApiError("AI service quota exhausted or access denied. Please check the AI account.", 402)
    logger.error("AI provider error %s: %s", status, body[:500])
    raise ApiError("The AI service failed to respond. Please try again.", status_code=502)


async def stream_chat(messages: List[Dict[str, str]]) -> AsyncIterator[str]:
    """Yield raw Server-Sent Event lines in OpenAI stream format."""
    payload = {"model": settings.openai_model, "messages": messages, "stream": True}
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        async with client.stream(
            "POST", f"{settings.openai_base_url}/chat/completions", headers=_headers(), json=payload
        ) as resp:
            if resp.status_code >= 400:
                body = (await resp.aread()).decode("utf-8", "ignore")
                _raise_for_status(resp.status_code, body)
            async for line in resp.aiter_lines():
                if line:
                    yield f"{line}\n\n"
    yield "data: [DONE]\n\n"


async def complete_chat(messages: List[Dict[str, str]]) -> str:
    """Non-streaming completion; returns the assistant text."""
    payload = {"model": settings.openai_model, "messages": messages}
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        resp = await client.post(
            f"{settings.openai_base_url}/chat/completions", headers=_headers(), json=payload
        )
    if resp.status_code >= 400:
        _raise_for_status(resp.status_code, resp.text)
    try:
        data = resp.json()
        return data["choices"][0]["message"]["content"] or ""
    except (KeyError, IndexError, json.JSONDecodeError) as exc:
        logger.error("Unexpected AI response: %s", resp.text[:500])
        raise ApiError("The AI service returned an unexpected response.", status_code=502) from exc
