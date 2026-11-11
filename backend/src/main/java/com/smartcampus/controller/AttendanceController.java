package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.Attendance;
import com.smartcampus.service.AttendanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Attendance>>> getAllAttendance(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (courseId != null && date != null) {
            return ResponseEntity.ok(ApiResponse.ok(attendanceService.getAttendanceByCourseAndDate(courseId, date)));
        }
        return ResponseEntity.ok(ApiResponse.ok("Attendance records", attendanceService.getAllAttendance()));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Attendance>>> getAttendanceByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getAttendanceByStudent(studentId)));
    }

    @GetMapping("/student/{studentId}/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentStats(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getStudentAttendanceStats(studentId)));
    }

    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<Attendance>> markAttendance(@RequestBody AttendanceRequest request) {
        Attendance recorded = attendanceService.recordAttendance(
                request.getStudentId(),
                request.getCourseId(),
                request.getDate() != null ? request.getDate() : LocalDate.now(),
                request.getStatus(),
                request.getRemarks()
        );
        return ResponseEntity.ok(ApiResponse.ok("Attendance marked successfully", recorded));
    }

    public static class AttendanceRequest {
        private Long studentId;
        private Long courseId;
        private LocalDate date;
        private Attendance.AttendanceStatus status;
        private String remarks;

        public AttendanceRequest() {}

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public Attendance.AttendanceStatus getStatus() { return status; }
        public void setStatus(Attendance.AttendanceStatus status) { this.status = status; }
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }
}
