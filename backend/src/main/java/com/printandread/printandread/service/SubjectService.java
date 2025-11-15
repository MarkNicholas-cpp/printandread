package com.printandread.printandread.service;

import com.printandread.printandread.dto.SubjectResponseDTO;
import com.printandread.printandread.entity.Subject;
import java.util.List;

public interface SubjectService {
    List<Subject> findAll();
    List<Subject> findByBranchIdAndYearId(Long branchId, Long yearId);
    Subject findById(Long id);
    
    // Phase 2: New filter methods
    List<Subject> findByFilters(Long branchId, Long regulationId, Long subBranchId, Long yearId, Long semesterId);
    
    // DTO methods for API responses
    List<SubjectResponseDTO> getAllSubjectDtos();
    List<SubjectResponseDTO> getSubjectDtosByBranchAndYear(Long branchId, Long yearId);
    
    // Phase 2: New DTO filter methods
    List<SubjectResponseDTO> getSubjectDtosByFilters(Long branchId, Long regulationId, Long subBranchId, Long yearId, Long semesterId);
    
    SubjectResponseDTO getSubjectDtoById(Long id);
}

