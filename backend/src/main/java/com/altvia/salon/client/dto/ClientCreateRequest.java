package com.altvia.salon.client.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClientCreateRequest(
                @NotBlank(message = "Full name is required") @Size(max = 120, message = "Full name must have at most 120 characters") String fullName,
                @NotBlank(message = "Phone is required") @Size(max = 20, message = "Phone must have at most 20 characters") String phone,
                @Email(message = "Email must be valid") @Size(max = 120, message = "Email must have at most 120 characters") String email,
                @Size(max = 500, message = "Notes must have at most 500 characters") String notes) {
}