package com.smartcampus.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "faculty_attendances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"faculty_id", "date"})
})
public class FacultyAttendance implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FacultyAttendanceStatus status;

    private LocalTime checkInTime;

    @Column(length = 255)
    private String remarks;

    public enum FacultyAttendanceStatus {
        PRESENT,
        ABSENT,
        ON_LEAVE,
        HALF_DAY
    }

    public FacultyAttendance() {}

    public FacultyAttendance(Long id, Faculty faculty, LocalDate date, FacultyAttendanceStatus status, LocalTime checkInTime, String remarks) {
        this.id = id;
        this.faculty = faculty;
        this.date = date;
        this.status = status;
        this.checkInTime = checkInTime;
        this.remarks = remarks;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Faculty getFaculty() { return faculty; }
    public void setFaculty(Faculty faculty) { this.faculty = faculty; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public FacultyAttendanceStatus getStatus() { return status; }
    public void setStatus(FacultyAttendanceStatus status) { this.status = status; }
    public LocalTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalTime checkInTime) { this.checkInTime = checkInTime; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Faculty faculty;
        private LocalDate date;
        private FacultyAttendanceStatus status;
        private LocalTime checkInTime;
        private String remarks;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder faculty(Faculty faculty) { this.faculty = faculty; return this; }
        public Builder date(LocalDate date) { this.date = date; return this; }
        public Builder status(FacultyAttendanceStatus status) { this.status = status; return this; }
        public Builder checkInTime(LocalTime checkInTime) { this.checkInTime = checkInTime; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }

        public FacultyAttendance build() {
            return new FacultyAttendance(id, faculty, date, status, checkInTime, remarks);
        }
    }
}
