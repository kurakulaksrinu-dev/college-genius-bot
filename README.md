# VSM College AI Agent

AI-powered college information assistant for VSM College of Engineering.

```
Student -> React frontend -> Python FastAPI backend -> PostgreSQL -> college context -> AI model -> answer
```

## Project structure

```
backend/            Python FastAPI backend (REST API + AI chat)
  app/main.py       App entrypoint, CORS, error handlers
  app/api/          Route modules (college info, chat)
  app/models/       SQLAlchemy ORM models
  app/schemas/      Pydantic request/response models
  app/services/     AI client, SQL context retrieval, chat + intro logic
  app/database/     Engine and session management
  requirements.txt
  .env.example
database/schema.sql PostgreSQL schema, keys, indexes and sample data
src/                React + Vite + Tailwind frontend
```

## 1. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # then set DATABASE_URL and OPENAI_API_KEY
createdb vsm_college
psql -d vsm_college -f ../database/schema.sql
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs — details in [backend/README.md](backend/README.md).

## 2. Frontend

```bash
npm install
npm run dev
```

The frontend reads `VITE_API_BASE_URL` from the root `.env` (default `http://localhost:8000`).

## 3. Test the API

```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/courses
curl -X POST http://localhost:8000/api/chat -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Tell me about placements"}],"stream":false}'
```

## Endpoints

`GET /api/health`, `/api/departments`, `/api/courses`, `/api/courses/{id}`, `/api/subjects`,
`/api/facilities`, `/api/admissions`, `/api/placements`, `/api/faqs`, `/api/timetables`,
`POST /api/chat`, `POST /api/self-intro`.

## Tech stack

- Frontend: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Python 3.11+, FastAPI, Pydantic, SQLAlchemy
- Database: PostgreSQL
- AI: OpenAI chat completions (key stored server-side in `backend/.env`)
