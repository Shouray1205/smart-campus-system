package com.smartcampus.service;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Attendance;
import com.smartcampus.model.Course;
import com.smartcampus.model.Student;
import com.smartcampus.repository.AttendanceRepository;
import com.smartcampus.repository.CourseRepository;
import com.smartcampus.repository.StudentRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             StudentRepository studentRepository,
                             CourseRepository courseRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getAttendanceByCourseAndDate(Long courseId, LocalDate date) {
        return attendanceRepository.findByCourseIdAndDate(courseId, date);
    }

    @Transactional
    @CacheEvict(value = "dashboardStats", allEntries = true)
    public Attendance recordAttendance(Long studentId, Long courseId, LocalDate date,
                                       Attendance.AttendanceStatus status, String remarks) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        Optional<Attendance> existing = attendanceRepository.findByStudentIdAndCourseIdAndDate(studentId, courseId, date);

        Attendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
            attendance.setStatus(status);
            attendance.setRemarks(remarks);
        } else {
            attendance = Attendance.builder()
                    .student(student)
                    .course(course)
                    .date(date != null ? date : LocalDate.now())
                    .status(status)
                    .remarks(remarks)
                    .build();
        }

        return attendanceRepository.save(attendance);
    }

    public Map<String, Object> getStudentAttendanceStats(Long studentId) {
        long total = attendanceRepository.countTotalByStudentId(studentId);
        long present = attendanceRepository.countPresentByStudentId(studentId);
        double percentage = total > 0 ? ((double) present / total) * 100 : 0.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClasses", total);
        stats.put("presentClasses", present);
        stats.put("absentClasses", total - present);
        stats.put("attendancePercentage", Math.round(percentage * 100.0) / 100.0);

        return stats;
    }
}
