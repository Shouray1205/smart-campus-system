package com.smartcampus.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalTime;

@Entity
@Table(name = "timetables")
public class Timetable implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private DayOfWeek dayOfWeek;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, length = 30)
    private String roomNo;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false, length = 50)
    private String department;

    public enum DayOfWeek {
        MONDAY,
        TUESDAY,
        WEDNESDAY,
        THURSDAY,
        FRIDAY,
        SATURDAY
    }

    public Timetable() {}

    public Timetable(Long id, Course course, Faculty faculty, DayOfWeek dayOfWeek,
                     LocalTime startTime, LocalTime endTime, String roomNo, Integer semester, String department) {
        this.id = id;
        this.course = course;
        this.faculty = faculty;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.roomNo = roomNo;
        this.semester = semester;
        this.department = department;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public Faculty getFaculty() { return faculty; }
    public void setFaculty(Faculty faculty) { this.faculty = faculty; }
    public DayOfWeek getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public String getRoomNo() { return roomNo; }
    public void setRoomNo(String roomNo) { this.roomNo = roomNo; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Course course;
        private Faculty faculty;
        private DayOfWeek dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
        private String roomNo;
        private Integer semester;
        private String department;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder course(Course course) { this.course = course; return this; }
        public Builder faculty(Faculty faculty) { this.faculty = faculty; return this; }
        public Builder dayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; return this; }
        public Builder startTime(LocalTime startTime) { this.startTime = startTime; return this; }
        public Builder endTime(LocalTime endTime) { this.endTime = endTime; return this; }
        public Builder roomNo(String roomNo) { this.roomNo = roomNo; return this; }
        public Builder semester(Integer semester) { this.semester = semester; return this; }
        public Builder department(String department) { this.department = department; return this; }

        public Timetable build() {
            return new Timetable(id, course, faculty, dayOfWeek, startTime, endTime, roomNo, semester, department);
        }
    }
}
