"""College information endpoints."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database.session import get_db
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
from app.schemas.college import (
    AdmissionOut,
    CourseOut,
    DepartmentOut,
    FacilityOut,
    FaqOut,
    PlacementOut,
    PlacementStats,
    PlacementsResponse,
    SubjectOut,
    TimetableOut,
)

router = APIRouter()


@router.get("/departments", response_model=List[DepartmentOut])
def list_departments(db: Session = Depends(get_db)):
    return db.scalars(select(Department).order_by(Department.id)).all()


@router.get("/courses", response_model=List[CourseOut])
def list_courses(
    level: Optional[str] = Query(default=None, max_length=40),
    department: Optional[str] = Query(default=None, max_length=16),
    db: Session = Depends(get_db),
):
    stmt = select(Course).options(selectinload(Course.department))
    if level:
        stmt = stmt.where(Course.level == level.lower())
    if department:
        stmt = stmt.join(Department).where(Department.code == department.upper())
    return db.scalars(stmt.order_by(Course.level, Course.name)).all()


@router.get("/courses/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.get("/subjects", response_model=List[SubjectOut])
def list_subjects(
    department: str = Query(default="CSE", max_length=16),
    semester: Optional[int] = Query(default=None, ge=1, le=8),
    db: Session = Depends(get_db),
):
    stmt = (
        select(SemesterSubject)
        .join(Department)
        .where(Department.code == department.upper())
    )
    if semester:
        stmt = stmt.where(SemesterSubject.semester == semester)
    return db.scalars(stmt.order_by(SemesterSubject.semester, SemesterSubject.id)).all()


@router.get("/facilities", response_model=List[FacilityOut])
def list_facilities(
    category: Optional[str] = Query(default=None, max_length=60),
    db: Session = Depends(get_db),
):
    stmt = select(Facility)
    if category:
        stmt = stmt.where(Facility.category == category.lower())
    return db.scalars(stmt.order_by(Facility.category, Facility.name)).all()


@router.get("/admissions", response_model=List[AdmissionOut])
def list_admissions(db: Session = Depends(get_db)):
    return db.scalars(select(Admission).order_by(Admission.id)).all()


@router.get("/placements", response_model=PlacementsResponse)
def list_placements(
    year: Optional[str] = Query(default=None, max_length=16),
    db: Session = Depends(get_db),
):
    stmt = select(Placement)
    if year:
        stmt = stmt.where(Placement.academic_year == year)
    records = db.scalars(stmt.order_by(Placement.academic_year.desc(), Placement.company)).all()

    stats = None
    if records:
        latest = max(r.academic_year for r in records)
        latest_rows = [r for r in records if r.academic_year == latest]
        placed = sum(r.students_placed or 0 for r in latest_rows)
        averages = [float(r.average_package) for r in latest_rows if r.average_package]
        stats = PlacementStats(
            academic_year=latest,
            highest_package=max(float(r.highest_package or 0) for r in latest_rows),
            average_package=round(sum(averages) / len(averages), 2) if averages else 0.0,
            total_placed=placed,
            companies=len(latest_rows),
        )
    return PlacementsResponse(stats=stats, records=records)


@router.get("/faqs", response_model=List[FaqOut])
def list_faqs(
    category: Optional[str] = Query(default=None, max_length=60),
    db: Session = Depends(get_db),
):
    stmt = select(Faq)
    if category:
        stmt = stmt.where(Faq.category == category.lower())
    return db.scalars(stmt.order_by(Faq.id)).all()


@router.get("/timetables", response_model=List[TimetableOut])
def list_timetables(
    class_name: Optional[str] = Query(default=None, max_length=60),
    db: Session = Depends(get_db),
):
    stmt = select(Timetable)
    if class_name:
        stmt = stmt.where(Timetable.class_name.ilike(f"%{class_name}%"))
    return db.scalars(stmt.order_by(Timetable.class_name, Timetable.id)).all()
