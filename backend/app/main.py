"""VSM College AI Agent — FastAPI application entrypoint."""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.routes_chat import router as chat_router
from app.api.routes_college import router as college_router
from app.config import get_settings
from app.database.session import engine
from app.utils.errors import register_error_handlers

logging.basicConfig(level=logging.INFO)
settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Python + PostgreSQL backend powering the VSM College AI Agent frontend.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"https://.*\.lovable\.app|https://.*\.lovableproject\.com",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Session-Id"],
)

register_error_handlers(app)

app.include_router(college_router, prefix="/api", tags=["college"])
app.include_router(chat_router, prefix="/api", tags=["chat"])


@app.get("/api/health", tags=["system"])
def health():
    db_ok = True
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception:
        db_ok = False
    return {
        "status": "ok" if db_ok else "degraded",
        "database": "connected" if db_ok else "unavailable",
        "ai_configured": bool(settings.openai_api_key),
    }
