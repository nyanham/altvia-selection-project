package com.altvia.salon.professional;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessionalRepository extends JpaRepository<Professional, Long> {

    List<Professional> findAllByOrderByFullNameAsc();
}