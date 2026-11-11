package com.smartcampus.service;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Notice;
import com.smartcampus.repository.NoticeRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    @Cacheable(value = "notices", key = "'all'")
    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Notice> getNoticesForRole(String role) {
        if ("ROLE_STUDENT".equalsIgnoreCase(role)) {
            return noticeRepository.findByTargetAudienceInOrderByCreatedAtDesc(
                    Arrays.asList(Notice.Audience.ALL, Notice.Audience.STUDENTS)
            );
        } else if ("ROLE_FACULTY".equalsIgnoreCase(role)) {
            return noticeRepository.findByTargetAudienceInOrderByCreatedAtDesc(
                    Arrays.asList(Notice.Audience.ALL, Notice.Audience.FACULTY)
            );
        }
        return getAllNotices();
    }

    public Notice getNoticeById(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with id: " + id));
    }

    @Transactional
    @CacheEvict(value = "notices", allEntries = true)
    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    @Transactional
    @CacheEvict(value = "notices", allEntries = true)
    public Notice updateNotice(Long id, Notice updated) {
        Notice existing = getNoticeById(id);
        existing.setTitle(updated.getTitle());
        existing.setContent(updated.getContent());
        existing.setTargetAudience(updated.getTargetAudience());
        existing.setImportant(updated.getImportant());
        return noticeRepository.save(existing);
    }

    @Transactional
    @CacheEvict(value = "notices", allEntries = true)
    public void deleteNotice(Long id) {
        Notice existing = getNoticeById(id);
        noticeRepository.delete(existing);
    }
}
