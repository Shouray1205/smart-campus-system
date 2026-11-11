package com.smartcampus.service;

import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Role;
import com.smartcampus.model.Student;
import com.smartcampus.model.User;
import com.smartcampus.repository.StudentRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Cacheable(value = "students", key = "'all'")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Cacheable(value = "students", key = "#id")
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));
    }

    public List<Student> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }

    @Transactional
    @CacheEvict(value = {"students", "dashboardStats"}, allEntries = true)
    public Student createStudent(Student student) {
        if (studentRepository.existsByEnrollmentNo(student.getEnrollmentNo())) {
            throw new BadRequestException("Enrollment number already exists: " + student.getEnrollmentNo());
        }

        User user = student.getUser();
        if (user != null) {
            if (userRepository.existsByUsername(user.getUsername())) {
                throw new BadRequestException("Username already exists: " + user.getUsername());
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new BadRequestException("Email already exists: " + user.getEmail());
            }
            user.setRole(Role.ROLE_STUDENT);
            if (user.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            } else {
                user.setPassword(passwordEncoder.encode("Student@123"));
            }
        }

        return studentRepository.save(student);
    }

    @Transactional
    @CacheEvict(value = {"students", "dashboardStats"}, allEntries = true)
    public Student updateStudent(Long id, Student updated) {
        Student existing = getStudentById(id);

        if (!existing.getEnrollmentNo().equals(updated.getEnrollmentNo()) &&
                studentRepository.existsByEnrollmentNo(updated.getEnrollmentNo())) {
            throw new BadRequestException("Enrollment number already exists: " + updated.getEnrollmentNo());
        }

        existing.setEnrollmentNo(updated.getEnrollmentNo());
        existing.setDepartment(updated.getDepartment());
        existing.setSemester(updated.getSemester());
        existing.setSection(updated.getSection());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setAddress(updated.getAddress());
        existing.setGuardianName(updated.getGuardianName());
        existing.setGuardianPhone(updated.getGuardianPhone());

        if (updated.getUser() != null && existing.getUser() != null) {
            existing.getUser().setFullName(updated.getUser().getFullName());
            existing.getUser().setEmail(updated.getUser().getEmail());
            existing.getUser().setPhone(updated.getUser().getPhone());
        }

        return studentRepository.save(existing);
    }

    @Transactional
    @CacheEvict(value = {"students", "dashboardStats"}, allEntries = true)
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
        if (student.getUser() != null) {
            userRepository.delete(student.getUser());
        }
    }
}
