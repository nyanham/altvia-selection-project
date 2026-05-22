package com.altvia.salon.client.dto;

import java.time.LocalDateTime;

public record ClientResponse(
                Long id,
                String fullName,
                String phone,
                String email,
                String notes,
                boolean active,
                LocalDateTime createdAt,
                LocalDateTime updatedAt) {
}