package com.printandread.printandread.controller;

import com.printandread.printandread.dto.SemesterResponseDTO;
import com.printandread.printandread.service.SemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/semesters")
public class SemesterController {
    
    private final SemesterService semesterService;
    
    @Autowired
    public SemesterController(SemesterService semesterService) {
        this.semesterService = semesterService;
    }
    
    /**
     * GET /api/semesters/year/{yearId}
     * Get semesters for a specific year by year ID
     */
    @GetMapping("/year/{yearId}")
    public ResponseEntity<List<SemesterResponseDTO>> getSemestersByYearId(@PathVariable Long yearId) {
        List<SemesterResponseDTO> semesters = semesterService.getSemesterDtosByYearId(yearId);
        return ResponseEntity.ok(semesters);
    }
    
    /**
     * GET /api/semesters/year-number/{yearNumber}
     * Get semesters by year number (1, 2, 3, 4)
     */
    @GetMapping("/year-number/{yearNumber}")
    public ResponseEntity<List<SemesterResponseDTO>> getSemestersByYearNumber(@PathVariable Integer yearNumber) {
        List<SemesterResponseDTO> semesters = semesterService.getSemesterDtosByYearNumber(yearNumber);
        return ResponseEntity.ok(semesters);
    }
}

