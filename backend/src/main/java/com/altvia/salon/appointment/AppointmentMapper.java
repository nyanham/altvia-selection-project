package com.altvia.salon.appointment;

import com.altvia.salon.appointment.dto.AppointmentCalendarItemResponse;
import com.altvia.salon.appointment.dto.AppointmentResponse;
import com.altvia.salon.client.dto.ClientSummaryResponse;
import com.altvia.salon.professional.dto.ProfessionalSummaryResponse;
import com.altvia.salon.serviceoffering.dto.ServiceOfferingSummaryResponse;

final class AppointmentMapper {

        private AppointmentMapper() {
        }

        static AppointmentResponse toResponse(Appointment appointment) {
                return new AppointmentResponse(
                                appointment.getId(),
                                new ClientSummaryResponse(
                                                appointment.getClient().getId(),
                                                appointment.getClient().getFullName()),
                                new ProfessionalSummaryResponse(
                                                appointment.getProfessional().getId(),
                                                appointment.getProfessional().getFullName(),
                                                appointment.getProfessional().getColorHex()),
                                new ServiceOfferingSummaryResponse(
                                                appointment.getServiceOffering().getId(),
                                                appointment.getServiceOffering().getName(),
                                                appointment.getServiceOffering().getDurationMinutes(),
                                                appointment.getServiceOffering().getPrice()),
                                appointment.getStartAt(),
                                appointment.getEndAt(),
                                appointment.getStatus(),
                                appointment.getNotes(),
                                appointment.getCreatedAt(),
                                appointment.getUpdatedAt());
        }

        static AppointmentCalendarItemResponse toCalendarItem(Appointment appointment) {
                String title = appointment.getClient().getFullName() + " - "
                                + appointment.getServiceOffering().getName();
                return new AppointmentCalendarItemResponse(
                                appointment.getId(),
                                title,
                                appointment.getStartAt(),
                                appointment.getEndAt(),
                                appointment.getStatus(),
                                appointment.getClient().getId(),
                                appointment.getClient().getFullName(),
                                appointment.getProfessional().getId(),
                                appointment.getProfessional().getFullName(),
                                appointment.getProfessional().getColorHex(),
                                appointment.getServiceOffering().getId(),
                                appointment.getServiceOffering().getName());
        }
}