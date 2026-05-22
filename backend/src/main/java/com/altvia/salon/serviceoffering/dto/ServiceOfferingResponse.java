package com.altvia.salon.serviceoffering.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ServiceOfferingResponse(
                Long id,
                String name,
                String description,
                Integer durationMinutes,
                BigDecimal price,
                boolean active,
                LocalDateTime createdAt,
                LocalDateTime updatedAt) {
}