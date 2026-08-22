# VSM College AI Agent — Python Backend

FastAPI + PostgreSQL backend that powers the College AI Agent frontend.

```
Student -> React frontend -> FastAPI (/api/*) -> PostgreSQL -> context -> OpenAI -> answer
```

## 1. Install Python dependencies

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Configure `.env`

```bash
cp .env.example .env
```

Then edit `backend/.env`:

| Variable | Meaning |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | Your OpenAI API key (never committed, never sent to the browser) |
| `OPENAI_MODEL` | Model name, e.g. `gpt-4o-mini` |
| `CORS_ORIGINS` | Comma separated frontend origins |

## 3. Create the SQL database

```bash
createdb vsm_college
psql -d vsm_college -f ../database/schema.sql
```

This creates all tables (departments, courses, students, semester_subjects, facilities,
admissions, placements, faqs, timetables, chat_history) with keys, indexes and sample data.

## 4. Start the API server

```bash
uvicorn app.main:app --reload --port 8000
```

Interactive docs: http://localhost:8000/docs

## 5. Connect the frontend

In the project root `.env`:

```
VITE_API_BASE_URL="http://localhost:8000"
```

Then run the frontend with `npm run dev`. For production, set `VITE_API_BASE_URL`
to the deployed backend URL and add that frontend origin to `CORS_ORIGINS`.

## 6. Test the API

```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/courses
curl http://localhost:8000/api/facilities?category=labs
curl http://localhost:8000/api/placements
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What courses are offered?"}],"stream":false}'
```

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Server, database and AI status |
| GET | `/api/departments` | All departments |
| GET | `/api/courses` | Courses (`?level=`, `?department=`) |
| GET | `/api/courses/{id}` | Single course |
| GET | `/api/subjects` | Semester subjects (`?department=`, `?semester=`) |
| GET | `/api/facilities` | Facilities (`?category=`) |
| GET | `/api/admissions` | Admission routes and eligibility |
| GET | `/api/placements` | Placement records + summary stats (`?year=`) |
| GET | `/api/faqs` | FAQs (`?category=`) |
| GET | `/api/timetables` | III year timetables (`?class_name=`) |
| POST | `/api/chat` | AI chat (SSE stream by default, `"stream": false` for JSON) |
| POST | `/api/self-intro` | Generates the interview self-introduction |

## Security notes

- Secrets live only in `backend/.env`; the browser never sees the AI key.
- All requests/responses are validated with Pydantic models.
- All SQL runs through parameterized SQLAlchemy queries.
- Errors return `{"error": "..."}` with an appropriate HTTP status.
