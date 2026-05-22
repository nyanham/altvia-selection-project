package com.altvia.salon.appointment.dto;

import com.altvia.salon.appointment.AppointmentStatus;
import com.altvia.salon.client.dto.ClientSummaryResponse;
import com.altvia.salon.professional.dto.ProfessionalSummaryResponse;
import com.altvia.salon.serviceoffering.dto.ServiceOfferingSummaryResponse;
import java.time.LocalDateTime;

public record AppointmentResponse(
                Long id,
                ClientSummaryResponse client,
                ProfessionalSummaryResponse professional,
                ServiceOfferingSummaryResponse serviceOffering,
                LocalDateTime startAt,
                LocalDateTime endAt,
                AppointmentStatus status,
                String notes,
                LocalDateTime createdAt,
                LocalDateTime updatedAt) {
}