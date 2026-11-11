package com.smartcampus.service;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Course;
import com.smartcampus.model.Faculty;
import com.smartcampus.model.Timetable;
import com.smartcampus.repository.CourseRepository;
import com.smartcampus.repository.FacultyRepository;
import com.smartcampus.repository.TimetableRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final CourseRepository courseRepository;
    private final FacultyRepository facultyRepository;

    public TimetableService(TimetableRepository timetableRepository, CourseRepository courseRepository, FacultyRepository facultyRepository) {
        this.timetableRepository = timetableRepository;
        this.courseRepository = courseRepository;
        this.facultyRepository = facultyRepository;
    }

    @Cacheable(value = "timetables", key = "'all'")
    public List<Timetable> getAllTimetables() {
        return timetableRepository.findAll();
    }

    public List<Timetable> getTimetableByDepartmentAndSemester(String department, Integer semester) {
        return timetableRepository.findByDepartmentAndSemester(department, semester);
    }

    public List<Timetable> getTimetableByFaculty(Long facultyId) {
        return timetableRepository.findByFacultyId(facultyId);
    }

    @Transactional
    @CacheEvict(value = "timetables", allEntries = true)
    public Timetable createTimetable(Timetable timetable) {
        if (timetable.getCourse() != null && timetable.getCourse().getId() != null) {
            Course course = courseRepository.findById(timetable.getCourse().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
            timetable.setCourse(course);
        }

        if (timetable.getFaculty() != null && timetable.getFaculty().getId() != null) {
            Faculty faculty = facultyRepository.findById(timetable.getFaculty().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
            timetable.setFaculty(faculty);
        }

        return timetableRepository.save(timetable);
    }

    @Transactional
    @CacheEvict(value = "timetables", allEntries = true)
    public Timetable updateTimetable(Long id, Timetable updated) {
        Timetable existing = timetableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable entry not found with id: " + id));

        if (updated.getCourse() != null && updated.getCourse().getId() != null) {
            Course course = courseRepository.findById(updated.getCourse().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
            existing.setCourse(course);
        }

        if (updated.getFaculty() != null && updated.getFaculty().getId() != null) {
            Faculty faculty = facultyRepository.findById(updated.getFaculty().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
            existing.setFaculty(faculty);
        }

        existing.setDayOfWeek(updated.getDayOfWeek());
        existing.setStartTime(updated.getStartTime());
        existing.setEndTime(updated.getEndTime());
        existing.setRoomNo(updated.getRoomNo());
        existing.setDepartment(updated.getDepartment());
        existing.setSemester(updated.getSemester());

        return timetableRepository.save(existing);
    }

    @Transactional
    @CacheEvict(value = "timetables", allEntries = true)
    public void deleteTimetable(Long id) {
        Timetable existing = timetableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable entry not found with id: " + id));
        timetableRepository.delete(existing);
    }
}
