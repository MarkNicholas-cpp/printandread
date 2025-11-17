package com.printandread.printandread.service;

import com.printandread.printandread.dto.BranchResponseDTO;
import com.printandread.printandread.entity.Branch;
import java.util.List;

public interface BranchService {
    List<Branch> findAll();
    Branch findById(Long id);
    
    // DTO methods for API responses
    List<BranchResponseDTO> getAllBranchDtos();
    BranchResponseDTO getBranchDtoById(Long id);
    
    // Create methods
    Branch create(String name, String code);
    BranchResponseDTO createBranch(String name, String code);
}
