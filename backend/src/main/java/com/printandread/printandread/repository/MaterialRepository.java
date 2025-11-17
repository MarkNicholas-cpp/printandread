package com.printandread.printandread.repository;

import com.printandread.printandread.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findBySubjectId(Long subjectId);

    @Query("SELECT COUNT(m) FROM Material m WHERE m.subject.id = :subjectId")
    long countBySubjectId(@Param("subjectId") Long subjectId);

    @Query("SELECT m FROM Material m ORDER BY m.uploadedOn DESC")
    List<Material> findAllOrderByUploadedOnDesc();
}
