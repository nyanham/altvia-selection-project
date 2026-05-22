package com.altvia.salon.serviceoffering.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ServiceOfferingUpdateRequest(
                @NotBlank(message = "Name is required") @Size(max = 120, message = "Name must have at most 120 characters") String name,
                @Size(max = 500, message = "Description must have at most 500 characters") String description,
                @NotNull(message = "Duration is required") @Positive(message = "Duration must be greater than zero") Integer durationMinutes,
                @NotNull(message = "Price is required") @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero") BigDecimal price) {
}