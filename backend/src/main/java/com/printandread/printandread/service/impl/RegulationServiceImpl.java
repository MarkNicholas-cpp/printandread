package com.printandread.printandread.service.impl;

import com.printandread.printandread.dto.RegulationResponseDTO;
import com.printandread.printandread.entity.Regulation;
import com.printandread.printandread.exception.ResourceNotFoundException;
import com.printandread.printandread.repository.RegulationRepository;
import com.printandread.printandread.service.RegulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RegulationServiceImpl implements RegulationService {
    
    private final RegulationRepository regulationRepository;
    
    @Autowired
    public RegulationServiceImpl(RegulationRepository regulationRepository) {
        this.regulationRepository = regulationRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Regulation> findAll() {
        return regulationRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public Regulation findById(Long id) {
        return regulationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Regulation", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public Regulation findByCode(String code) {
        return regulationRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Regulation", code));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RegulationResponseDTO> getAllRegulationDtos() {
        return regulationRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public RegulationResponseDTO getRegulationDtoById(Long id) {
        Regulation regulation = findById(id);
        return mapToDto(regulation);
    }
    
    @Override
    @Transactional(readOnly = true)
    public RegulationResponseDTO getRegulationDtoByCode(String code) {
        Regulation regulation = findByCode(code);
        return mapToDto(regulation);
    }
    
    private RegulationResponseDTO mapToDto(Regulation regulation) {
        return new RegulationResponseDTO(
                regulation.getId(),
                regulation.getName(),
                regulation.getCode(),
                regulation.getStartYear(),
                regulation.getEndYear(),
                regulation.getDescription()
        );
    }
}

