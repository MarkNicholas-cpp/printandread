package com.printandread.printandread.controller;

import com.printandread.printandread.dto.BranchCreateRequest;
import com.printandread.printandread.dto.BranchResponseDTO;
import com.printandread.printandread.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
public class BranchController {
    
    private final BranchService branchService;
    
    @Autowired
    public BranchController(BranchService branchService) {
        this.branchService = branchService;
    }
    
    @GetMapping
    public ResponseEntity<List<BranchResponseDTO>> getAllBranches() {
        List<BranchResponseDTO> branches = branchService.getAllBranchDtos();
        return ResponseEntity.ok(branches);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BranchResponseDTO> getBranchById(@PathVariable Long id) {
        BranchResponseDTO branch = branchService.getBranchDtoById(id);
        return ResponseEntity.ok(branch);
    }
    
    @PostMapping
    public ResponseEntity<BranchResponseDTO> createBranch(@RequestBody BranchCreateRequest request) {
        BranchResponseDTO branch = branchService.createBranch(
            request.getName(),
            request.getCode()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(branch);
    }
}
