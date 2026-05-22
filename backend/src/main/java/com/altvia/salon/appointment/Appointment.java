package com.altvia.salon.appointment;

import com.altvia.salon.client.Client;
import com.altvia.salon.professional.Professional;
import com.altvia.salon.serviceoffering.ServiceOffering;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments", indexes = {
        @Index(name = "idx_appointments_start_at", columnList = "start_at"),
        @Index(name = "idx_appointments_professional_start_at", columnList = "professional_id,start_at")
})
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professional_id", nullable = false)
    private Professional professional;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_offering_id", nullable = false)
    private ServiceOffering serviceOffering;

    @Column(nullable = false)
    private LocalDateTime startAt;

    @Column(nullable = false)
    private LocalDateTime endAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    protected Appointment() {
    }

    public Appointment(
            Client client,
            Professional professional,
            ServiceOffering serviceOffering,
            LocalDateTime startAt,
            LocalDateTime endAt,
            String notes) {
        this.client = client;
        this.professional = professional;
        this.serviceOffering = serviceOffering;
        this.startAt = startAt;
        this.endAt = endAt;
        this.notes = notes;
    }

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void reschedule(
            Client client,
            Professional professional,
            ServiceOffering serviceOffering,
            LocalDateTime startAt,
            LocalDateTime endAt,
            String notes) {
        this.client = client;
        this.professional = professional;
        this.serviceOffering = serviceOffering;
        this.startAt = startAt;
        this.endAt = endAt;
        this.notes = notes;
    }

    public void updateStatus(AppointmentStatus status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Client getClient() {
        return client;
    }

    public Professional getProfessional() {
        return professional;
    }

    public ServiceOffering getServiceOffering() {
        return serviceOffering;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}