package com.printandread.printandread.repository;

import com.printandread.printandread.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    
    // Find by ID with eager fetching for Phase 2 relationships
    @Query("SELECT DISTINCT s FROM Subject s " +
           "LEFT JOIN FETCH s.branch " +
           "LEFT JOIN FETCH s.yearLevel " +
           "LEFT JOIN FETCH s.regulation " +
           "LEFT JOIN FETCH s.semester " +
           "LEFT JOIN FETCH s.subBranch " +
           "WHERE s.id = :id")
    java.util.Optional<Subject> findByIdWithRelations(@Param("id") Long id);
    
    // Legacy method with eager fetching for Phase 2 relationships
    @Query("SELECT DISTINCT s FROM Subject s " +
           "LEFT JOIN FETCH s.branch " +
           "LEFT JOIN FETCH s.yearLevel " +
           "LEFT JOIN FETCH s.regulation " +
           "LEFT JOIN FETCH s.semester " +
           "LEFT JOIN FETCH s.subBranch " +
           "WHERE s.branch.id = :branchId AND s.yearLevel.id = :yearLevelId")
    List<Subject> findByBranchIdAndYearLevelId(@Param("branchId") Long branchId, @Param("yearLevelId") Long yearLevelId);
    
    // Phase 2: Custom query for filtering by multiple parameters with eager fetching
    @Query("SELECT DISTINCT s FROM Subject s " +
           "LEFT JOIN FETCH s.branch " +
           "LEFT JOIN FETCH s.yearLevel " +
           "LEFT JOIN FETCH s.regulation " +
           "LEFT JOIN FETCH s.semester " +
           "LEFT JOIN FETCH s.subBranch " +
           "WHERE " +
           "(:branchId IS NULL OR s.branch.id = :branchId) AND " +
           "(:regulationId IS NULL OR s.regulation.id = :regulationId) AND " +
           "(:subBranchId IS NULL OR s.subBranch.id = :subBranchId) AND " +
           "(:yearId IS NULL OR s.yearLevel.id = :yearId) AND " +
           "(:semesterId IS NULL OR s.semester.id = :semesterId)")
    List<Subject> findByFilters(
            @Param("branchId") Long branchId,
            @Param("regulationId") Long regulationId,
            @Param("subBranchId") Long subBranchId,
            @Param("yearId") Long yearId,
            @Param("semesterId") Long semesterId
    );
}

