package com.altvia.salon.appointment.dto;

import com.altvia.salon.appointment.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public record AppointmentStatusUpdateRequest(
                @NotNull(message = "Status is required") AppointmentStatus status) {
}