package com.altvia.salon.professional;

import com.altvia.salon.professional.dto.ProfessionalCreateRequest;
import com.altvia.salon.professional.dto.ProfessionalResponse;
import com.altvia.salon.professional.dto.ProfessionalSummaryResponse;
import com.altvia.salon.professional.dto.ProfessionalUpdateRequest;

final class ProfessionalMapper {

    private ProfessionalMapper() {
    }

    static Professional toEntity(ProfessionalCreateRequest request) {
        return new Professional(
                request.fullName(),
                request.phone(),
                request.email(),
                request.specialty(),
                request.colorHex());
    }

    static void update(Professional professional, ProfessionalUpdateRequest request) {
        professional.updateDetails(
                request.fullName(),
                request.phone(),
                request.email(),
                request.specialty(),
                request.colorHex());
    }

    static ProfessionalResponse toResponse(Professional professional) {
        return new ProfessionalResponse(
                professional.getId(),
                professional.getFullName(),
                professional.getPhone(),
                professional.getEmail(),
                professional.getSpecialty(),
                professional.getColorHex(),
                professional.isActive(),
                professional.getCreatedAt(),
                professional.getUpdatedAt());
    }

    static ProfessionalSummaryResponse toSummary(Professional professional) {
        return new ProfessionalSummaryResponse(
                professional.getId(),
                professional.getFullName(),
                professional.getColorHex());
    }
}