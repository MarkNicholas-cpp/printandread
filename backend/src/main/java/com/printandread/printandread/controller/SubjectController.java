package com.printandread.printandread.controller;

import com.printandread.printandread.dto.SubjectCreateRequest;
import com.printandread.printandread.dto.SubjectResponseDTO;
import com.printandread.printandread.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    
    private final SubjectService subjectService;
    
    @Autowired
    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }
    
    /**
     * GET /api/subjects
     * Get subjects with optional filters (Phase 2 enhanced)
     * 
     * Supports:
     * - Legacy: ?branchId=X&yearId=Y
     * - Phase 2: ?branchId=X&regulationId=Y&subBranchId=Z&yearId=W&semesterId=V
     * - All filters are optional
     */
    @GetMapping
    public ResponseEntity<List<SubjectResponseDTO>> getAllSubjects(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) Long regulationId,
            @RequestParam(required = false) Long subBranchId,
            @RequestParam(required = false) Long yearId,
            @RequestParam(required = false) Long semesterId) {
        
        // Phase 2: Use new filter method if any Phase 2 filter is provided
        if (regulationId != null || subBranchId != null || semesterId != null) {
            List<SubjectResponseDTO> subjects = subjectService.getSubjectDtosByFilters(
                    branchId, regulationId, subBranchId, yearId, semesterId);
            return ResponseEntity.ok(subjects);
        }
        
        // Legacy: If both branchId and yearId are provided, filter by both
        if (branchId != null && yearId != null) {
            List<SubjectResponseDTO> subjects = subjectService.getSubjectDtosByBranchAndYear(branchId, yearId);
            return ResponseEntity.ok(subjects);
        }
        
        // Otherwise, return all subjects
        List<SubjectResponseDTO> subjects = subjectService.getAllSubjectDtos();
        return ResponseEntity.ok(subjects);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> getSubjectById(@PathVariable Long id) {
        SubjectResponseDTO subject = subjectService.getSubjectDtoById(id);
        return ResponseEntity.ok(subject);
    }
    
    /**
     * POST /api/subjects
     * Create a new subject
     */
    @PostMapping
    public ResponseEntity<SubjectResponseDTO> createSubject(@RequestBody SubjectCreateRequest request) {
        SubjectResponseDTO subject = subjectService.createSubject(
            request.getName(),
            request.getCode(),
            request.getBranchId(),
            request.getRegulationId(),
            request.getYearId(),
            request.getSemesterId(),
            request.getSubBranchId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(subject);
    }
}
