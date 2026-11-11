package com.smartcampus.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
public class Notice implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Audience targetAudience;

    @Column(nullable = false, length = 100)
    private String postedBy;

    @Column(nullable = false)
    private Boolean important;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum Audience {
        ALL,
        FACULTY,
        STUDENTS
    }

    public Notice() {}

    public Notice(Long id, String title, String content, Audience targetAudience, String postedBy, Boolean important, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.targetAudience = targetAudience;
        this.postedBy = postedBy;
        this.important = important;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.important == null) {
            this.important = false;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Audience getTargetAudience() { return targetAudience; }
    public void setTargetAudience(Audience targetAudience) { this.targetAudience = targetAudience; }
    public String getPostedBy() { return postedBy; }
    public void setPostedBy(String postedBy) { this.postedBy = postedBy; }
    public Boolean getImportant() { return important; }
    public void setImportant(Boolean important) { this.important = important; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String title;
        private String content;
        private Audience targetAudience;
        private String postedBy;
        private Boolean important = false;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder content(String content) { this.content = content; return this; }
        public Builder targetAudience(Audience targetAudience) { this.targetAudience = targetAudience; return this; }
        public Builder postedBy(String postedBy) { this.postedBy = postedBy; return this; }
        public Builder important(Boolean important) { this.important = important; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Notice build() {
            return new Notice(id, title, content, targetAudience, postedBy, important, createdAt);
        }
    }
}
