"""Builds the college context sent to the AI model.

Everything here is read from the SQL database using parameterized
SQLAlchemy queries — no raw string interpolation of user input.
"""
from typing import List

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.college import (
    Admission,
    Course,
    Department,
    Facility,
    Faq,
    Placement,
    SemesterSubject,
    Timetable,
)

BASE_IDENTITY = """You are the official "VSM College Assistant" of VSM College of Engineering,
Ramachandrapuram, East Godavari District, Andhra Pradesh (affiliated to JNTUK Kakinada,
approved by AICTE). Official website: https://www.vsm.edu.in/Sites/vsmeng/

Rules:
1. Answer ONLY questions related to VSM College of Engineering.
2. Use simple, clear English that students easily understand.
3. Be polite and helpful, like a college help desk.
4. If the question is unrelated to VSM College, reply exactly:
   "Sorry, I am the VSM College Assistant and I can only answer questions related to VSM College."
5. If the answer is not in the context below, say so and point the student to
   https://www.vsm.edu.in/Sites/vsmeng/
6. Always refer to yourself as "VSM College Assistant".
7. Only use the COLLEGE DATA below as facts. Never invent numbers, names or timings.
"""

TOPICS = {
    "courses": ["course", "branch", "btech", "b.tech", "mtech", "m.tech", "mba", "diploma",
                "intermediate", "program", "degree", "department", "subject", "semester", "syllabus"],
    "facilities": ["facility", "facilities", "lab", "hostel", "library", "sports", "canteen",
                   "wifi", "bus", "transport", "medical", "gym", "campus", "block", "room"],
    "admissions": ["admission", "apply", "eligibility", "eamcet", "ecet", "icet", "polycet",
                   "gate", "counseling", "counselling", "fee", "document", "join"],
    "placements": ["placement", "package", "salary", "company", "recruit", "job", "lpa", "career"],
    "timetables": ["timetable", "time table", "schedule", "period", "class teacher", "monday",
                   "tuesday", "wednesday", "thursday", "friday", "saturday", "faculty"],
}


def _topics_for(question: str) -> List[str]:
    q = question.lower()
    hits = [topic for topic, words in TOPICS.items() if any(w in q for w in words)]
    return hits or list(TOPICS.keys())


def _fmt(rows: List[str], title: str) -> str:
    return f"\n## {title}\n" + "\n".join(f"- {r}" for r in rows) if rows else ""


def build_context(db: Session, question: str) -> str:
    topics = _topics_for(question)
    parts: List[str] = [BASE_IDENTITY, "\n# COLLEGE DATA (from the college database)"]

    departments = db.scalars(select(Department).order_by(Department.id)).all()
    parts.append(
        _fmt([f"{d.code} — {d.name} ({d.block or 'campus'}), HOD: {d.hod or 'N/A'}. {d.description or ''}"
              for d in departments], "Departments")
    )

    if "courses" in topics:
        courses = db.scalars(select(Course).order_by(Course.level, Course.name)).all()
        parts.append(_fmt(
            [f"{c.name} [{c.level}] — duration {c.duration or 'N/A'}, intake {c.intake or 'N/A'}. {c.description or ''}"
             for c in courses], "Courses offered"))

        subjects = db.scalars(
            select(SemesterSubject).order_by(SemesterSubject.semester, SemesterSubject.id)
        ).all()
        parts.append(_fmt(
            [f"Semester {s.semester}: {s.subject_name}" for s in subjects],
            "CSE B.Tech semester subjects"))

    if "facilities" in topics:
        facilities = db.scalars(select(Facility).order_by(Facility.category, Facility.name)).all()
        parts.append(_fmt(
            [f"[{f.category}] {f.name} — {f.location or 'campus'}. {f.description or ''}" for f in facilities],
            "Facilities"))

    if "admissions" in topics:
        admissions = db.scalars(select(Admission).order_by(Admission.id)).all()
        parts.append(_fmt(
            [f"{a.program}: eligibility — {a.eligibility} Entrance: {a.entrance_exam or 'N/A'}. "
             f"Process: {a.process or 'N/A'} Documents: {a.documents or 'N/A'}" for a in admissions],
            "Admissions"))

    if "placements" in topics:
        placements = db.scalars(
            select(Placement).order_by(Placement.academic_year.desc(), Placement.company)
        ).all()
        parts.append(_fmt(
            [f"{p.academic_year} {p.company}: {p.students_placed} placed, highest {p.highest_package} LPA, "
             f"average {p.average_package} LPA, role {p.role_offered or 'N/A'}" for p in placements],
            "Placements"))

    if "timetables" in topics:
        timetables = db.scalars(select(Timetable).order_by(Timetable.class_name, Timetable.id)).all()
        parts.append(_fmt(
            [f"{t.class_name} (Room {t.room}, Class Teacher {t.class_teacher}) {t.day_of_week}: {t.periods}"
             + (f" | Faculty: {t.faculty_notes}" if t.faculty_notes else "")
             for t in timetables],
            "III year timetables (P1 9:30-10:30, P2 10:30-11:30, P3 11:30-12:30, Lunch 12:30-1:30, "
            "P4 1:30-2:30, P5 2:30-3:30, P6 3:30-4:30)"))

    # Keyword-matched FAQs (parameterized LIKE, never string-concatenated SQL)
    terms = [w for w in question.lower().split() if len(w) > 3][:6]
    faq_query = select(Faq)
    if terms:
        faq_query = faq_query.where(
            or_(*[or_(Faq.question.ilike(f"%{t}%"), Faq.answer.ilike(f"%{t}%")) for t in terms])
        )
    faqs = db.scalars(faq_query.limit(12)).all()
    if not faqs:
        faqs = db.scalars(select(Faq).where(Faq.category == "about").limit(6)).all()
    parts.append(_fmt([f"Q: {f.question}\n  A: {f.answer}" for f in faqs], "Relevant FAQs"))

    return "\n".join(p for p in parts if p)
