package com.altvia.salon.client;

import com.altvia.salon.client.dto.ClientCreateRequest;
import com.altvia.salon.client.dto.ClientResponse;
import com.altvia.salon.client.dto.ClientSummaryResponse;
import com.altvia.salon.client.dto.ClientUpdateRequest;

final class ClientMapper {

    private ClientMapper() {
    }

    static Client toEntity(ClientCreateRequest request) {
        return new Client(
                request.fullName(),
                request.phone(),
                request.email(),
                request.notes());
    }

    static void update(Client client, ClientUpdateRequest request) {
        client.updateDetails(
                request.fullName(),
                request.phone(),
                request.email(),
                request.notes());
    }

    static ClientResponse toResponse(Client client) {
        return new ClientResponse(
                client.getId(),
                client.getFullName(),
                client.getPhone(),
                client.getEmail(),
                client.getNotes(),
                client.isActive(),
                client.getCreatedAt(),
                client.getUpdatedAt());
    }

    static ClientSummaryResponse toSummary(Client client) {
        return new ClientSummaryResponse(client.getId(), client.getFullName());
    }
}