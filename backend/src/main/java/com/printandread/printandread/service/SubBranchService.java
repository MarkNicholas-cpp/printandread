package com.printandread.printandread.service;

import com.printandread.printandread.dto.SubBranchResponseDTO;
import com.printandread.printandread.entity.SubBranch;
import java.util.List;

public interface SubBranchService {
    List<SubBranch> findAll();
    SubBranch findById(Long id);
    List<SubBranch> findByBranchId(Long branchId);
    
    // DTO methods for API responses
    List<SubBranchResponseDTO> getAllSubBranchDtos();
    List<SubBranchResponseDTO> getSubBranchDtosByBranchId(Long branchId);
    SubBranchResponseDTO getSubBranchDtoById(Long id);
}

