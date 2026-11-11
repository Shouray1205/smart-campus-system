package com.smartcampus.service;

import com.smartcampus.dto.DashboardStatsDto;
import com.smartcampus.repository.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final NoticeRepository noticeRepository;
    private final FeeRepository feeRepository;
    private final AttendanceRepository attendanceRepository;

    public DashboardService(StudentRepository studentRepository,
                            FacultyRepository facultyRepository,
                            CourseRepository courseRepository,
                            NoticeRepository noticeRepository,
                            FeeRepository feeRepository,
                            AttendanceRepository attendanceRepository) {
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.courseRepository = courseRepository;
        this.noticeRepository = noticeRepository;
        this.feeRepository = feeRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @Cacheable(value = "dashboardStats", key = "'summary'")
    public DashboardStatsDto getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalFaculty = facultyRepository.count();
        long totalCourses = courseRepository.count();
        long totalNotices = noticeRepository.count();

        BigDecimal totalFeesPaid = feeRepository.sumTotalPaidAmount();
        BigDecimal pendingFees = feeRepository.sumPendingAmount();

        long totalAttendanceRecords = attendanceRepository.count();
        double attendanceRate = 0.0;
        if (totalAttendanceRecords > 0) {
            long totalPresent = attendanceRepository.findAll().stream()
                    .filter(a -> a.getStatus().name().equals("PRESENT"))
                    .count();
            attendanceRate = Math.round(((double) totalPresent / totalAttendanceRecords) * 1000.0) / 10.0;
        }

        return DashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .totalFaculty(totalFaculty)
                .totalCourses(totalCourses)
                .totalNotices(totalNotices)
                .totalFeesCollected(totalFeesPaid != null ? totalFeesPaid : BigDecimal.ZERO)
                .pendingFeesAmount(pendingFees != null ? pendingFees : BigDecimal.ZERO)
                .overallAttendanceRate(attendanceRate)
                .build();
    }
}
