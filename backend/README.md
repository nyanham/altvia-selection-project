# Salon Scheduling Backend

Backend structure for a salon scheduling system built with Java 21, Spring Boot, PostgreSQL, and Maven.

## Structure

The backend follows a modular monolith with package-by-feature:

- `client`
- `professional`
- `serviceoffering`
- `appointment`
- `common`

Each feature contains its own controller, service, repository, entity, mapper, and DTOs.

## Main Decisions

- DTOs are used for every request and response.
- Controllers return `ResponseEntity` with explicit status codes.
- Services contain business rules and keep methods small.
- Repositories are focused on persistence queries only.
- Appointments block overlapping bookings for the same professional.

## Run

```bash
mvn spring-boot:run
```

The default datasource points to a local PostgreSQL instance:

- database: `salon_scheduling`
- username: `postgres`
- password: `postgres`
