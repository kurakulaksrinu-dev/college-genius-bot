-- ============================================================
-- VSM College AI Agent — PostgreSQL schema + seed data
-- Usage:  psql -U postgres -d vsm_college -f database/schema.sql
-- ============================================================

DROP TABLE IF EXISTS chat_history CASCADE;
DROP TABLE IF EXISTS timetables CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS placements CASCADE;
DROP TABLE IF EXISTS admissions CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS semester_subjects CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- ------------------------------------------------------------
-- departments
-- ------------------------------------------------------------
CREATE TABLE departments (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(16) NOT NULL UNIQUE,
    name        VARCHAR(120) NOT NULL,
    block       VARCHAR(60),
    hod         VARCHAR(120),
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- courses
-- ------------------------------------------------------------
CREATE TABLE courses (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(160) NOT NULL,
    level         VARCHAR(40)  NOT NULL,          -- intermediate | diploma | btech | mtech | mba
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    duration      VARCHAR(40),
    intake        INTEGER,
    description   TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (name, level)
);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_department ON courses(department_id);

-- ------------------------------------------------------------
-- students
-- ------------------------------------------------------------
CREATE TABLE students (
    id            SERIAL PRIMARY KEY,
    roll_number   VARCHAR(32) NOT NULL UNIQUE,
    full_name     VARCHAR(120) NOT NULL,
    email         VARCHAR(160) UNIQUE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    course_id     INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    year_of_study SMALLINT CHECK (year_of_study BETWEEN 1 AND 4),
    section       VARCHAR(16),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_students_department ON students(department_id);

-- ------------------------------------------------------------
-- semester_subjects
-- ------------------------------------------------------------
CREATE TABLE semester_subjects (
    id            SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    level         VARCHAR(40) NOT NULL DEFAULT 'btech',
    semester      SMALLINT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    subject_name  VARCHAR(160) NOT NULL,
    subject_code  VARCHAR(32),
    credits       SMALLINT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_subjects_dept_sem ON semester_subjects(department_id, semester);

-- ------------------------------------------------------------
-- facilities
-- ------------------------------------------------------------
CREATE TABLE facilities (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(160) NOT NULL,
    category    VARCHAR(60) NOT NULL,   -- labs | hostels | library | sports | canteen | it | transport | medical
    location    VARCHAR(160),
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_facilities_category ON facilities(category);

-- ------------------------------------------------------------
-- admissions
-- ------------------------------------------------------------
CREATE TABLE admissions (
    id             SERIAL PRIMARY KEY,
    program        VARCHAR(80) NOT NULL,
    eligibility    TEXT NOT NULL,
    entrance_exam  VARCHAR(80),
    process        TEXT,
    documents      TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_admissions_program ON admissions(program);

-- ------------------------------------------------------------
-- placements
-- ------------------------------------------------------------
CREATE TABLE placements (
    id               SERIAL PRIMARY KEY,
    academic_year    VARCHAR(16) NOT NULL,
    company          VARCHAR(120) NOT NULL,
    department_id    INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    students_placed  INTEGER DEFAULT 0,
    highest_package  NUMERIC(6,2),
    average_package  NUMERIC(6,2),
    role_offered     VARCHAR(120),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_placements_year ON placements(academic_year);

-- ------------------------------------------------------------
-- faqs  (full-text searchable knowledge used by the AI agent)
-- ------------------------------------------------------------
CREATE TABLE faqs (
    id         SERIAL PRIMARY KEY,
    category   VARCHAR(60) NOT NULL,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_faqs_search ON faqs
    USING GIN (to_tsvector('english', question || ' ' || answer));

-- ------------------------------------------------------------
-- timetables (III year class schedules)
-- ------------------------------------------------------------
CREATE TABLE timetables (
    id            SERIAL PRIMARY KEY,
    class_name    VARCHAR(60) NOT NULL,
    room          VARCHAR(20),
    class_teacher VARCHAR(120),
    day_of_week   VARCHAR(12) NOT NULL,
    periods       TEXT NOT NULL,       -- comma separated P1..P6
    faculty_notes TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (class_name, day_of_week)
);
CREATE INDEX idx_timetables_class ON timetables(class_name);

-- ------------------------------------------------------------
-- chat_history
-- ------------------------------------------------------------
CREATE TABLE chat_history (
    id         SERIAL PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_chat_history_session ON chat_history(session_id, created_at);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO departments (code, name, block, hod, description) VALUES
 ('CSE','Computer Science and Engineering','C-Block','Dr. Srinivas Rao','Core computing department covering programming, AI/ML, data science and full stack development.'),
 ('IT','Information Technology','C-Block','Mrs. Ch. Anuradha','Software systems, networks and enterprise application development.'),
 ('ECE','Electronics and Communication Engineering','B-Block','Dr. K. Ramesh','Electronics, embedded systems, VLSI and communication engineering.'),
 ('EEE','Electrical and Electronics Engineering','B-Block','Dr. P. Suresh','Power systems, electrical machines and control engineering.'),
 ('ME','Mechanical Engineering','D-Block','Dr. B. Prasad','Thermal, design and manufacturing engineering with workshop practice.'),
 ('CE','Civil Engineering','D-Block','Dr. M. Rao','Structural, geotechnical, transportation and environmental engineering.'),
 ('MBA','Master of Business Administration','A-Block','Dr. S. Lakshmi','Management education with Finance, Marketing and HR specializations.'),
 ('HBS','Humanities and Basic Sciences','A-Block','Dr. V. Padma','Mathematics, Physics, Chemistry and English for first year programs.');

INSERT INTO courses (name, level, department_id, duration, intake, description) VALUES
 ('Intermediate MPC','intermediate',(SELECT id FROM departments WHERE code='HBS'),'2 years',120,'Maths, Physics, Chemistry stream.'),
 ('Intermediate BiPC','intermediate',(SELECT id FROM departments WHERE code='HBS'),'2 years',60,'Biology, Physics, Chemistry stream.'),
 ('Intermediate CEC','intermediate',(SELECT id FROM departments WHERE code='HBS'),'2 years',60,'Civics, Economics, Commerce stream.'),
 ('Diploma in Computer Engineering','diploma',(SELECT id FROM departments WHERE code='CSE'),'3 years',60,'6 semester polytechnic diploma in computer engineering.'),
 ('Diploma in Electronics','diploma',(SELECT id FROM departments WHERE code='ECE'),'3 years',60,'6 semester polytechnic diploma in electronics.'),
 ('Diploma in Mechanical','diploma',(SELECT id FROM departments WHERE code='ME'),'3 years',60,'6 semester polytechnic diploma in mechanical engineering.'),
 ('Diploma in Civil','diploma',(SELECT id FROM departments WHERE code='CE'),'3 years',60,'6 semester polytechnic diploma in civil engineering.'),
 ('B.Tech Computer Science and Engineering','btech',(SELECT id FROM departments WHERE code='CSE'),'4 years',240,'8 semester undergraduate program, includes AI & ML and Data Science sections.'),
 ('B.Tech Information Technology','btech',(SELECT id FROM departments WHERE code='IT'),'4 years',60,'8 semester undergraduate program in information technology.'),
 ('B.Tech Electronics and Communication Engineering','btech',(SELECT id FROM departments WHERE code='ECE'),'4 years',120,'8 semester undergraduate program in ECE.'),
 ('B.Tech Electrical and Electronics Engineering','btech',(SELECT id FROM departments WHERE code='EEE'),'4 years',60,'8 semester undergraduate program in EEE.'),
 ('B.Tech Mechanical Engineering','btech',(SELECT id FROM departments WHERE code='ME'),'4 years',60,'8 semester undergraduate program in mechanical engineering.'),
 ('B.Tech Civil Engineering','btech',(SELECT id FROM departments WHERE code='CE'),'4 years',60,'8 semester undergraduate program in civil engineering.'),
 ('M.Tech Computer Science','mtech',(SELECT id FROM departments WHERE code='CSE'),'2 years',24,'Postgraduate specialization in computer science.'),
 ('M.Tech VLSI Design','mtech',(SELECT id FROM departments WHERE code='ECE'),'2 years',18,'Postgraduate specialization in VLSI design.'),
 ('M.Tech Structural Engineering','mtech',(SELECT id FROM departments WHERE code='CE'),'2 years',18,'Postgraduate specialization in structural engineering.'),
 ('MBA','mba',(SELECT id FROM departments WHERE code='MBA'),'2 years',60,'Finance, Marketing and HR specializations.');

INSERT INTO semester_subjects (department_id, level, semester, subject_name) VALUES
 ((SELECT id FROM departments WHERE code='CSE'),'btech',1,'Engineering Mathematics-I'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',1,'Engineering Physics'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',1,'Engineering Chemistry'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',1,'English'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',1,'Programming in C'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',1,'Engineering Drawing'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',2,'Engineering Mathematics-II'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',2,'Applied Physics'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',2,'Environmental Studies'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',2,'Data Structures'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',2,'Digital Logic Design'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',2,'Communication Skills'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',3,'Engineering Mathematics-III'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',3,'Discrete Mathematics'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',3,'Object Oriented Programming (Java)'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',3,'Computer Organization'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',3,'Database Management Systems'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',3,'Software Engineering'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',4,'Probability and Statistics'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',4,'Operating Systems'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',4,'Computer Networks'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',4,'Design and Analysis of Algorithms'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',4,'Microprocessors'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',4,'Web Technologies'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',5,'Compiler Design'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',5,'Theory of Computation'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',5,'Artificial Intelligence'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',5,'Information Security'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',5,'Mini Project'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',6,'Machine Learning'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',6,'Cloud Computing'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',6,'Mobile Application Development'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',6,'Industry Project'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',7,'Deep Learning'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',7,'Big Data Analytics'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',7,'Major Project Phase-I'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',7,'Seminar'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',8,'Major Project Phase-II'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',8,'Internship'),
 ((SELECT id FROM departments WHERE code='CSE'),'btech',8,'Comprehensive Viva');

INSERT INTO facilities (name, category, location, description) VALUES
 ('Computer Lab','labs','C-Block 2nd Floor','200+ systems with high speed internet.'),
 ('Physics Lab','labs','A-Block Ground Floor','Fully equipped physics laboratory for first year students.'),
 ('Chemistry Lab','labs','A-Block 1st Floor','Engineering chemistry laboratory.'),
 ('Electronics Lab','labs','B-Block 1st Floor','Analog, digital and communication electronics lab.'),
 ('Mechanical Workshop','labs','D-Block','Machine shop, welding, fitting and carpentry sections.'),
 ('Civil Lab','labs','D-Block 1st Floor','Concrete, surveying and geotechnical testing lab.'),
 ('Boys Hostel-1','hostels','Near D-Block','Capacity 300 students with mess facility.'),
 ('Boys Hostel-2','hostels','Behind campus','Capacity 200 students with AC rooms.'),
 ('Girls Hostel','hostels','Adjacent to campus','Capacity 250 students with 24/7 security.'),
 ('Central Library','library','A-Block Ground Floor','50,000+ books, journals and reference sections.'),
 ('Digital Library','library','A-Block','NPTEL, IEEE and Springer digital resources.'),
 ('Reading Hall','library','A-Block','200 seat air conditioned reading hall.'),
 ('Cricket Ground','sports','Campus grounds','Full size cricket ground with practice nets.'),
 ('Basketball and Volleyball Courts','sports','Campus grounds','Outdoor courts for inter-department tournaments.'),
 ('Indoor Games Room','sports','C-Block','Chess, carrom and table tennis.'),
 ('Gymnasium','sports','Campus','Fitness equipment for students and staff.'),
 ('Main Canteen','canteen','Near A-Block','Breakfast, lunch and snacks at subsidised rates.'),
 ('Cafeteria','canteen','C-Block Ground Floor','Beverages and quick bites.'),
 ('Hostel Mess','canteen','Hostel block','Vegetarian and non-vegetarian meals.'),
 ('Campus WiFi','it','Entire campus','High speed campus-wide wireless internet.'),
 ('Smart Classrooms','it','All blocks','Projector enabled digital classrooms.'),
 ('Server Room','it','C-Block','Central servers and networking infrastructure.'),
 ('College Buses','transport','Main gate','20+ bus routes covering nearby towns and villages.'),
 ('Parking','transport','Campus','Separate parking for two wheelers and four wheelers.'),
 ('Health Center','medical','Near Admin Block','Primary healthcare with visiting doctor.'),
 ('Ambulance','medical','Campus','24/7 emergency ambulance service.');

INSERT INTO admissions (program, eligibility, entrance_exam, process, documents) VALUES
 ('B.Tech','Pass in Intermediate (MPC) or equivalent with minimum 45% marks.','EAMCET','Admission through AP EAMCET counseling and management quota seats.','EAMCET rank card, Intermediate memo, TC, study certificates, Aadhaar, caste and income certificates, passport photos.'),
 ('B.Tech Lateral Entry','Diploma holders in a relevant branch.','ECET','Direct entry into second year through ECET counseling.','ECET rank card, diploma memos, TC, study certificates, Aadhaar.'),
 ('Intermediate','Pass in SSC / 10th class.','Merit based','Direct admission based on 10th class merit.','SSC memo, TC, study certificate, Aadhaar, photos.'),
 ('Diploma','Pass in SSC / 10th class.','POLYCET','Admission through POLYCET counseling or direct merit admission.','POLYCET rank card, SSC memo, TC, study certificate.'),
 ('M.Tech','B.Tech or equivalent in a relevant branch.','GATE / PGECET','Admission through GATE or AP PGECET counseling.','GATE/PGECET score card, degree memos, PC, TC, Aadhaar.'),
 ('MBA','Any graduation degree.','ICET','Admission through AP ICET counseling.','ICET rank card, degree memos, PC, TC, Aadhaar.');

INSERT INTO placements (academic_year, company, department_id, students_placed, highest_package, average_package, role_offered) VALUES
 ('2024','TCS',(SELECT id FROM departments WHERE code='CSE'),42,7.00,4.50,'Systems Engineer'),
 ('2024','Infosys',(SELECT id FROM departments WHERE code='CSE'),35,6.50,4.20,'Systems Engineer'),
 ('2024','Wipro',(SELECT id FROM departments WHERE code='IT'),28,5.50,3.80,'Project Engineer'),
 ('2024','HCL Technologies',(SELECT id FROM departments WHERE code='ECE'),22,5.00,3.60,'Graduate Engineer Trainee'),
 ('2024','Tech Mahindra',(SELECT id FROM departments WHERE code='IT'),18,5.50,4.00,'Associate Software Engineer'),
 ('2024','Cognizant',(SELECT id FROM departments WHERE code='CSE'),25,6.50,4.40,'Programmer Analyst'),
 ('2024','Accenture',(SELECT id FROM departments WHERE code='CSE'),20,6.50,4.50,'Application Development Analyst'),
 ('2024','Capgemini',(SELECT id FROM departments WHERE code='IT'),15,5.50,4.10,'Software Engineer'),
 ('2024','IBM',(SELECT id FROM departments WHERE code='CSE'),10,8.00,5.50,'Associate Engineer'),
 ('2024','Zoho',(SELECT id FROM departments WHERE code='CSE'),6,9.00,6.00,'Member Technical Staff'),
 ('2024','Deloitte',(SELECT id FROM departments WHERE code='MBA'),8,8.50,6.20,'Business Analyst'),
 ('2024','Amazon',(SELECT id FROM departments WHERE code='CSE'),3,12.00,12.00,'SDE-1'),
 ('2024','L&T Construction',(SELECT id FROM departments WHERE code='CE'),12,5.00,3.50,'Graduate Engineer Trainee'),
 ('2024','Ashok Leyland',(SELECT id FROM departments WHERE code='ME'),9,4.80,3.60,'Graduate Engineer Trainee');

INSERT INTO faqs (category, question, answer) VALUES
 ('about','What is VSM College of Engineering?','VSM College of Engineering is a premier engineering institution in Ramachandrapuram, East Godavari District, Andhra Pradesh, affiliated to JNTUK Kakinada and approved by AICTE, New Delhi. Official website: https://www.vsm.edu.in/Sites/vsmeng/'),
 ('about','Who founded VSM College and when?','VSM College was founded in 1966 by Late Sri Vundavalli Satyanarayana Murthy, a philanthropist popularly known as Rayavaram Munisiff Garu, with the dream of educating rural students. VSM College of Engineering was established in 2009 under the presidentship of Sri Sathya Narayan Rao M.V.V.'),
 ('about','What is the college motto?','The motto is "Vidya Vijayetetaram" — Education triumphs over everything else, taken from the Upanishads.'),
 ('about','Who is the Principal?','Dr. Srinivas Rao is the Principal of VSM College of Engineering. The President and Correspondent is Sri Sathya Narayan Rao M.V.V.'),
 ('about','Is the college accredited?','The U.G College is NAAC accredited and has acquired CPE status. The engineering college is affiliated to JNTUK and approved by AICTE.'),
 ('placements','What is the placement record?','In 2024 the highest package was Rs 12 LPA, the average package was Rs 4.5 LPA and the placement rate was 85%. More than 50 companies visit the campus.'),
 ('placements','What placement training is provided?','Aptitude training from second year, coding bootcamps, soft skills sessions, industry certifications (AWS, GCP, Azure) and mock interviews.'),
 ('academics','What are the period timings?','P1 9:30-10:30 AM, P2 10:30-11:30 AM, P3 11:30 AM-12:30 PM, Lunch 12:30-1:30 PM, P4 1:30-2:30 PM, P5 2:30-3:30 PM, P6 3:30-4:30 PM.'),
 ('academics','What do the timetable abbreviations mean?','CN = Computer Networks, SE = Software Engineering, ML = Machine Learning, OS = Operating Systems, DWDM = Data Warehousing & Data Mining, FLAT = Formal Languages & Automata Theory, ATCD = Automata Theory & Compiler Design, IRS = Information Retrieval Systems, ADJAVA = Advanced Java, FSD = Full Stack Development, EDVC = Entrepreneurship Development & Venture Creation, NPTEL = online course hour, INSTACK = skill/technology stack hour.'),
 ('campus','Which departments are in which block?','A-Block: admin offices, Physics Lab, Chemistry Lab and Central Library. B-Block: ECE and EEE with Electronics Lab. C-Block: CSE and IT with computer labs, cafeteria and server room. D-Block: Mechanical and Civil with workshop and civil lab. Admin Block: Principal office, examination cell and health center.');

INSERT INTO timetables (class_name, room, class_teacher, day_of_week, periods, faculty_notes) VALUES
 ('III CSE (DS)','112','Ms. G. Ramya','Monday','SE, ML, CN, EDVC, SEMINAR, NPTEL','Machine Learning – Mr. Krishna Kumar; Computer Networks – Ms. G. Ramya; Software Engineering – Mrs. T. Sravanthi; EDVC – Ms. S. Gayatri; Full Stack Development-1 – K. Nirmala; Flutter Lab – Mr. Appaji'),
 ('III CSE (DS)','112','Ms. G. Ramya','Tuesday','FSD-1 LAB, FSD-1 LAB, SE, CN, EDVC, INSTACK',NULL),
 ('III CSE (DS)','112','Ms. G. Ramya','Wednesday','CN, NPTEL, ML LAB, ML LAB, NPTEL, SPORTS',NULL),
 ('III CSE (DS)','112','Ms. G. Ramya','Thursday','ML, SE, FLUTTER LAB, FLUTTER LAB, CN, ML',NULL),
 ('III CSE (DS)','112','Ms. G. Ramya','Friday','INSTACK, EDVC, CN LAB, CN LAB, ML, SE',NULL),
 ('III CSE (DS)','112','Ms. G. Ramya','Saturday','EDVC, CN, INSTACK, SE, ML, LIBRARY',NULL),
 ('III IT','212','Mrs. Ch. Anuradha','Monday','EDVC, ADJAVA, INSTACK, LIBRARY, CN, NPTEL','Advanced Java – Mr. G. Kiran Kumar; Computer Networks – Mrs. Ch. Anuradha; ATCD – Ms. Sravani; EDVC – Mrs. K. Srivalli; FSD-1 – K. Nirmala; Flutter – Ms. K. Mehgana'),
 ('III IT','212','Mrs. Ch. Anuradha','Tuesday','CN, NPTEL, EDVC, CN, ADJAVA, INSTACK',NULL),
 ('III IT','212','Mrs. Ch. Anuradha','Wednesday','CN LAB, CN LAB, EDVC, ADJAVA, ATCD, SPORTS',NULL),
 ('III IT','212','Mrs. Ch. Anuradha','Thursday','ATCD, SEMINAR, CN, EDVC, ATCD, ADJAVA',NULL),
 ('III IT','212','Mrs. Ch. Anuradha','Friday','ADJAVA, CN, FSD-1 LAB, FSD-1 LAB, NPTEL, ATCD',NULL),
 ('III IT','212','Mrs. Ch. Anuradha','Saturday','ADV JAVA LAB, ADV JAVA LAB, FLUTTER LAB, FLUTTER LAB, INSTACK, ATCD',NULL),
 ('III CSE (AI & ML)','225','Mrs. T. Sravanthi','Monday','IRS LAB, IRS LAB, FLUTTER LAB, FLUTTER LAB, CN, IRS','IRS – Mr. Pothula Nani Babu; CN – Ms. D. Naga Jyothi; OS – Mrs. V. Divya; SE – Mrs. T. Sravanthi; EDVC – Ms. S. Gayatri; FSD-2 – Mr. Pothula Nani Babu; Flutter – Mr. Appaji'),
 ('III CSE (AI & ML)','225','Mrs. T. Sravanthi','Tuesday','SE, OS, EDVC, IRS, SE, CN',NULL),
 ('III CSE (AI & ML)','225','Mrs. T. Sravanthi','Wednesday','CN, SE, FSD-2 LAB, FSD-2 LAB, OS, SPORTS',NULL),
 ('III CSE (AI & ML)','225','Mrs. T. Sravanthi','Thursday','OS, EDVC, INSTACK, SE, IRS, LIBRARY',NULL),
 ('III CSE (AI & ML)','225','Mrs. T. Sravanthi','Friday','CN, OS, IRS, EDVC, SE, INSTACK',NULL),
 ('III CSE (AI & ML)','225','Mrs. T. Sravanthi','Saturday','OS, EDVC, CN, IRS, CN LAB, CN LAB',NULL),
 ('III CSE - A','301','Ms. D. Naga Jyothi','Monday','DWDM, CN, DWDM LAB, DWDM LAB, EDVC, INSTACK','DWDM – Mrs. N. Jyothsna; CN – Ms. D. Naga Jyothi; FLAT – Ms. Sravani; EDVC – Mr. K. Rajeev; FSD-2 – Ms. Sowmya; Flutter – Mr. K Sateesh Kumar'),
 ('III CSE - A','301','Ms. D. Naga Jyothi','Tuesday','EDVC, INSTACK, FLAT, CN, NPTEL, DWDM',NULL),
 ('III CSE - A','301','Ms. D. Naga Jyothi','Wednesday','FSD-2 LAB, FSD-2 LAB, CN, FLAT, DWDM, SPORTS',NULL),
 ('III CSE - A','301','Ms. D. Naga Jyothi','Thursday','DWDM, FLAT, CN, LIBRARY, NPTEL, EDVC',NULL),
 ('III CSE - A','301','Ms. D. Naga Jyothi','Friday','FLUTTER LAB, FLUTTER LAB, FLAT, DWDM, CN, SEMINAR',NULL),
 ('III CSE - A','301','Ms. D. Naga Jyothi','Saturday','CN LAB, CN LAB, INSTACK, NPTEL, FLAT, EDVC',NULL),
 ('III CSE - B','302','Ms. A. Sravani','Monday','CN, EDVC, DWDM, FLAT, FSD-2 LAB, FSD-2 LAB','DWDM – Ms. N. Lalitha; CN – Ms. D. Naga Jyothi; FLAT – Ms. A. Sravani; EDVC – Mr. K. Rajeev; FSD-2 – Ms. Sowmya; Flutter – Mr. K Sateesh Kumar'),
 ('III CSE - B','302','Ms. A. Sravani','Tuesday','DWDM, NPTEL, CN, EDVC, FLAT, INSTACK',NULL),
 ('III CSE - B','302','Ms. A. Sravani','Wednesday','DWDM, EDVC, FLAT, CN, NPTEL, SPORTS',NULL),
 ('III CSE - B','302','Ms. A. Sravani','Thursday','CN, NPTEL, DWDM, INSTACK, CN LAB, CN LAB',NULL),
 ('III CSE - B','302','Ms. A. Sravani','Friday','DWDM LAB, DWDM LAB, CN, FLAT, LIBRARY, EDVC',NULL),
 ('III CSE - B','302','Ms. A. Sravani','Saturday','FLAT, DWDM, Free, SEMINAR, FLUTTER LAB, FLUTTER LAB',NULL),
 ('III CSE - C','303','Mr. S. Siva Krishna','Monday','FLAT, EDVC, NPTEL, CN, DWDM LAB, DWDM LAB','DWDM – Mrs. N. Jyothsna; CN – Mr. Siva Krishna; FLAT – Mrs. Prasanna Rani; EDVC – Ms. N. Gowthami; FSD-2 – Ms. Sowmya; Flutter – Mr. K Sateesh Kumar'),
 ('III CSE - C','303','Mr. S. Siva Krishna','Tuesday','DWDM, CN, FLAT, NPTEL, CN LAB, CN LAB',NULL),
 ('III CSE - C','303','Mr. S. Siva Krishna','Wednesday','EDVC, DWDM, CN, INSTACK, FSD-2 LAB, FSD-2 LAB',NULL),
 ('III CSE - C','303','Mr. S. Siva Krishna','Thursday','FLAT, CN, EDVC, NPTEL, DWDM, INSTACK',NULL),
 ('III CSE - C','303','Mr. S. Siva Krishna','Friday','FLAT, DWDM, Free, LIBRARY, FLUTTER LAB, FLUTTER LAB',NULL),
 ('III CSE - C','303','Mr. S. Siva Krishna','Saturday','INSTACK, FLAT, DWDM, EDVC, CN, SPORTS',NULL),
 ('III CSE - D','309','Mrs. N. Jyothsna','Monday','CN LAB, CN LAB, FLAT, EDVC, NPTEL, CN','DWDM – Mrs. N. Jyothsna; CN – Mr. Siva Krishna; FLAT – Mrs. Prasanna Rani; EDVC – Ms. N. Gowthami; FSD-2 – Ms. N. Lalitha; Flutter – Mr. Appaji'),
 ('III CSE - D','309','Mrs. N. Jyothsna','Tuesday','FLAT, INSTACK, DWDM LAB, DWDM LAB, FLUTTER LAB, FLUTTER LAB',NULL),
 ('III CSE - D','309','Mrs. N. Jyothsna','Wednesday','CN, FLAT, NPTEL, CN, EDVC, DWDM',NULL),
 ('III CSE - D','309','Mrs. N. Jyothsna','Thursday','FSD-2 LAB, FSD-2 LAB, DWDM, EDVC, CN, NPTEL',NULL),
 ('III CSE - D','309','Mrs. N. Jyothsna','Friday','INSTACK, FLAT, CN, DWDM, SEMINAR, EDVC',NULL),
 ('III CSE - D','309','Mrs. N. Jyothsna','Saturday','DWDM, INSTACK, FLAT, DWDM, LIBRARY, SPORTS',NULL);

INSERT INTO students (roll_number, full_name, email, department_id, course_id, year_of_study, section) VALUES
 ('21VSM1A0501','Ravi Kumar','ravi.kumar@vsm.edu.in',(SELECT id FROM departments WHERE code='CSE'),(SELECT id FROM courses WHERE name='B.Tech Computer Science and Engineering'),3,'A'),
 ('21VSM1A0502','Sneha Reddy','sneha.reddy@vsm.edu.in',(SELECT id FROM departments WHERE code='CSE'),(SELECT id FROM courses WHERE name='B.Tech Computer Science and Engineering'),3,'B'),
 ('21VSM1A1201','Anil Varma','anil.varma@vsm.edu.in',(SELECT id FROM departments WHERE code='IT'),(SELECT id FROM courses WHERE name='B.Tech Information Technology'),3,'IT');
