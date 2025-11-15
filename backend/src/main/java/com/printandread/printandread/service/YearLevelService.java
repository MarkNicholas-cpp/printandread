package com.printandread.printandread.service;

import com.printandread.printandread.dto.YearLevelDTO;
import com.printandread.printandread.entity.YearLevel;
import java.util.List;

public interface YearLevelService {
    List<YearLevel> findAll();
    YearLevel findById(Long id);
    
    // DTO methods for API responses
    List<YearLevelDTO> getAllYearDtos();
    YearLevelDTO getYearDtoById(Long id);
}

