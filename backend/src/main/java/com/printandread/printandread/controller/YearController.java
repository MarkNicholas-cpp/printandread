package com.printandread.printandread.controller;

import com.printandread.printandread.dto.YearLevelDTO;
import com.printandread.printandread.service.YearLevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/years")
public class YearController {
    
    private final YearLevelService yearLevelService;
    
    @Autowired
    public YearController(YearLevelService yearLevelService) {
        this.yearLevelService = yearLevelService;
    }
    
    @GetMapping
    public ResponseEntity<List<YearLevelDTO>> getAllYears() {
        List<YearLevelDTO> years = yearLevelService.getAllYearDtos();
        return ResponseEntity.ok(years);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<YearLevelDTO> getYearById(@PathVariable Long id) {
        YearLevelDTO yearLevel = yearLevelService.getYearDtoById(id);
        return ResponseEntity.ok(yearLevel);
    }
}
