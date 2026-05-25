package com.altvia.salon.appointment;

import com.altvia.salon.appointment.dto.AppointmentCalendarItemResponse;
import com.altvia.salon.appointment.dto.AppointmentCreateRequest;
import com.altvia.salon.appointment.dto.AppointmentResponse;
import com.altvia.salon.appointment.dto.AppointmentStatusUpdateRequest;
import com.altvia.salon.appointment.dto.AppointmentUpdateRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/v1/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> findAll() {
        return ResponseEntity.ok(appointmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> findById(@PathVariable @Positive Long id) {
        return ResponseEntity.ok(appointmentService.findById(id));
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<AppointmentCalendarItemResponse>> findCalendarItems(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startAt,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endAt,
            @RequestParam(required = false) @Positive Long professionalId) {
        return ResponseEntity.ok(appointmentService.findCalendarItems(startAt, endAt, professionalId));
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> create(@Valid @RequestBody AppointmentCreateRequest request) {
        AppointmentResponse response = appointmentService.create(request);
        return ResponseEntity.created(URI.create("/api/v1/appointments/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentResponse> update(
            @PathVariable @Positive Long id,
            @Valid @RequestBody AppointmentUpdateRequest request) {
        return ResponseEntity.ok(appointmentService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @PathVariable @Positive Long id,
            @Valid @RequestBody AppointmentStatusUpdateRequest request) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @Positive Long id) {
        appointmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}