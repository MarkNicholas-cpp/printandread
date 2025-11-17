package com.printandread.printandread.service.impl;

import com.printandread.printandread.dto.BranchResponseDTO;
import com.printandread.printandread.entity.Branch;
import com.printandread.printandread.exception.ResourceNotFoundException;
import com.printandread.printandread.repository.BranchRepository;
import com.printandread.printandread.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BranchServiceImpl implements BranchService {
    
    private final BranchRepository branchRepository;
    
    @Autowired
    public BranchServiceImpl(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Branch> findAll() {
        return branchRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public Branch findById(Long id) {
        return branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BranchResponseDTO> getAllBranchDtos() {
        return branchRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public BranchResponseDTO getBranchDtoById(Long id) {
        Branch branch = findById(id);
        return mapToDto(branch);
    }
    
    @Override
    public Branch create(String name, String code) {
        // Check if branch with same code already exists
        branchRepository.findByCode(code.toUpperCase())
            .ifPresent(existing -> {
                throw new IllegalArgumentException("Branch with code '" + code + "' already exists");
            });
        
        Branch branch = new Branch();
        branch.setName(name.trim());
        branch.setCode(code.trim().toUpperCase());
        
        return branchRepository.save(branch);
    }

    @Override
    public BranchResponseDTO createBranch(String name, String code) {
        Branch branch = create(name, code);
        return mapToDto(branch);
    }
    
    private BranchResponseDTO mapToDto(Branch branch) {
        return new BranchResponseDTO(
                branch.getId(),
                branch.getName(),
                branch.getCode()
        );
    }
}

