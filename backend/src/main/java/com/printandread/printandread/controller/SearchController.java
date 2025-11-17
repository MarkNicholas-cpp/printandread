package com.printandread.printandread.controller;

import com.printandread.printandread.dto.BranchResponseDTO;
import com.printandread.printandread.dto.MaterialResponseDTO;
import com.printandread.printandread.dto.RegulationResponseDTO;
import com.printandread.printandread.dto.SubjectResponseDTO;
import com.printandread.printandread.service.BranchService;
import com.printandread.printandread.service.MaterialService;
import com.printandread.printandread.service.RegulationService;
import com.printandread.printandread.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SubjectService subjectService;
    private final MaterialService materialService;
    private final BranchService branchService;
    private final RegulationService regulationService;

    @Autowired
    public SearchController(
            SubjectService subjectService,
            MaterialService materialService,
            BranchService branchService,
            RegulationService regulationService) {
        this.subjectService = subjectService;
        this.materialService = materialService;
        this.branchService = branchService;
        this.regulationService = regulationService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> search(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            Map<String, Object> emptyResult = new HashMap<>();
            emptyResult.put("subjects", List.of());
            emptyResult.put("materials", List.of());
            emptyResult.put("branches", List.of());
            emptyResult.put("regulations", List.of());
            return ResponseEntity.ok(emptyResult);
        }

        String searchTerm = q.trim().toLowerCase();

        // Search subjects (by name or code)
        List<SubjectResponseDTO> subjects = subjectService.getAllSubjectDtos().stream()
                .filter(s -> s.getName().toLowerCase().contains(searchTerm) ||
                        s.getCode().toLowerCase().contains(searchTerm))
                .limit(10)
                .collect(Collectors.toList());

        // Search materials (by title)
        List<MaterialResponseDTO> materials = materialService.getAllMaterialDtos().stream()
                .filter(m -> m.getTitle().toLowerCase().contains(searchTerm))
                .limit(10)
                .collect(Collectors.toList());

        // Search branches (by name or code)
        List<BranchResponseDTO> branches = branchService.getAllBranchDtos().stream()
                .filter(b -> b.getName().toLowerCase().contains(searchTerm) ||
                        b.getCode().toLowerCase().contains(searchTerm))
                .limit(10)
                .collect(Collectors.toList());

        // Search regulations (by name or code)
        List<RegulationResponseDTO> regulations = regulationService.getAllRegulationDtos().stream()
                .filter(r -> r.getName().toLowerCase().contains(searchTerm) ||
                        r.getCode().toLowerCase().contains(searchTerm))
                .limit(10)
                .collect(Collectors.toList());

        Map<String, Object> results = new HashMap<>();
        results.put("subjects", subjects);
        results.put("materials", materials);
        results.put("branches", branches);
        results.put("regulations", regulations);
        results.put("query", q);

        return ResponseEntity.ok(results);
    }
}
