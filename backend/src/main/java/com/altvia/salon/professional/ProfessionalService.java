package com.altvia.salon.professional;

import com.altvia.salon.common.exception.ResourceNotFoundException;
import com.altvia.salon.professional.dto.ProfessionalCreateRequest;
import com.altvia.salon.professional.dto.ProfessionalResponse;
import com.altvia.salon.professional.dto.ProfessionalUpdateRequest;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProfessionalService {

    private final ProfessionalRepository professionalRepository;

    public ProfessionalService(ProfessionalRepository professionalRepository) {
        this.professionalRepository = professionalRepository;
    }

    public List<ProfessionalResponse> findAll() {
        return professionalRepository.findAllByOrderByFullNameAsc()
                .stream()
                .map(ProfessionalMapper::toResponse)
                .toList();
    }

    public ProfessionalResponse findById(Long id) {
        return ProfessionalMapper.toResponse(findProfessional(id));
    }

    @Transactional
    public ProfessionalResponse create(ProfessionalCreateRequest request) {
        Professional professional = ProfessionalMapper.toEntity(request);
        Professional savedProfessional = professionalRepository.save(professional);
        return ProfessionalMapper.toResponse(savedProfessional);
    }

    @Transactional
    public ProfessionalResponse update(Long id, ProfessionalUpdateRequest request) {
        Professional professional = findProfessional(id);
        ProfessionalMapper.update(professional, request);
        return ProfessionalMapper.toResponse(professional);
    }

    @Transactional
    public void delete(Long id) {
        professionalRepository.delete(findProfessional(id));
    }

    Professional findProfessional(Long id) {
        return professionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professional not found: " + id));
    }
}