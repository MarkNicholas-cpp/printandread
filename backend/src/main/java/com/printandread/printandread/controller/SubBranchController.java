package com.printandread.printandread.controller;

import com.printandread.printandread.dto.SubBranchResponseDTO;
import com.printandread.printandread.service.SubBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sub-branches")
public class SubBranchController {
    
    private final SubBranchService subBranchService;
    
    @Autowired
    public SubBranchController(SubBranchService subBranchService) {
        this.subBranchService = subBranchService;
    }
    
    /**
     * GET /api/sub-branches?branchId=X
     * Get sub-branches for a specific branch
     */
    @GetMapping
    public ResponseEntity<List<SubBranchResponseDTO>> getSubBranches(
            @RequestParam(required = false) Long branchId) {
        
        if (branchId != null) {
            List<SubBranchResponseDTO> subBranches = subBranchService.getSubBranchDtosByBranchId(branchId);
            return ResponseEntity.ok(subBranches);
        }
        
        // If no branchId provided, return all sub-branches
        List<SubBranchResponseDTO> subBranches = subBranchService.getAllSubBranchDtos();
        return ResponseEntity.ok(subBranches);
    }
    
    /**
     * GET /api/sub-branches/{id}
     * Get sub-branch by id
     */
    @GetMapping("/{id}")
    public ResponseEntity<SubBranchResponseDTO> getSubBranchById(@PathVariable Long id) {
        SubBranchResponseDTO subBranch = subBranchService.getSubBranchDtoById(id);
        return ResponseEntity.ok(subBranch);
    }
}

