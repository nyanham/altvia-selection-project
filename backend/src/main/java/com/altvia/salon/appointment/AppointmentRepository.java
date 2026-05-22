package com.altvia.salon.appointment;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

        List<Appointment> findAllByOrderByStartAtDesc();

        @Query("""
                        select case when count(a) > 0 then true else false end
                        from Appointment a
                        where a.professional.id = :professionalId
                          and (:appointmentId is null or a.id <> :appointmentId)
                          and a.status <> :canceledStatus
                          and a.startAt < :endAt
                          and a.endAt > :startAt
                        """)
        boolean existsConflict(
                        @Param("professionalId") Long professionalId,
                        @Param("appointmentId") Long appointmentId,
                        @Param("canceledStatus") AppointmentStatus canceledStatus,
                        @Param("startAt") LocalDateTime startAt,
                        @Param("endAt") LocalDateTime endAt);

        @Query("""
                        select a
                        from Appointment a
                        where a.startAt < :endAt
                          and a.endAt > :startAt
                          and (:professionalId is null or a.professional.id = :professionalId)
                        order by a.startAt
                        """)
        List<Appointment> findCalendarItems(
                        @Param("startAt") LocalDateTime startAt,
                        @Param("endAt") LocalDateTime endAt,
                        @Param("professionalId") Long professionalId);
}