package com.altvia.salon.professional;

import com.altvia.salon.professional.dto.ProfessionalCreateRequest;
import com.altvia.salon.professional.dto.ProfessionalResponse;
import com.altvia.salon.professional.dto.ProfessionalUpdateRequest;
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
@RequestMapping("/v1/professionals")
public class ProfessionalController {

    private final ProfessionalService professionalService;

    public ProfessionalController(ProfessionalService professionalService) {
        this.professionalService = professionalService;
    }

    @GetMapping
    public ResponseEntity<List<ProfessionalResponse>> findAll() {
        return ResponseEntity.ok(professionalService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessionalResponse> findById(@PathVariable @Positive Long id) {
        return ResponseEntity.ok(professionalService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProfessionalResponse> create(@Valid @RequestBody ProfessionalCreateRequest request) {
        ProfessionalResponse response = professionalService.create(request);
        return ResponseEntity.created(URI.create("/api/v1/professionals/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessionalResponse> update(
            @PathVariable @Positive Long id,
            @Valid @RequestBody ProfessionalUpdateRequest request) {
        return ResponseEntity.ok(professionalService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @Positive Long id) {
        professionalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}