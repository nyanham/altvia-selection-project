package com.altvia.salon.serviceoffering;

import com.altvia.salon.serviceoffering.dto.ServiceOfferingCreateRequest;
import com.altvia.salon.serviceoffering.dto.ServiceOfferingResponse;
import com.altvia.salon.serviceoffering.dto.ServiceOfferingUpdateRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/v1/services")
public class ServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;

    public ServiceOfferingController(ServiceOfferingService serviceOfferingService) {
        this.serviceOfferingService = serviceOfferingService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceOfferingResponse>> findAll() {
        return ResponseEntity.ok(serviceOfferingService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOfferingResponse> findById(@PathVariable @Positive Long id) {
        return ResponseEntity.ok(serviceOfferingService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ServiceOfferingResponse> create(@Valid @RequestBody ServiceOfferingCreateRequest request) {
        ServiceOfferingResponse response = serviceOfferingService.create(request);
        return ResponseEntity.created(URI.create("/api/v1/services/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceOfferingResponse> update(
            @PathVariable @Positive Long id,
            @Valid @RequestBody ServiceOfferingUpdateRequest request) {
        return ResponseEntity.ok(serviceOfferingService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @Positive Long id) {
        serviceOfferingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}