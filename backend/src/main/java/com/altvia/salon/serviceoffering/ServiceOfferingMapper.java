package com.altvia.salon.serviceoffering;

import com.altvia.salon.serviceoffering.dto.ServiceOfferingCreateRequest;
import com.altvia.salon.serviceoffering.dto.ServiceOfferingResponse;
import com.altvia.salon.serviceoffering.dto.ServiceOfferingSummaryResponse;
import com.altvia.salon.serviceoffering.dto.ServiceOfferingUpdateRequest;

final class ServiceOfferingMapper {

    private ServiceOfferingMapper() {
    }

    static ServiceOffering toEntity(ServiceOfferingCreateRequest request) {
        return new ServiceOffering(
                request.name(),
                request.description(),
                request.durationMinutes(),
                request.price());
    }

    static void update(ServiceOffering serviceOffering, ServiceOfferingUpdateRequest request) {
        serviceOffering.updateDetails(
                request.name(),
                request.description(),
                request.durationMinutes(),
                request.price());
    }

    static ServiceOfferingResponse toResponse(ServiceOffering serviceOffering) {
        return new ServiceOfferingResponse(
                serviceOffering.getId(),
                serviceOffering.getName(),
                serviceOffering.getDescription(),
                serviceOffering.getDurationMinutes(),
                serviceOffering.getPrice(),
                serviceOffering.isActive(),
                serviceOffering.getCreatedAt(),
                serviceOffering.getUpdatedAt());
    }

    static ServiceOfferingSummaryResponse toSummary(ServiceOffering serviceOffering) {
        return new ServiceOfferingSummaryResponse(
                serviceOffering.getId(),
                serviceOffering.getName(),
                serviceOffering.getDurationMinutes(),
                serviceOffering.getPrice());
    }
}