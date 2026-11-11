package com.smartcampus.dto;

import com.smartcampus.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100)
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;

    @NotNull(message = "Role is required")
    private Role role;

    // Student fields
    private String enrollmentNo;
    private String studentDepartment;
    private Integer semester;
    private String section;
    private LocalDate dateOfBirth;
    private String address;
    private String guardianName;
    private String guardianPhone;

    // Faculty fields
    private String employeeId;
    private String facultyDepartment;
    private String designation;
    private String qualification;
    private LocalDate joiningDate;
    private String specialization;

    public RegisterRequest() {}

    public RegisterRequest(String username, String password, String email, String fullName, String phone, Role role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getEnrollmentNo() { return enrollmentNo; }
    public void setEnrollmentNo(String enrollmentNo) { this.enrollmentNo = enrollmentNo; }
    public String getStudentDepartment() { return studentDepartment; }
    public void setStudentDepartment(String studentDepartment) { this.studentDepartment = studentDepartment; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getGuardianName() { return guardianName; }
    public void setGuardianName(String guardianName) { this.guardianName = guardianName; }
    public String getGuardianPhone() { return guardianPhone; }
    public void setGuardianPhone(String guardianPhone) { this.guardianPhone = guardianPhone; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getFacultyDepartment() { return facultyDepartment; }
    public void setFacultyDepartment(String facultyDepartment) { this.facultyDepartment = facultyDepartment; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private RegisterRequest r = new RegisterRequest();

        public Builder username(String username) { r.username = username; return this; }
        public Builder password(String password) { r.password = password; return this; }
        public Builder email(String email) { r.email = email; return this; }
        public Builder fullName(String fullName) { r.fullName = fullName; return this; }
        public Builder phone(String phone) { r.phone = phone; return this; }
        public Builder role(Role role) { r.role = role; return this; }
        public Builder enrollmentNo(String enrollmentNo) { r.enrollmentNo = enrollmentNo; return this; }
        public Builder studentDepartment(String studentDepartment) { r.studentDepartment = studentDepartment; return this; }
        public Builder semester(Integer semester) { r.semester = semester; return this; }
        public Builder section(String section) { r.section = section; return this; }
        public Builder dateOfBirth(LocalDate dateOfBirth) { r.dateOfBirth = dateOfBirth; return this; }
        public Builder address(String address) { r.address = address; return this; }
        public Builder guardianName(String guardianName) { r.guardianName = guardianName; return this; }
        public Builder guardianPhone(String guardianPhone) { r.guardianPhone = guardianPhone; return this; }
        public Builder employeeId(String employeeId) { r.employeeId = employeeId; return this; }
        public Builder facultyDepartment(String facultyDepartment) { r.facultyDepartment = facultyDepartment; return this; }
        public Builder designation(String designation) { r.designation = designation; return this; }
        public Builder qualification(String qualification) { r.qualification = qualification; return this; }
        public Builder joiningDate(LocalDate joiningDate) { r.joiningDate = joiningDate; return this; }
        public Builder specialization(String specialization) { r.specialization = specialization; return this; }

        public RegisterRequest build() { return r; }
    }
}
