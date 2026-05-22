package com.altvia.salon.professional.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProfessionalUpdateRequest(
                @NotBlank(message = "Full name is required") @Size(max = 120, message = "Full name must have at most 120 characters") String fullName,
                @NotBlank(message = "Phone is required") @Size(max = 20, message = "Phone must have at most 20 characters") String phone,
                @Email(message = "Email must be valid") @Size(max = 120, message = "Email must have at most 120 characters") String email,
                @NotBlank(message = "Specialty is required") @Size(max = 120, message = "Specialty must have at most 120 characters") String specialty,
                @NotBlank(message = "Color is required") @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Color must be a valid hex value") String colorHex) {
}