package com.altvia.salon.appointment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record AppointmentUpdateRequest(
                @NotNull(message = "Client is required") @Positive(message = "Client id must be positive") Long clientId,
                @NotNull(message = "Professional is required") @Positive(message = "Professional id must be positive") Long professionalId,
                @NotNull(message = "Service offering is required") @Positive(message = "Service offering id must be positive") Long serviceOfferingId,
                @NotNull(message = "Start time is required") LocalDateTime startAt,
                @Size(max = 500, message = "Notes must have at most 500 characters") String notes) {
}