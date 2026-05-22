package com.altvia.salon.appointment;

import com.altvia.salon.appointment.dto.AppointmentCalendarItemResponse;
import com.altvia.salon.appointment.dto.AppointmentCreateRequest;
import com.altvia.salon.appointment.dto.AppointmentResponse;
import com.altvia.salon.appointment.dto.AppointmentStatusUpdateRequest;
import com.altvia.salon.appointment.dto.AppointmentUpdateRequest;
import com.altvia.salon.client.Client;
import com.altvia.salon.client.ClientRepository;
import com.altvia.salon.common.exception.BusinessRuleViolationException;
import com.altvia.salon.common.exception.ResourceNotFoundException;
import com.altvia.salon.professional.Professional;
import com.altvia.salon.professional.ProfessionalRepository;
import com.altvia.salon.serviceoffering.ServiceOffering;
import com.altvia.salon.serviceoffering.ServiceOfferingRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ClientRepository clientRepository;
    private final ProfessionalRepository professionalRepository;
    private final ServiceOfferingRepository serviceOfferingRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            ClientRepository clientRepository,
            ProfessionalRepository professionalRepository,
            ServiceOfferingRepository serviceOfferingRepository) {
        this.appointmentRepository = appointmentRepository;
        this.clientRepository = clientRepository;
        this.professionalRepository = professionalRepository;
        this.serviceOfferingRepository = serviceOfferingRepository;
    }

    public List<AppointmentResponse> findAll() {
        return appointmentRepository.findAllByOrderByStartAtDesc()
                .stream()
                .map(AppointmentMapper::toResponse)
                .toList();
    }

    public AppointmentResponse findById(Long id) {
        return AppointmentMapper.toResponse(findAppointment(id));
    }

    public List<AppointmentCalendarItemResponse> findCalendarItems(
            LocalDateTime startAt,
            LocalDateTime endAt,
            Long professionalId) {
        validateCalendarRange(startAt, endAt);
        return appointmentRepository.findCalendarItems(startAt, endAt, professionalId)
                .stream()
                .map(AppointmentMapper::toCalendarItem)
                .toList();
    }

    @Transactional
    public AppointmentResponse create(AppointmentCreateRequest request) {
        Client client = findClient(request.clientId());
        Professional professional = findProfessional(request.professionalId());
        ServiceOffering serviceOffering = findServiceOffering(request.serviceOfferingId());
        LocalDateTime endAt = calculateEndAt(request.startAt(), serviceOffering);

        validateNoConflict(professional.getId(), null, request.startAt(), endAt);

        Appointment appointment = new Appointment(
                client,
                professional,
                serviceOffering,
                request.startAt(),
                endAt,
                request.notes());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return AppointmentMapper.toResponse(savedAppointment);
    }

    @Transactional
    public AppointmentResponse update(Long id, AppointmentUpdateRequest request) {
        Appointment appointment = findAppointment(id);
        Client client = findClient(request.clientId());
        Professional professional = findProfessional(request.professionalId());
        ServiceOffering serviceOffering = findServiceOffering(request.serviceOfferingId());
        LocalDateTime endAt = calculateEndAt(request.startAt(), serviceOffering);

        validateNoConflict(professional.getId(), appointment.getId(), request.startAt(), endAt);

        appointment.reschedule(
                client,
                professional,
                serviceOffering,
                request.startAt(),
                endAt,
                request.notes());

        return AppointmentMapper.toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse updateStatus(Long id, AppointmentStatusUpdateRequest request) {
        Appointment appointment = findAppointment(id);
        appointment.updateStatus(request.status());
        return AppointmentMapper.toResponse(appointment);
    }

    private void validateNoConflict(
            Long professionalId,
            Long appointmentId,
            LocalDateTime startAt,
            LocalDateTime endAt) {
        boolean hasConflict = appointmentRepository.existsConflict(
                professionalId,
                appointmentId,
                AppointmentStatus.CANCELED,
                startAt,
                endAt);

        if (hasConflict) {
            throw new BusinessRuleViolationException(
                    "The selected professional already has an appointment in this time range.");
        }
    }

    private void validateCalendarRange(LocalDateTime startAt, LocalDateTime endAt) {
        if (startAt == null || endAt == null || !endAt.isAfter(startAt)) {
            throw new BusinessRuleViolationException("The calendar range must have an end time after the start time.");
        }
    }

    private LocalDateTime calculateEndAt(LocalDateTime startAt, ServiceOffering serviceOffering) {
        return startAt.plusMinutes(serviceOffering.getDurationMinutes());
    }

    private Appointment findAppointment(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
    }

    private Client findClient(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + id));
    }

    private Professional findProfessional(Long id) {
        return professionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professional not found: " + id));
    }

    private ServiceOffering findServiceOffering(Long id) {
        return serviceOfferingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service offering not found: " + id));
    }
}