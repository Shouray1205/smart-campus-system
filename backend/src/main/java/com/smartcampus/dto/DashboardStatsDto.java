package com.smartcampus.dto;

import java.math.BigDecimal;

public class DashboardStatsDto {
    private long totalStudents;
    private long totalFaculty;
    private long totalCourses;
    private long totalNotices;
    private BigDecimal totalFeesCollected;
    private BigDecimal pendingFeesAmount;
    private double overallAttendanceRate;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalStudents, long totalFaculty, long totalCourses, long totalNotices,
                             BigDecimal totalFeesCollected, BigDecimal pendingFeesAmount, double overallAttendanceRate) {
        this.totalStudents = totalStudents;
        this.totalFaculty = totalFaculty;
        this.totalCourses = totalCourses;
        this.totalNotices = totalNotices;
        this.totalFeesCollected = totalFeesCollected;
        this.pendingFeesAmount = pendingFeesAmount;
        this.overallAttendanceRate = overallAttendanceRate;
    }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
    public long getTotalFaculty() { return totalFaculty; }
    public void setTotalFaculty(long totalFaculty) { this.totalFaculty = totalFaculty; }
    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }
    public long getTotalNotices() { return totalNotices; }
    public void setTotalNotices(long totalNotices) { this.totalNotices = totalNotices; }
    public BigDecimal getTotalFeesCollected() { return totalFeesCollected; }
    public void setTotalFeesCollected(BigDecimal totalFeesCollected) { this.totalFeesCollected = totalFeesCollected; }
    public BigDecimal getPendingFeesAmount() { return pendingFeesAmount; }
    public void setPendingFeesAmount(BigDecimal pendingFeesAmount) { this.pendingFeesAmount = pendingFeesAmount; }
    public double getOverallAttendanceRate() { return overallAttendanceRate; }
    public void setOverallAttendanceRate(double overallAttendanceRate) { this.overallAttendanceRate = overallAttendanceRate; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalStudents;
        private long totalFaculty;
        private long totalCourses;
        private long totalNotices;
        private BigDecimal totalFeesCollected;
        private BigDecimal pendingFeesAmount;
        private double overallAttendanceRate;

        public Builder totalStudents(long totalStudents) { this.totalStudents = totalStudents; return this; }
        public Builder totalFaculty(long totalFaculty) { this.totalFaculty = totalFaculty; return this; }
        public Builder totalCourses(long totalCourses) { this.totalCourses = totalCourses; return this; }
        public Builder totalNotices(long totalNotices) { this.totalNotices = totalNotices; return this; }
        public Builder totalFeesCollected(BigDecimal totalFeesCollected) { this.totalFeesCollected = totalFeesCollected; return this; }
        public Builder pendingFeesAmount(BigDecimal pendingFeesAmount) { this.pendingFeesAmount = pendingFeesAmount; return this; }
        public Builder overallAttendanceRate(double overallAttendanceRate) { this.overallAttendanceRate = overallAttendanceRate; return this; }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(totalStudents, totalFaculty, totalCourses, totalNotices, totalFeesCollected, pendingFeesAmount, overallAttendanceRate);
        }
    }
}
