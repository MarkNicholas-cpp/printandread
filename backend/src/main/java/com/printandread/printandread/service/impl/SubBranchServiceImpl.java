package com.printandread.printandread.service.impl;

import com.printandread.printandread.dto.SubBranchResponseDTO;
import com.printandread.printandread.entity.SubBranch;
import com.printandread.printandread.exception.ResourceNotFoundException;
import com.printandread.printandread.repository.SubBranchRepository;
import com.printandread.printandread.service.SubBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SubBranchServiceImpl implements SubBranchService {
    
    private final SubBranchRepository subBranchRepository;
    
    @Autowired
    public SubBranchServiceImpl(SubBranchRepository subBranchRepository) {
        this.subBranchRepository = subBranchRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SubBranch> findAll() {
        return subBranchRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public SubBranch findById(Long id) {
        return subBranchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubBranch", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SubBranch> findByBranchId(Long branchId) {
        return subBranchRepository.findByBranchId(branchId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SubBranchResponseDTO> getAllSubBranchDtos() {
        return subBranchRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SubBranchResponseDTO> getSubBranchDtosByBranchId(Long branchId) {
        return subBranchRepository.findByBranchId(branchId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public SubBranchResponseDTO getSubBranchDtoById(Long id) {
        SubBranch subBranch = findById(id);
        return mapToDto(subBranch);
    }
    
    private SubBranchResponseDTO mapToDto(SubBranch subBranch) {
        // Load lazy-loaded branch relationship
        Long branchId = subBranch.getBranch().getId();
        String branchCode = subBranch.getBranch().getCode();
        String branchName = subBranch.getBranch().getName();
        
        return new SubBranchResponseDTO(
                subBranch.getId(),
                subBranch.getName(),
                subBranch.getCode(),
                branchId,
                branchCode,
                branchName
        );
    }
}

