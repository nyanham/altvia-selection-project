package com.altvia.salon.serviceoffering;

import com.altvia.salon.common.exception.ResourceNotFoundException;
import com.altvia.salon.serviceoffering.dto.ServiceOfferingCreateRequest;
import com.altvia.salon.serviceoffering.dto.ServiceOfferingResponse;
import com.altvia.salon.serviceoffering.dto.ServiceOfferingUpdateRequest;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ServiceOfferingService {

    private final ServiceOfferingRepository serviceOfferingRepository;

    public ServiceOfferingService(ServiceOfferingRepository serviceOfferingRepository) {
        this.serviceOfferingRepository = serviceOfferingRepository;
    }

    public List<ServiceOfferingResponse> findAll() {
        return serviceOfferingRepository.findAllByOrderByNameAsc()
                .stream()
                .map(ServiceOfferingMapper::toResponse)
                .toList();
    }

    public ServiceOfferingResponse findById(Long id) {
        return ServiceOfferingMapper.toResponse(findServiceOffering(id));
    }

    @Transactional
    public ServiceOfferingResponse create(ServiceOfferingCreateRequest request) {
        ServiceOffering serviceOffering = ServiceOfferingMapper.toEntity(request);
        ServiceOffering savedServiceOffering = serviceOfferingRepository.save(serviceOffering);
        return ServiceOfferingMapper.toResponse(savedServiceOffering);
    }

    @Transactional
    public ServiceOfferingResponse update(Long id, ServiceOfferingUpdateRequest request) {
        ServiceOffering serviceOffering = findServiceOffering(id);
        ServiceOfferingMapper.update(serviceOffering, request);
        return ServiceOfferingMapper.toResponse(serviceOffering);
    }

    @Transactional
    public void delete(Long id) {
        serviceOfferingRepository.delete(findServiceOffering(id));
    }

    ServiceOffering findServiceOffering(Long id) {
        return serviceOfferingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service offering not found: " + id));
    }
}