package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.FacultyAttendance;
import com.smartcampus.service.FacultyAttendanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance/faculty")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FacultyAttendanceController {

    private final FacultyAttendanceService facultyAttendanceService;

    public FacultyAttendanceController(FacultyAttendanceService facultyAttendanceService) {
        this.facultyAttendanceService = facultyAttendanceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FacultyAttendance>>> getFacultyAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<FacultyAttendance> list = (date != null)
                ? facultyAttendanceService.getFacultyAttendanceByDate(date)
                : facultyAttendanceService.getAllFacultyAttendance();
        return ResponseEntity.ok(ApiResponse.ok("Faculty attendance records", list));
    }

    @GetMapping("/{facultyId}")
    public ResponseEntity<ApiResponse<List<FacultyAttendance>>> getAttendanceByFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(ApiResponse.ok(facultyAttendanceService.getAttendanceByFaculty(facultyId)));
    }

    @PostMapping("/mark")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FacultyAttendance>> markFacultyAttendance(
            @RequestBody FacultyAttendanceRequest request) {
        FacultyAttendance attendance = facultyAttendanceService.recordFacultyAttendance(
                request.getFacultyId(),
                request.getDate() != null ? request.getDate() : LocalDate.now(),
                request.getStatus(),
                request.getRemarks()
        );
        return ResponseEntity.ok(ApiResponse.ok("Faculty attendance marked successfully", attendance));
    }

    public static class FacultyAttendanceRequest {
        private Long facultyId;
        private LocalDate date;
        private FacultyAttendance.FacultyAttendanceStatus status;
        private String remarks;

        public FacultyAttendanceRequest() {}

        public Long getFacultyId() { return facultyId; }
        public void setFacultyId(Long facultyId) { this.facultyId = facultyId; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public FacultyAttendance.FacultyAttendanceStatus getStatus() { return status; }
        public void setStatus(FacultyAttendance.FacultyAttendanceStatus status) { this.status = status; }
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }
}
