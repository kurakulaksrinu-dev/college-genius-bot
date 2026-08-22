"""Generates the interview self-introduction used by the Practice page."""
from typing import Dict

from app.services import ai_service
from app.utils.errors import ApiError

SYSTEM_PROMPT = (
    "You are a placement trainer at VSM College of Engineering. Using the student's details, "
    "write a polished, natural self-introduction they can speak in an interview. Rules: 200-260 words, "
    "first person, simple confident English, flowing paragraphs (2-3), no headings, no bullet points, "
    "no labels, no placeholders. Weave every detail smoothly and end with a forward-looking line. "
    "Output only the self-introduction text."
)

MAX_FIELD_LEN = 500


async def generate_intro(answers: Dict[str, str]) -> str:
    cleaned = {
        str(k)[:60]: str(v).strip()[:MAX_FIELD_LEN]
        for k, v in answers.items()
        if str(v).strip()
    }
    if not cleaned:
        raise ApiError("Please answer at least one question before generating the introduction.", 400)

    details = "\n".join(f"{k}: {v}" for k, v in cleaned.items())
    return await ai_service.complete_chat(
        [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Student details:\n{details}"},
        ]
    )
