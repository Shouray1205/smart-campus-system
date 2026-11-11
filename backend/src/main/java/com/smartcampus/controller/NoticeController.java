package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.Notice;
import com.smartcampus.service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notice>>> getNotices(@RequestParam(required = false) String role) {
        List<Notice> notices = (role != null && !role.isBlank())
                ? noticeService.getNoticesForRole(role)
                : noticeService.getAllNotices();
        return ResponseEntity.ok(ApiResponse.ok("Campus notices", notices));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Notice>> getNoticeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(noticeService.getNoticeById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<Notice>> createNotice(@RequestBody Notice notice) {
        Notice created = noticeService.createNotice(notice);
        return ResponseEntity.ok(ApiResponse.ok("Notice published successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<Notice>> updateNotice(@PathVariable Long id, @RequestBody Notice notice) {
        Notice updated = noticeService.updateNotice(id, notice);
        return ResponseEntity.ok(ApiResponse.ok("Notice updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok(ApiResponse.ok("Notice deleted successfully", "Deleted ID: " + id));
    }
}
