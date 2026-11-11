package com.smartcampus.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 30)
    private String enrollmentNo;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(nullable = false)
    private Integer semester;

    @Column(length = 10)
    private String section;

    private LocalDate dateOfBirth;

    @Column(length = 255)
    private String address;

    @Column(length = 50)
    private String guardianName;

    @Column(length = 20)
    private String guardianPhone;

    public Student() {}

    public Student(Long id, User user, String enrollmentNo, String department, Integer semester,
                   String section, LocalDate dateOfBirth, String address, String guardianName, String guardianPhone) {
        this.id = id;
        this.user = user;
        this.enrollmentNo = enrollmentNo;
        this.department = department;
        this.semester = semester;
        this.section = section;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.guardianName = guardianName;
        this.guardianPhone = guardianPhone;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getEnrollmentNo() { return enrollmentNo; }
    public void setEnrollmentNo(String enrollmentNo) { this.enrollmentNo = enrollmentNo; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
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

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User user;
        private String enrollmentNo;
        private String department;
        private Integer semester;
        private String section;
        private LocalDate dateOfBirth;
        private String address;
        private String guardianName;
        private String guardianPhone;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder enrollmentNo(String enrollmentNo) { this.enrollmentNo = enrollmentNo; return this; }
        public Builder department(String department) { this.department = department; return this; }
        public Builder semester(Integer semester) { this.semester = semester; return this; }
        public Builder section(String section) { this.section = section; return this; }
        public Builder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder guardianName(String guardianName) { this.guardianName = guardianName; return this; }
        public Builder guardianPhone(String guardianPhone) { this.guardianPhone = guardianPhone; return this; }

        public Student build() {
            return new Student(id, user, enrollmentNo, department, semester, section, dateOfBirth, address, guardianName, guardianPhone);
        }
    }
}
