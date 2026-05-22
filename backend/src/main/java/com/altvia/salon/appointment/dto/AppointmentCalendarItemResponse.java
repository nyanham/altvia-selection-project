package com.altvia.salon.appointment.dto;

import com.altvia.salon.appointment.AppointmentStatus;
import java.time.LocalDateTime;

public record AppointmentCalendarItemResponse(
                Long id,
                String title,
                LocalDateTime startAt,
                LocalDateTime endAt,
                AppointmentStatus status,
                Long clientId,
                String clientName,
                Long professionalId,
                String professionalName,
                String professionalColorHex,
                Long serviceOfferingId,
                String serviceOfferingName) {
}