create table clients (
    id bigserial primary key,
    full_name varchar(120) not null,
    phone varchar(20) not null,
    email varchar(120),
    notes varchar(500),
    active boolean not null,
    created_at timestamp not null,
    updated_at timestamp not null
);

create table professionals (
    id bigserial primary key,
    full_name varchar(120) not null,
    phone varchar(20) not null,
    email varchar(120),
    specialty varchar(120) not null,
    color_hex varchar(7) not null,
    active boolean not null,
    created_at timestamp not null,
    updated_at timestamp not null
);

create table service_offerings (
    id bigserial primary key,
    name varchar(120) not null,
    description varchar(500),
    duration_minutes integer not null,
    price numeric(10, 2) not null,
    active boolean not null,
    created_at timestamp not null,
    updated_at timestamp not null
);

create table appointments (
    id bigserial primary key,
    client_id bigint not null,
    professional_id bigint not null,
    service_offering_id bigint not null,
    start_at timestamp not null,
    end_at timestamp not null,
    status varchar(20) not null,
    notes varchar(500),
    created_at timestamp not null,
    updated_at timestamp not null,
    constraint fk_appointments_client foreign key (client_id) references clients (id),
    constraint fk_appointments_professional foreign key (professional_id) references professionals (id),
    constraint fk_appointments_service_offering foreign key (service_offering_id) references service_offerings (id)
);

create index idx_appointments_start_at on appointments (start_at);
create index idx_appointments_professional_start_at on appointments (professional_id, start_at);