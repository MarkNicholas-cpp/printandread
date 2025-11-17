package com.printandread.printandread.service;

import com.printandread.printandread.dto.RegulationResponseDTO;
import com.printandread.printandread.entity.Regulation;
import java.util.List;

public interface RegulationService {
    List<Regulation> findAll();
    Regulation findById(Long id);
    Regulation findByCode(String code);
    Regulation create(String name, String code, Integer startYear, Integer endYear, String description);
    
    // DTO methods for API responses
    List<RegulationResponseDTO> getAllRegulationDtos();
    RegulationResponseDTO getRegulationDtoById(Long id);
    RegulationResponseDTO getRegulationDtoByCode(String code);
    RegulationResponseDTO createRegulation(String name, String code, Integer startYear, Integer endYear, String description);
}

