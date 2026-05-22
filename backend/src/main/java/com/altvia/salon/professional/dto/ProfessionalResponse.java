package com.altvia.salon.professional.dto;

import java.time.LocalDateTime;

public record ProfessionalResponse(
                Long id,
                String fullName,
                String phone,
                String email,
                String specialty,
                String colorHex,
                boolean active,
                LocalDateTime createdAt,
                LocalDateTime updatedAt) {
}