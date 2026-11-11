package com.smartcampus.config;

import com.smartcampus.model.*;
import com.smartcampus.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final TimetableRepository timetableRepository;
    private final AttendanceRepository attendanceRepository;
    private final FacultyAttendanceRepository facultyAttendanceRepository;
    private final FeeRepository feeRepository;
    private final NoticeRepository noticeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           FacultyRepository facultyRepository,
                           CourseRepository courseRepository,
                           TimetableRepository timetableRepository,
                           AttendanceRepository attendanceRepository,
                           FacultyAttendanceRepository facultyAttendanceRepository,
                           FeeRepository feeRepository,
                           NoticeRepository noticeRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.courseRepository = courseRepository;
        this.timetableRepository = timetableRepository;
        this.attendanceRepository = attendanceRepository;
        this.facultyAttendanceRepository = facultyAttendanceRepository;
        this.feeRepository = feeRepository;
        this.noticeRepository = noticeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data setup.");
            return;
        }

        log.info("Seeding initial data for Smart Campus Management System...");

        // ══════════════════════════════════════════════
        // 1. ADMIN
        // ══════════════════════════════════════════════
        User adminUser = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("Admin@123"))
                .email("admin@campus.edu")
                .fullName("System Administrator")
                .phone("+91 98110-01100")
                .role(Role.ROLE_ADMIN)
                .build();
        userRepository.save(adminUser);

        // ══════════════════════════════════════════════
        // 2. FACULTY — 4 Departments
        // ══════════════════════════════════════════════

        // --- CS Faculty ---
        User fu1 = User.builder().username("dr_smith").password(passwordEncoder.encode("Faculty@123"))
                .email("smith@campus.edu").fullName("Dr. Alan Smith")
                .phone("+91 98110-01101").role(Role.ROLE_FACULTY).build();
        userRepository.save(fu1);
        Faculty faculty1 = Faculty.builder().user(fu1).employeeId("FAC-1001")
                .department("Computer Science").designation("Professor & Head of Dept")
                .qualification("Ph.D in Distributed Systems")
                .joiningDate(LocalDate.of(2018, 7, 1))
                .specialization("Cloud Computing & AI").build();
        facultyRepository.save(faculty1);

        User fu2 = User.builder().username("prof_sarah").password(passwordEncoder.encode("Faculty@123"))
                .email("sarah@campus.edu").fullName("Prof. Sarah Johnson")
                .phone("+91 98110-01102").role(Role.ROLE_FACULTY).build();
        userRepository.save(fu2);
        Faculty faculty2 = Faculty.builder().user(fu2).employeeId("FAC-1002")
                .department("Computer Science").designation("Associate Professor")
                .qualification("M.Tech, Ph.D Candidate")
                .joiningDate(LocalDate.of(2020, 1, 15))
                .specialization("Database Systems & Web Security").build();
        facultyRepository.save(faculty2);

        // --- IT Faculty ---
        User fu3 = User.builder().username("dr_mehra").password(passwordEncoder.encode("Faculty@123"))
                .email("mehra@campus.edu").fullName("Dr. Rahul Mehra")
                .phone("+91 98110-01103").role(Role.ROLE_FACULTY).build();
        userRepository.save(fu3);
        Faculty faculty3 = Faculty.builder().user(fu3).employeeId("FAC-1003")
                .department("Information Technology").designation("Professor & Head of IT")
                .qualification("Ph.D in Network Security")
                .joiningDate(LocalDate.of(2017, 6, 1))
                .specialization("Cyber Security & IoT").build();
        facultyRepository.save(faculty3);

        // --- ECE Faculty ---
        User fu4 = User.builder().username("prof_gupta").password(passwordEncoder.encode("Faculty@123"))
                .email("gupta@campus.edu").fullName("Prof. Neha Gupta")
                .phone("+91 98110-01104").role(Role.ROLE_FACULTY).build();
        userRepository.save(fu4);
        Faculty faculty4 = Faculty.builder().user(fu4).employeeId("FAC-1004")
                .department("Electronics & Communication").designation("Associate Professor")
                .qualification("M.Tech in VLSI Design")
                .joiningDate(LocalDate.of(2019, 8, 1))
                .specialization("Embedded Systems & Signal Processing").build();
        facultyRepository.save(faculty4);

        // --- Mechanical Faculty ---
        User fu5 = User.builder().username("dr_verma").password(passwordEncoder.encode("Faculty@123"))
                .email("verma@campus.edu").fullName("Dr. Suresh Verma")
                .phone("+91 98110-01105").role(Role.ROLE_FACULTY).build();
        userRepository.save(fu5);
        Faculty faculty5 = Faculty.builder().user(fu5).employeeId("FAC-1005")
                .department("Mechanical Engineering").designation("Professor")
                .qualification("Ph.D in Thermal Engineering")
                .joiningDate(LocalDate.of(2016, 3, 1))
                .specialization("Thermodynamics & Fluid Mechanics").build();
        facultyRepository.save(faculty5);

        // ══════════════════════════════════════════════
        // 3. STUDENTS — 4 Departments × 2 Sections (A & B)
        // ══════════════════════════════════════════════

        // ── CS Section A ──
        User su1 = User.builder().username("alex_student").password(passwordEncoder.encode("Student@123"))
                .email("alex@student.campus.edu").fullName("Alex Rivera")
                .phone("+91 98220-02201").role(Role.ROLE_STUDENT).build();
        userRepository.save(su1);
        Student student1 = Student.builder().user(su1).enrollmentNo("STU-2024-001")
                .department("Computer Science").semester(3).section("A")
                .dateOfBirth(LocalDate.of(2003, 5, 14)).address("104 Campus Blvd, Tech City")
                .guardianName("Marco Rivera").guardianPhone("+91 98330-03301").build();
        studentRepository.save(student1);

        User su2 = User.builder().username("priya_student").password(passwordEncoder.encode("Student@123"))
                .email("priya@student.campus.edu").fullName("Priya Sharma")
                .phone("+91 98220-02202").role(Role.ROLE_STUDENT).build();
        userRepository.save(su2);
        Student student2 = Student.builder().user(su2).enrollmentNo("STU-2024-002")
                .department("Computer Science").semester(3).section("A")
                .dateOfBirth(LocalDate.of(2003, 9, 22)).address("220 Lakeview Ave, Tech City")
                .guardianName("Rajesh Sharma").guardianPhone("+91 98330-03302").build();
        studentRepository.save(student2);

        // ── CS Section B ──
        User su3 = User.builder().username("rohan_cs").password(passwordEncoder.encode("Student@123"))
                .email("rohan@student.campus.edu").fullName("Rohan Kapoor")
                .phone("+91 98220-02203").role(Role.ROLE_STUDENT).build();
        userRepository.save(su3);
        Student student3 = Student.builder().user(su3).enrollmentNo("STU-2024-003")
                .department("Computer Science").semester(3).section("B")
                .dateOfBirth(LocalDate.of(2003, 1, 10)).address("15 MG Road, Tech City")
                .guardianName("Anil Kapoor").guardianPhone("+91 98330-03303").build();
        studentRepository.save(student3);

        User su4 = User.builder().username("sneha_cs").password(passwordEncoder.encode("Student@123"))
                .email("sneha@student.campus.edu").fullName("Sneha Patel")
                .phone("+91 98220-02204").role(Role.ROLE_STUDENT).build();
        userRepository.save(su4);
        Student student4 = Student.builder().user(su4).enrollmentNo("STU-2024-004")
                .department("Computer Science").semester(3).section("B")
                .dateOfBirth(LocalDate.of(2003, 7, 30)).address("88 Silicon Street, Tech City")
                .guardianName("Dinesh Patel").guardianPhone("+91 98330-03304").build();
        studentRepository.save(student4);

        // ── IT Section A ──
        User su5 = User.builder().username("arjun_it").password(passwordEncoder.encode("Student@123"))
                .email("arjun@student.campus.edu").fullName("Arjun Nair")
                .phone("+91 98220-02205").role(Role.ROLE_STUDENT).build();
        userRepository.save(su5);
        Student student5 = Student.builder().user(su5).enrollmentNo("STU-2024-005")
                .department("Information Technology").semester(3).section("A")
                .dateOfBirth(LocalDate.of(2003, 3, 18)).address("42 Cyber Park, Bangalore")
                .guardianName("Ravi Nair").guardianPhone("+91 98330-03305").build();
        studentRepository.save(student5);

        User su6 = User.builder().username("kavya_it").password(passwordEncoder.encode("Student@123"))
                .email("kavya@student.campus.edu").fullName("Kavya Reddy")
                .phone("+91 98220-02206").role(Role.ROLE_STUDENT).build();
        userRepository.save(su6);
        Student student6 = Student.builder().user(su6).enrollmentNo("STU-2024-006")
                .department("Information Technology").semester(3).section("A")
                .dateOfBirth(LocalDate.of(2003, 11, 5)).address("77 Network Lane, Hyderabad")
                .guardianName("Suresh Reddy").guardianPhone("+91 98330-03306").build();
        studentRepository.save(student6);

        // ── IT Section B ──
        User su7 = User.builder().username("manish_it").password(passwordEncoder.encode("Student@123"))
                .email("manish@student.campus.edu").fullName("Manish Joshi")
                .phone("+91 98220-02207").role(Role.ROLE_STUDENT).build();
        userRepository.save(su7);
        Student student7 = Student.builder().user(su7).enrollmentNo("STU-2024-007")
                .department("Information Technology").semester(3).section("B")
                .dateOfBirth(LocalDate.of(2003, 6, 25)).address("33 Infra Nagar, Pune")
                .guardianName("Vijay Joshi").guardianPhone("+91 98330-03307").build();
        studentRepository.save(student7);

        // ── ECE Section A ──
        User su8 = User.builder().username("deepak_ece").password(passwordEncoder.encode("Student@123"))
                .email("deepak@student.campus.edu").fullName("Deepak Singh")
                .phone("+91 98220-02208").role(Role.ROLE_STUDENT).build();
        userRepository.save(su8);
        Student student8 = Student.builder().user(su8).enrollmentNo("STU-2024-008")
                .department("Electronics & Communication").semester(3).section("A")
                .dateOfBirth(LocalDate.of(2003, 4, 12)).address("5 Circuit Road, Chennai")
                .guardianName("Baldev Singh").guardianPhone("+91 98330-03308").build();
        studentRepository.save(student8);

        User su9 = User.builder().username("anjali_ece").password(passwordEncoder.encode("Student@123"))
                .email("anjali@student.campus.edu").fullName("Anjali Mishra")
                .phone("+91 98220-02209").role(Role.ROLE_STUDENT).build();
        userRepository.save(su9);
        Student student9 = Student.builder().user(su9).enrollmentNo("STU-2024-009")
                .department("Electronics & Communication").semester(3).section("A")
                .dateOfBirth(LocalDate.of(2003, 8, 20)).address("12 Spectrum Lane, Delhi")
                .guardianName("Rakesh Mishra").guardianPhone("+91 98330-03309").build();
        studentRepository.save(student9);

        // ── ECE Section B ──
        User su10 = User.builder().username("vikram_ece").password(passwordEncoder.encode("Student@123"))
                .email("vikram@student.campus.edu").fullName("Vikram Rao")
                .phone("+91 98220-02210").role(Role.ROLE_STUDENT).build();
        userRepository.save(su10);
        Student student10 = Student.builder().user(su10).enrollmentNo("STU-2024-010")
                .department("Electronics & Communication").semester(3).section("B")
                .dateOfBirth(LocalDate.of(2003, 2, 14)).address("99 Signal Street, Mysore")
                .guardianName("Hari Rao").guardianPhone("+91 98330-03310").build();
        studentRepository.save(student10);

        // ── Mechanical Section A ──
        User su11 = User.builder().username("ravi_mech").password(passwordEncoder.encode("Student@123"))
                .email("ravi@student.campus.edu").fullName("Ravi Kumar")
                .phone("+91 98220-02211").role(Role.ROLE_STUDENT).build();
        userRepository.save(su11);
        Student student11 = Student.builder().user(su11).enrollmentNo("STU-2024-011")
                .department("Mechanical Engineering").semester(3).section("A")
                .dateOfBirth(LocalDate.of(2003, 10, 3)).address("7 Factory Road, Nashik")
                .guardianName("Suresh Kumar").guardianPhone("+91 98330-03311").build();
        studentRepository.save(student11);

        User su12 = User.builder().username("pooja_mech").password(passwordEncoder.encode("Student@123"))
                .email("pooja@student.campus.edu").fullName("Pooja Desai")
                .phone("+91 98220-02212").role(Role.ROLE_STUDENT).build();
        userRepository.save(su12);
        Student student12 = Student.builder().user(su12).enrollmentNo("STU-2024-012")
                .department("Mechanical Engineering").semester(3).section("A")
                .dateOfBirth(LocalDate.of(2003, 12, 8)).address("22 Workshop Lane, Surat")
                .guardianName("Mahesh Desai").guardianPhone("+91 98330-03312").build();
        studentRepository.save(student12);

        // ── Mechanical Section B ──
        User su13 = User.builder().username("kiran_mech").password(passwordEncoder.encode("Student@123"))
                .email("kiran@student.campus.edu").fullName("Kiran Patil")
                .phone("+91 98220-02213").role(Role.ROLE_STUDENT).build();
        userRepository.save(su13);
        Student student13 = Student.builder().user(su13).enrollmentNo("STU-2024-013")
                .department("Mechanical Engineering").semester(3).section("B")
                .dateOfBirth(LocalDate.of(2003, 5, 27)).address("11 Gear Nagar, Kolhapur")
                .guardianName("Babu Patil").guardianPhone("+91 98330-03313").build();
        studentRepository.save(student13);

        // ══════════════════════════════════════════════
        // 4. COURSES — All 4 Departments
        // ══════════════════════════════════════════════

        // CS Courses
        Course cs1 = Course.builder().courseCode("CS301").courseName("Data Structures & Algorithms")
                .department("Computer Science").credits(4).semester(3)
                .description("Advanced study of trees, graphs, sorting, searching, and algorithmic complexity.").build();
        courseRepository.save(cs1);

        Course cs2 = Course.builder().courseCode("CS302").courseName("Database Management Systems")
                .department("Computer Science").credits(4).semester(3)
                .description("Relational modeling, SQL, normalization, transaction management, indexing, and NoSQL.").build();
        courseRepository.save(cs2);

        Course cs3 = Course.builder().courseCode("CS303").courseName("Operating Systems")
                .department("Computer Science").credits(3).semester(3)
                .description("Processes, threads, CPU scheduling, memory virtualization, synchronization, file systems.").build();
        courseRepository.save(cs3);

        Course cs4 = Course.builder().courseCode("CS304").courseName("Full Stack Web Development")
                .department("Computer Science").credits(3).semester(3)
                .description("Modern enterprise architectures using React, Spring Boot, REST APIs, and microservices.").build();
        courseRepository.save(cs4);

        // IT Courses
        Course it1 = Course.builder().courseCode("IT301").courseName("Network Security & Cryptography")
                .department("Information Technology").credits(4).semester(3)
                .description("Firewalls, VPNs, encryption algorithms, SSL/TLS, intrusion detection systems.").build();
        courseRepository.save(it1);

        Course it2 = Course.builder().courseCode("IT302").courseName("Cloud Computing & IoT")
                .department("Information Technology").credits(3).semester(3)
                .description("AWS, Azure, GCP fundamentals, IoT protocols, edge computing, smart systems.").build();
        courseRepository.save(it2);

        // ECE Courses
        Course ece1 = Course.builder().courseCode("ECE301").courseName("Digital Signal Processing")
                .department("Electronics & Communication").credits(4).semester(3)
                .description("Z-transforms, DFT, FFT, FIR/IIR filters, signal analysis and applications.").build();
        courseRepository.save(ece1);

        Course ece2 = Course.builder().courseCode("ECE302").courseName("VLSI Design & Embedded Systems")
                .department("Electronics & Communication").credits(3).semester(3)
                .description("CMOS circuits, FPGA, Arduino, Raspberry Pi, real-time embedded programming.").build();
        courseRepository.save(ece2);

        // Mechanical Courses
        Course me1 = Course.builder().courseCode("ME301").courseName("Thermodynamics & Heat Transfer")
                .department("Mechanical Engineering").credits(4).semester(3)
                .description("Laws of thermodynamics, heat engines, conduction, convection, radiation analysis.").build();
        courseRepository.save(me1);

        Course me2 = Course.builder().courseCode("ME302").courseName("Fluid Mechanics & Machinery")
                .department("Mechanical Engineering").credits(3).semester(3)
                .description("Bernoulli equation, pipe flow, pumps, turbines, compressors and fluid dynamics.").build();
        courseRepository.save(me2);

        // ══════════════════════════════════════════════
        // 5. TIMETABLE
        // ══════════════════════════════════════════════
        timetableRepository.save(Timetable.builder().course(cs1).faculty(faculty1)
                .dayOfWeek(Timetable.DayOfWeek.MONDAY).startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(10, 30))
                .roomNo("Hall 201").department("Computer Science").semester(3).build());

        timetableRepository.save(Timetable.builder().course(cs2).faculty(faculty2)
                .dayOfWeek(Timetable.DayOfWeek.MONDAY).startTime(LocalTime.of(11, 0)).endTime(LocalTime.of(12, 30))
                .roomNo("Lab 3").department("Computer Science").semester(3).build());

        timetableRepository.save(Timetable.builder().course(cs4).faculty(faculty2)
                .dayOfWeek(Timetable.DayOfWeek.TUESDAY).startTime(LocalTime.of(10, 0)).endTime(LocalTime.of(11, 30))
                .roomNo("Tech Lab 1").department("Computer Science").semester(3).build());

        timetableRepository.save(Timetable.builder().course(it1).faculty(faculty3)
                .dayOfWeek(Timetable.DayOfWeek.WEDNESDAY).startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(10, 30))
                .roomNo("IT Lab 1").department("Information Technology").semester(3).build());

        timetableRepository.save(Timetable.builder().course(it2).faculty(faculty3)
                .dayOfWeek(Timetable.DayOfWeek.THURSDAY).startTime(LocalTime.of(11, 0)).endTime(LocalTime.of(12, 30))
                .roomNo("Cloud Lab").department("Information Technology").semester(3).build());

        timetableRepository.save(Timetable.builder().course(ece1).faculty(faculty4)
                .dayOfWeek(Timetable.DayOfWeek.MONDAY).startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(10, 30))
                .roomNo("ECE Hall A").department("Electronics & Communication").semester(3).build());

        timetableRepository.save(Timetable.builder().course(ece2).faculty(faculty4)
                .dayOfWeek(Timetable.DayOfWeek.WEDNESDAY).startTime(LocalTime.of(11, 0)).endTime(LocalTime.of(12, 30))
                .roomNo("Electronics Lab").department("Electronics & Communication").semester(3).build());

        timetableRepository.save(Timetable.builder().course(me1).faculty(faculty5)
                .dayOfWeek(Timetable.DayOfWeek.TUESDAY).startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(10, 30))
                .roomNo("Mech Hall 1").department("Mechanical Engineering").semester(3).build());

        timetableRepository.save(Timetable.builder().course(me2).faculty(faculty5)
                .dayOfWeek(Timetable.DayOfWeek.FRIDAY).startTime(LocalTime.of(11, 0)).endTime(LocalTime.of(12, 30))
                .roomNo("Fluid Lab").department("Mechanical Engineering").semester(3).build());

        // ══════════════════════════════════════════════
        // 6. STUDENT ATTENDANCE RECORDS
        // ══════════════════════════════════════════════
        // CS students
        attendanceRepository.save(Attendance.builder().student(student1).course(cs1)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.PRESENT).remarks("Active participant").build());
        attendanceRepository.save(Attendance.builder().student(student1).course(cs2)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.PRESENT).remarks("Completed lab assignment").build());
        attendanceRepository.save(Attendance.builder().student(student2).course(cs1)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.ABSENT).remarks("Medical leave").build());
        attendanceRepository.save(Attendance.builder().student(student2).course(cs2)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.PRESENT).remarks("On time").build());
        attendanceRepository.save(Attendance.builder().student(student3).course(cs3)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.PRESENT).remarks("Section B").build());
        attendanceRepository.save(Attendance.builder().student(student4).course(cs4)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.LATE).remarks("Late by 10 mins").build());

        // IT students
        attendanceRepository.save(Attendance.builder().student(student5).course(it1)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.PRESENT).remarks("IT Sec A").build());
        attendanceRepository.save(Attendance.builder().student(student6).course(it2)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.PRESENT).remarks("Cloud lab done").build());
        attendanceRepository.save(Attendance.builder().student(student7).course(it1)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.ABSENT).remarks("IT Sec B absent").build());

        // ECE students
        attendanceRepository.save(Attendance.builder().student(student8).course(ece1)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.PRESENT).remarks("DSP lab").build());
        attendanceRepository.save(Attendance.builder().student(student9).course(ece2)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.PRESENT).remarks("VLSI project").build());
        attendanceRepository.save(Attendance.builder().student(student10).course(ece1)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.LATE).remarks("ECE Sec B late").build());

        // Mechanical students
        attendanceRepository.save(Attendance.builder().student(student11).course(me1)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.PRESENT).remarks("Thermo lab").build());
        attendanceRepository.save(Attendance.builder().student(student12).course(me2)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.ABSENT).remarks("Sick leave").build());
        attendanceRepository.save(Attendance.builder().student(student13).course(me1)
                .date(LocalDate.now().minusDays(1)).status(Attendance.AttendanceStatus.PRESENT).remarks("Mech Sec B").build());

        // ══════════════════════════════════════════════
        // 7. FACULTY ATTENDANCE RECORDS
        // ══════════════════════════════════════════════
        facultyAttendanceRepository.save(FacultyAttendance.builder().faculty(faculty1)
                .date(LocalDate.now()).status(FacultyAttendance.FacultyAttendanceStatus.PRESENT)
                .checkInTime(LocalTime.of(8, 45)).remarks("On-duty Hall 201").build());

        facultyAttendanceRepository.save(FacultyAttendance.builder().faculty(faculty2)
                .date(LocalDate.now()).status(FacultyAttendance.FacultyAttendanceStatus.PRESENT)
                .checkInTime(LocalTime.of(9, 10)).remarks("Lab In-Charge").build());

        facultyAttendanceRepository.save(FacultyAttendance.builder().faculty(faculty3)
                .date(LocalDate.now()).status(FacultyAttendance.FacultyAttendanceStatus.PRESENT)
                .checkInTime(LocalTime.of(8, 55)).remarks("IT Department").build());

        facultyAttendanceRepository.save(FacultyAttendance.builder().faculty(faculty4)
                .date(LocalDate.now()).status(FacultyAttendance.FacultyAttendanceStatus.ON_LEAVE)
                .checkInTime(null).remarks("Approved medical leave").build());

        facultyAttendanceRepository.save(FacultyAttendance.builder().faculty(faculty5)
                .date(LocalDate.now()).status(FacultyAttendance.FacultyAttendanceStatus.PRESENT)
                .checkInTime(LocalTime.of(9, 0)).remarks("Mech Dept, on duty").build());

        // Previous day records for faculty
        facultyAttendanceRepository.save(FacultyAttendance.builder().faculty(faculty1)
                .date(LocalDate.now().minusDays(1)).status(FacultyAttendance.FacultyAttendanceStatus.PRESENT)
                .checkInTime(LocalTime.of(8, 50)).remarks("Monday lectures").build());

        facultyAttendanceRepository.save(FacultyAttendance.builder().faculty(faculty2)
                .date(LocalDate.now().minusDays(1)).status(FacultyAttendance.FacultyAttendanceStatus.PRESENT)
                .checkInTime(LocalTime.of(9, 5)).remarks("DB lab session").build());

        facultyAttendanceRepository.save(FacultyAttendance.builder().faculty(faculty3)
                .date(LocalDate.now().minusDays(1)).status(FacultyAttendance.FacultyAttendanceStatus.HALF_DAY)
                .checkInTime(LocalTime.of(9, 0)).remarks("Left early - personal reason").build());

        facultyAttendanceRepository.save(FacultyAttendance.builder().faculty(faculty4)
                .date(LocalDate.now().minusDays(1)).status(FacultyAttendance.FacultyAttendanceStatus.PRESENT)
                .checkInTime(LocalTime.of(8, 40)).remarks("ECE Hall A").build());

        facultyAttendanceRepository.save(FacultyAttendance.builder().faculty(faculty5)
                .date(LocalDate.now().minusDays(1)).status(FacultyAttendance.FacultyAttendanceStatus.PRESENT)
                .checkInTime(LocalTime.of(8, 58)).remarks("Fluid lab").build());

        // ══════════════════════════════════════════════
        // 8. FEES (Rupees ₹)
        // ══════════════════════════════════════════════
        feeRepository.save(Fee.builder().student(student1).feeType(Fee.FeeType.TUITION)
                .amount(new BigDecimal("45000.00")).paidAmount(new BigDecimal("45000.00"))
                .dueDate(LocalDate.now().plusMonths(1)).paymentStatus(Fee.PaymentStatus.PAID)
                .transactionId("TXN-90218492").paymentDate(LocalDateTime.now().minusDays(5))
                .remarks("CS Sem 3 Tuition Fee").build());

        feeRepository.save(Fee.builder().student(student1).feeType(Fee.FeeType.EXAM)
                .amount(new BigDecimal("3500.00")).paidAmount(new BigDecimal("0.00"))
                .dueDate(LocalDate.now().plusWeeks(2)).paymentStatus(Fee.PaymentStatus.PENDING)
                .remarks("Mid-term Examination Fee").build());

        feeRepository.save(Fee.builder().student(student2).feeType(Fee.FeeType.TUITION)
                .amount(new BigDecimal("45000.00")).paidAmount(new BigDecimal("22500.00"))
                .dueDate(LocalDate.now().plusDays(10)).paymentStatus(Fee.PaymentStatus.PARTIAL)
                .transactionId("TXN-38194022").paymentDate(LocalDateTime.now().minusDays(10))
                .remarks("1st Installment Received").build());

        feeRepository.save(Fee.builder().student(student5).feeType(Fee.FeeType.TUITION)
                .amount(new BigDecimal("42000.00")).paidAmount(new BigDecimal("42000.00"))
                .dueDate(LocalDate.now().plusMonths(1)).paymentStatus(Fee.PaymentStatus.PAID)
                .transactionId("TXN-11293847").paymentDate(LocalDateTime.now().minusDays(3))
                .remarks("IT Sem 3 Tuition Fee").build());

        feeRepository.save(Fee.builder().student(student8).feeType(Fee.FeeType.TUITION)
                .amount(new BigDecimal("40000.00")).paidAmount(new BigDecimal("0.00"))
                .dueDate(LocalDate.now().plusDays(5)).paymentStatus(Fee.PaymentStatus.PENDING)
                .remarks("ECE Sem 3 Tuition Fee").build());

        feeRepository.save(Fee.builder().student(student11).feeType(Fee.FeeType.TUITION)
                .amount(new BigDecimal("38000.00")).paidAmount(new BigDecimal("38000.00"))
                .dueDate(LocalDate.now().plusMonths(1)).paymentStatus(Fee.PaymentStatus.PAID)
                .transactionId("TXN-57381920").paymentDate(LocalDateTime.now().minusDays(7))
                .remarks("Mechanical Sem 3 Tuition Fee").build());

        feeRepository.save(Fee.builder().student(student11).feeType(Fee.FeeType.LABORATORY)
                .amount(new BigDecimal("5500.00")).paidAmount(new BigDecimal("0.00"))
                .dueDate(LocalDate.now().plusWeeks(3)).paymentStatus(Fee.PaymentStatus.PENDING)
                .remarks("Mech Workshop & Lab Fee").build());

        // ══════════════════════════════════════════════
        // 9. NOTICES
        // ══════════════════════════════════════════════
        noticeRepository.save(Notice.builder()
                .title("Mid-Semester Examination Schedule Announced")
                .content("Mid-semester examinations will commence from the 15th of next month. Students can download the detailed schedule from their portal.")
                .targetAudience(Notice.Audience.ALL).postedBy("Dean of Academics").important(true).build());

        noticeRepository.save(Notice.builder()
                .title("Faculty Development Workshop on Cloud Computing")
                .content("A three-day workshop on modern cloud architectures will be conducted in the seminar hall starting Friday at 10 AM.")
                .targetAudience(Notice.Audience.FACULTY).postedBy("Research & Development Cell").important(false).build());

        noticeRepository.save(Notice.builder()
                .title("Annual Tech Symposium Registration Open")
                .content("Registrations are open for HackCampus 2026. Submit your team project proposals before the end of this week.")
                .targetAudience(Notice.Audience.STUDENTS).postedBy("Student Affairs Council").important(true).build());

        noticeRepository.save(Notice.builder()
                .title("All Department HOD Meeting — Friday 3 PM")
                .content("Mandatory HOD meeting for CS, IT, ECE, and Mechanical departments. Agenda: Semester exam planning and lab upgrades.")
                .targetAudience(Notice.Audience.FACULTY).postedBy("Principal Office").important(true).build());

        log.info("Smart Campus seed data populated successfully! 5 faculty, 13 students across 4 departments seeded.");
    }
}
