package com.smartcampus.service;

import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Fee;
import com.smartcampus.model.Student;
import com.smartcampus.repository.FeeRepository;
import com.smartcampus.repository.StudentRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FeeService {

    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;

    public FeeService(FeeRepository feeRepository, StudentRepository studentRepository) {
        this.feeRepository = feeRepository;
        this.studentRepository = studentRepository;
    }

    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    public List<Fee> getFeesByStudent(Long studentId) {
        return feeRepository.findByStudentId(studentId);
    }

    public Fee getFeeById(Long id) {
        return feeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee record not found with id: " + id));
    }

    @Transactional
    @CacheEvict(value = "dashboardStats", allEntries = true)
    public Fee createFee(Long studentId, Fee fee) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        fee.setStudent(student);
        if (fee.getPaidAmount() == null) {
            fee.setPaidAmount(BigDecimal.ZERO);
        }

        if (fee.getPaidAmount().compareTo(BigDecimal.ZERO) == 0) {
            fee.setPaymentStatus(Fee.PaymentStatus.PENDING);
        } else if (fee.getPaidAmount().compareTo(fee.getAmount()) >= 0) {
            fee.setPaymentStatus(Fee.PaymentStatus.PAID);
            fee.setPaymentDate(LocalDateTime.now());
            fee.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        } else {
            fee.setPaymentStatus(Fee.PaymentStatus.PARTIAL);
        }

        return feeRepository.save(fee);
    }

    @Transactional
    @CacheEvict(value = "dashboardStats", allEntries = true)
    public Fee payFee(Long feeId, BigDecimal paymentAmount) {
        Fee fee = getFeeById(feeId);

        if (fee.getPaymentStatus() == Fee.PaymentStatus.PAID) {
            throw new BadRequestException("Fee is already fully paid");
        }

        BigDecimal newPaidAmount = fee.getPaidAmount().add(paymentAmount);
        fee.setPaidAmount(newPaidAmount);
        fee.setPaymentDate(LocalDateTime.now());
        fee.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        if (newPaidAmount.compareTo(fee.getAmount()) >= 0) {
            fee.setPaymentStatus(Fee.PaymentStatus.PAID);
        } else {
            fee.setPaymentStatus(Fee.PaymentStatus.PARTIAL);
        }

        return feeRepository.save(fee);
    }
}
