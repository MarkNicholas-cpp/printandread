package com.printandread.printandread.controller;

import com.printandread.printandread.dto.RegulationResponseDTO;
import com.printandread.printandread.service.RegulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regulations")
public class RegulationController {
    
    private final RegulationService regulationService;
    
    @Autowired
    public RegulationController(RegulationService regulationService) {
        this.regulationService = regulationService;
    }
    
    /**
     * GET /api/regulations
     * List all regulations
     */
    @GetMapping
    public ResponseEntity<List<RegulationResponseDTO>> getAllRegulations() {
        List<RegulationResponseDTO> regulations = regulationService.getAllRegulationDtos();
        return ResponseEntity.ok(regulations);
    }
    
    /**
     * GET /api/regulations/{id}
     * Get regulation by id
     */
    @GetMapping("/{id}")
    public ResponseEntity<RegulationResponseDTO> getRegulationById(@PathVariable Long id) {
        RegulationResponseDTO regulation = regulationService.getRegulationDtoById(id);
        return ResponseEntity.ok(regulation);
    }
    
    /**
     * GET /api/regulations/code/{code}
     * Get regulation by code (e.g., R20, R22)
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<RegulationResponseDTO> getRegulationByCode(@PathVariable String code) {
        RegulationResponseDTO regulation = regulationService.getRegulationDtoByCode(code);
        return ResponseEntity.ok(regulation);
    }
}

