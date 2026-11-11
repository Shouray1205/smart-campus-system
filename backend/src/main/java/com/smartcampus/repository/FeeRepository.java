package com.smartcampus.repository;

import com.smartcampus.model.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByStudentId(Long studentId);
    List<Fee> findByPaymentStatus(Fee.PaymentStatus paymentStatus);

    @Query("SELECT COALESCE(SUM(f.paidAmount), 0) FROM Fee f")
    BigDecimal sumTotalPaidAmount();

    @Query("SELECT COALESCE(SUM(f.amount - f.paidAmount), 0) FROM Fee f WHERE f.paymentStatus != 'PAID'")
    BigDecimal sumPendingAmount();
}
