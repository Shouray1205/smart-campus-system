package com.smartcampus.service;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Faculty;
import com.smartcampus.model.FacultyAttendance;
import com.smartcampus.repository.FacultyAttendanceRepository;
import com.smartcampus.repository.FacultyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class FacultyAttendanceService {

    private final FacultyAttendanceRepository facultyAttendanceRepository;
    private final FacultyRepository facultyRepository;

    public FacultyAttendanceService(FacultyAttendanceRepository facultyAttendanceRepository,
                                    FacultyRepository facultyRepository) {
        this.facultyAttendanceRepository = facultyAttendanceRepository;
        this.facultyRepository = facultyRepository;
    }

    public List<FacultyAttendance> getAllFacultyAttendance() {
        return facultyAttendanceRepository.findAll();
    }

    public List<FacultyAttendance> getFacultyAttendanceByDate(LocalDate date) {
        return facultyAttendanceRepository.findByDate(date != null ? date : LocalDate.now());
    }

    public List<FacultyAttendance> getAttendanceByFaculty(Long facultyId) {
        return facultyAttendanceRepository.findByFacultyId(facultyId);
    }

    @Transactional
    public FacultyAttendance recordFacultyAttendance(Long facultyId, LocalDate date,
                                                     FacultyAttendance.FacultyAttendanceStatus status,
                                                     String remarks) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty member not found with id: " + facultyId));

        LocalDate targetDate = date != null ? date : LocalDate.now();
        Optional<FacultyAttendance> existing = facultyAttendanceRepository.findByFacultyIdAndDate(facultyId, targetDate);

        FacultyAttendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
            attendance.setStatus(status);
            attendance.setRemarks(remarks);
        } else {
            attendance = FacultyAttendance.builder()
                    .faculty(faculty)
                    .date(targetDate)
                    .status(status)
                    .checkInTime(status == FacultyAttendance.FacultyAttendanceStatus.PRESENT ? LocalTime.now() : null)
                    .remarks(remarks)
                    .build();
        }

        return facultyAttendanceRepository.save(attendance);
    }
}
