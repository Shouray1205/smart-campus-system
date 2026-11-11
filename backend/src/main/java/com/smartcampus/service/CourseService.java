package com.smartcampus.service;

import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Course;
import com.smartcampus.repository.CourseRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Cacheable(value = "courses", key = "'all'")
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Cacheable(value = "courses", key = "#id")
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    public List<Course> getCoursesByDepartment(String department) {
        return courseRepository.findByDepartment(department);
    }

    public List<Course> getCoursesBySemester(Integer semester) {
        return courseRepository.findBySemester(semester);
    }

    @Transactional
    @CacheEvict(value = {"courses", "dashboardStats"}, allEntries = true)
    public Course createCourse(Course course) {
        if (courseRepository.existsByCourseCode(course.getCourseCode())) {
            throw new BadRequestException("Course code already exists: " + course.getCourseCode());
        }
        return courseRepository.save(course);
    }

    @Transactional
    @CacheEvict(value = {"courses", "dashboardStats"}, allEntries = true)
    public Course updateCourse(Long id, Course updated) {
        Course existing = getCourseById(id);

        if (!existing.getCourseCode().equals(updated.getCourseCode()) &&
                courseRepository.existsByCourseCode(updated.getCourseCode())) {
            throw new BadRequestException("Course code already exists: " + updated.getCourseCode());
        }

        existing.setCourseCode(updated.getCourseCode());
        existing.setCourseName(updated.getCourseName());
        existing.setDepartment(updated.getDepartment());
        existing.setCredits(updated.getCredits());
        existing.setSemester(updated.getSemester());
        existing.setDescription(updated.getDescription());

        return courseRepository.save(existing);
    }

    @Transactional
    @CacheEvict(value = {"courses", "dashboardStats"}, allEntries = true)
    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }
}
