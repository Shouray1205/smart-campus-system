package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.Fee;
import com.smartcampus.service.FeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Fee>>> getAllFees() {
        return ResponseEntity.ok(ApiResponse.ok("All fees", feeService.getAllFees()));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Fee>>> getFeesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(feeService.getFeesByStudent(studentId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Fee>> getFeeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(feeService.getFeeById(id)));
    }

    @PostMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Fee>> createFee(
            @PathVariable Long studentId, @RequestBody Fee fee) {
        Fee created = feeService.createFee(studentId, fee);
        return ResponseEntity.ok(ApiResponse.ok("Fee entry created successfully", created));
    }

    @PostMapping("/{feeId}/pay")
    public ResponseEntity<ApiResponse<Fee>> payFee(
            @PathVariable Long feeId, @RequestBody PaymentRequest request) {
        Fee paid = feeService.payFee(feeId, request.getAmount());
        return ResponseEntity.ok(ApiResponse.ok("Payment processed successfully", paid));
    }

    public static class PaymentRequest {
        private BigDecimal amount;

        public PaymentRequest() {}
        public PaymentRequest(BigDecimal amount) { this.amount = amount; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }
}
