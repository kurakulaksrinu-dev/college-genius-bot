"""Pydantic request/response models."""
from typing import List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class DepartmentOut(ORMModel):
    id: int
    code: str
    name: str
    block: Optional[str] = None
    hod: Optional[str] = None
    description: Optional[str] = None


class CourseOut(ORMModel):
    id: int
    name: str
    level: str
    duration: Optional[str] = None
    intake: Optional[int] = None
    description: Optional[str] = None
    department: Optional[DepartmentOut] = None


class SubjectOut(ORMModel):
    id: int
    semester: int
    subject_name: str
    subject_code: Optional[str] = None
    credits: Optional[int] = None


class FacilityOut(ORMModel):
    id: int
    name: str
    category: str
    location: Optional[str] = None
    description: Optional[str] = None


class AdmissionOut(ORMModel):
    id: int
    program: str
    eligibility: str
    entrance_exam: Optional[str] = None
    process: Optional[str] = None
    documents: Optional[str] = None


class PlacementOut(ORMModel):
    id: int
    academic_year: str
    company: str
    students_placed: Optional[int] = None
    highest_package: Optional[float] = None
    average_package: Optional[float] = None
    role_offered: Optional[str] = None


class PlacementStats(BaseModel):
    academic_year: str
    highest_package: float
    average_package: float
    total_placed: int
    companies: int


class PlacementsResponse(BaseModel):
    stats: Optional[PlacementStats] = None
    records: List[PlacementOut]


class FaqOut(ORMModel):
    id: int
    category: str
    question: str
    answer: str


class TimetableOut(ORMModel):
    id: int
    class_name: str
    room: Optional[str] = None
    class_teacher: Optional[str] = None
    day_of_week: str
    periods: str
    faculty_notes: Optional[str] = None


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(min_length=1, max_length=40)
    session_id: Optional[str] = Field(default=None, max_length=64)
    stream: bool = True


class ChatResponse(BaseModel):
    answer: str
    session_id: str


class SelfIntroRequest(BaseModel):
    answers: dict[str, str] = Field(min_length=1)


class SelfIntroResponse(BaseModel):
    intro: str


class ErrorResponse(BaseModel):
    error: str
