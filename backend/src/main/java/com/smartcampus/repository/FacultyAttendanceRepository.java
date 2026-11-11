package com.smartcampus.repository;

import com.smartcampus.model.FacultyAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyAttendanceRepository extends JpaRepository<FacultyAttendance, Long> {
    List<FacultyAttendance> findByFacultyId(Long facultyId);
    List<FacultyAttendance> findByDate(LocalDate date);
    Optional<FacultyAttendance> findByFacultyIdAndDate(Long facultyId, LocalDate date);
}
