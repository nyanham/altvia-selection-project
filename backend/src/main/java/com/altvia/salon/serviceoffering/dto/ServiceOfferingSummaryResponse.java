package com.altvia.salon.serviceoffering.dto;

import java.math.BigDecimal;

public record ServiceOfferingSummaryResponse(Long id, String name, Integer durationMinutes, BigDecimal price) {
}