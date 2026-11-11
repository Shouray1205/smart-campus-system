package com.smartcampus.service;

import com.smartcampus.dto.AuthRequest;
import com.smartcampus.dto.AuthResponse;
import com.smartcampus.dto.RegisterRequest;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.model.Faculty;
import com.smartcampus.model.Role;
import com.smartcampus.model.Student;
import com.smartcampus.model.User;
import com.smartcampus.repository.FacultyRepository;
import com.smartcampus.repository.StudentRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.JwtUtils;
import com.smartcampus.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       StudentRepository studentRepository,
                       FacultyRepository facultyRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse authenticateUser(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Long profileId = null;
        if (userDetails.getRole() == Role.ROLE_STUDENT) {
            profileId = studentRepository.findByUserId(userDetails.getId())
                    .map(Student::getId).orElse(null);
        } else if (userDetails.getRole() == Role.ROLE_FACULTY) {
            profileId = facultyRepository.findByUserId(userDetails.getId())
                    .map(Faculty::getId).orElse(null);
        }

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .fullName(userDetails.getFullName())
                .role(userDetails.getRole())
                .profileId(profileId)
                .build();
    }

    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(request.getRole())
                .build();

        User savedUser = userRepository.save(user);

        if (request.getRole() == Role.ROLE_STUDENT) {
            if (request.getEnrollmentNo() != null && studentRepository.existsByEnrollmentNo(request.getEnrollmentNo())) {
                throw new BadRequestException("Enrollment number is already registered!");
            }
            Student student = Student.builder()
                    .user(savedUser)
                    .enrollmentNo(request.getEnrollmentNo() != null ? request.getEnrollmentNo() : "STU-" + System.currentTimeMillis())
                    .department(request.getStudentDepartment() != null ? request.getStudentDepartment() : "Computer Science")
                    .semester(request.getSemester() != null ? request.getSemester() : 1)
                    .section(request.getSection() != null ? request.getSection() : "A")
                    .dateOfBirth(request.getDateOfBirth())
                    .address(request.getAddress())
                    .guardianName(request.getGuardianName())
                    .guardianPhone(request.getGuardianPhone())
                    .build();
            studentRepository.save(student);
        } else if (request.getRole() == Role.ROLE_FACULTY) {
            if (request.getEmployeeId() != null && facultyRepository.existsByEmployeeId(request.getEmployeeId())) {
                throw new BadRequestException("Employee ID is already registered!");
            }
            Faculty faculty = Faculty.builder()
                    .user(savedUser)
                    .employeeId(request.getEmployeeId() != null ? request.getEmployeeId() : "FAC-" + System.currentTimeMillis())
                    .department(request.getFacultyDepartment() != null ? request.getFacultyDepartment() : "Computer Science")
                    .designation(request.getDesignation() != null ? request.getDesignation() : "Assistant Professor")
                    .qualification(request.getQualification())
                    .joiningDate(request.getJoiningDate())
                    .specialization(request.getSpecialization())
                    .build();
            facultyRepository.save(faculty);
        }

        return savedUser;
    }
}
