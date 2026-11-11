package com.smartcampus.repository;

import com.smartcampus.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findAllByOrderByCreatedAtDesc();
    List<Notice> findByTargetAudienceInOrderByCreatedAtDesc(List<Notice.Audience> audiences);
    List<Notice> findByImportantTrueOrderByCreatedAtDesc();
}
