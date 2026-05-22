package com.altvia.salon.client;

import com.altvia.salon.client.dto.ClientCreateRequest;
import com.altvia.salon.client.dto.ClientResponse;
import com.altvia.salon.client.dto.ClientUpdateRequest;
import com.altvia.salon.common.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<ClientResponse> findAll() {
        return clientRepository.findAllByOrderByFullNameAsc()
                .stream()
                .map(ClientMapper::toResponse)
                .toList();
    }

    public ClientResponse findById(Long id) {
        return ClientMapper.toResponse(findClient(id));
    }

    @Transactional
    public ClientResponse create(ClientCreateRequest request) {
        Client client = ClientMapper.toEntity(request);
        Client savedClient = clientRepository.save(client);
        return ClientMapper.toResponse(savedClient);
    }

    @Transactional
    public ClientResponse update(Long id, ClientUpdateRequest request) {
        Client client = findClient(id);
        ClientMapper.update(client, request);
        return ClientMapper.toResponse(client);
    }

    @Transactional
    public void delete(Long id) {
        clientRepository.delete(findClient(id));
    }

    Client findClient(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + id));
    }
}