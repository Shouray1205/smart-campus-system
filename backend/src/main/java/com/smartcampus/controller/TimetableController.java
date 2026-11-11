package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.Timetable;
import com.smartcampus.service.TimetableService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Timetable>>> getTimetables(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer semester) {
        if (department != null && semester != null) {
            return ResponseEntity.ok(ApiResponse.ok(timetableService.getTimetableByDepartmentAndSemester(department, semester)));
        }
        return ResponseEntity.ok(ApiResponse.ok("Timetable schedule", timetableService.getAllTimetables()));
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<ApiResponse<List<Timetable>>> getFacultyTimetable(@PathVariable Long facultyId) {
        return ResponseEntity.ok(ApiResponse.ok(timetableService.getTimetableByFaculty(facultyId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Timetable>> createTimetable(@RequestBody Timetable timetable) {
        Timetable created = timetableService.createTimetable(timetable);
        return ResponseEntity.ok(ApiResponse.ok("Timetable schedule created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Timetable>> updateTimetable(@PathVariable Long id, @RequestBody Timetable timetable) {
        Timetable updated = timetableService.updateTimetable(id, timetable);
        return ResponseEntity.ok(ApiResponse.ok("Timetable schedule updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteTimetable(@PathVariable Long id) {
        timetableService.deleteTimetable(id);
        return ResponseEntity.ok(ApiResponse.ok("Timetable schedule deleted successfully", "Deleted ID: " + id));
    }
}
