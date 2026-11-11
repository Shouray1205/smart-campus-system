package com.smartcampus.service;

import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Faculty;
import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.FacultyRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public FacultyService(FacultyRepository facultyRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.facultyRepository = facultyRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Cacheable(value = "faculty", key = "'all'")
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    @Cacheable(value = "faculty", key = "#id")
    public Faculty getFacultyById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty member not found with id: " + id));
    }

    public Faculty getFacultyByUserId(Long userId) {
        return facultyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty profile not found for user id: " + userId));
    }

    public List<Faculty> getFacultyByDepartment(String department) {
        return facultyRepository.findByDepartment(department);
    }

    @Transactional
    @CacheEvict(value = {"faculty", "dashboardStats"}, allEntries = true)
    public Faculty createFaculty(Faculty faculty) {
        if (facultyRepository.existsByEmployeeId(faculty.getEmployeeId())) {
            throw new BadRequestException("Employee ID already exists: " + faculty.getEmployeeId());
        }

        User user = faculty.getUser();
        if (user != null) {
            if (userRepository.existsByUsername(user.getUsername())) {
                throw new BadRequestException("Username already exists: " + user.getUsername());
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new BadRequestException("Email already exists: " + user.getEmail());
            }
            user.setRole(Role.ROLE_FACULTY);
            if (user.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            } else {
                user.setPassword(passwordEncoder.encode("Faculty@123"));
            }
        }

        return facultyRepository.save(faculty);
    }

    @Transactional
    @CacheEvict(value = {"faculty", "dashboardStats"}, allEntries = true)
    public Faculty updateFaculty(Long id, Faculty updated) {
        Faculty existing = getFacultyById(id);

        if (!existing.getEmployeeId().equals(updated.getEmployeeId()) &&
                facultyRepository.existsByEmployeeId(updated.getEmployeeId())) {
            throw new BadRequestException("Employee ID already exists: " + updated.getEmployeeId());
        }

        existing.setEmployeeId(updated.getEmployeeId());
        existing.setDepartment(updated.getDepartment());
        existing.setDesignation(updated.getDesignation());
        existing.setQualification(updated.getQualification());
        existing.setJoiningDate(updated.getJoiningDate());
        existing.setSpecialization(updated.getSpecialization());

        if (updated.getUser() != null && existing.getUser() != null) {
            existing.getUser().setFullName(updated.getUser().getFullName());
            existing.getUser().setEmail(updated.getUser().getEmail());
            existing.getUser().setPhone(updated.getUser().getPhone());
        }

        return facultyRepository.save(existing);
    }

    @Transactional
    @CacheEvict(value = {"faculty", "dashboardStats"}, allEntries = true)
    public void deleteFaculty(Long id) {
        Faculty faculty = getFacultyById(id);
        facultyRepository.delete(faculty);
        if (faculty.getUser() != null) {
            userRepository.delete(faculty.getUser());
        }
    }
}
