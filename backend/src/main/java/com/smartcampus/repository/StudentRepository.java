package com.smartcampus.repository;

import com.smartcampus.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEnrollmentNo(String enrollmentNo);
    Optional<Student> findByUserId(Long userId);
    List<Student> findByDepartment(String department);
    List<Student> findBySemester(Integer semester);
    List<Student> findByDepartmentAndSemester(String department, Integer semester);
    Boolean existsByEnrollmentNo(String enrollmentNo);
}
