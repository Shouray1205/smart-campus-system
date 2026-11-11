package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.Faculty;
import com.smartcampus.service.FacultyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Faculty>>> getAllFaculty(
            @RequestParam(required = false) String department) {
        List<Faculty> facultyList = (department != null && !department.isBlank())
                ? facultyService.getFacultyByDepartment(department)
                : facultyService.getAllFaculty();
        return ResponseEntity.ok(ApiResponse.ok("Faculty records retrieved successfully", facultyList));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Faculty>> getFacultyById(@PathVariable Long id) {
        Faculty faculty = facultyService.getFacultyById(id);
        return ResponseEntity.ok(ApiResponse.ok("Faculty found", faculty));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Faculty>> getFacultyByUserId(@PathVariable Long userId) {
        Faculty faculty = facultyService.getFacultyByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok("Faculty profile found", faculty));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Faculty>> createFaculty(@RequestBody Faculty faculty) {
        Faculty created = facultyService.createFaculty(faculty);
        return ResponseEntity.ok(ApiResponse.ok("Faculty created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Faculty>> updateFaculty(
            @PathVariable Long id, @RequestBody Faculty faculty) {
        Faculty updated = facultyService.updateFaculty(id, faculty);
        return ResponseEntity.ok(ApiResponse.ok("Faculty updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteFaculty(@PathVariable Long id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.ok(ApiResponse.ok("Faculty deleted successfully", "Deleted ID: " + id));
    }
}
