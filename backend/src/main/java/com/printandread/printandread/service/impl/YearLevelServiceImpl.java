package com.printandread.printandread.service.impl;

import com.printandread.printandread.dto.YearLevelDTO;
import com.printandread.printandread.entity.YearLevel;
import com.printandread.printandread.exception.ResourceNotFoundException;
import com.printandread.printandread.repository.YearLevelRepository;
import com.printandread.printandread.service.YearLevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class YearLevelServiceImpl implements YearLevelService {
    
    private final YearLevelRepository yearLevelRepository;
    
    @Autowired
    public YearLevelServiceImpl(YearLevelRepository yearLevelRepository) {
        this.yearLevelRepository = yearLevelRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<YearLevel> findAll() {
        return yearLevelRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public YearLevel findById(Long id) {
        return yearLevelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("YearLevel", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<YearLevelDTO> getAllYearDtos() {
        // Filter out duplicates by year_number, keeping only one record per year
        return yearLevelRepository.findAll().stream()
                .collect(Collectors.toMap(
                    YearLevel::getYearNumber,
                    this::mapToDto,
                    (existing, replacement) -> existing // Keep first occurrence if duplicates exist
                ))
                .values()
                .stream()
                .sorted((a, b) -> Integer.compare(a.getYearNumber(), b.getYearNumber()))
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public YearLevelDTO getYearDtoById(Long id) {
        YearLevel yearLevel = findById(id);
        return mapToDto(yearLevel);
    }
    
    @Override
    public YearLevel create(Integer yearNumber) {
        // Check if year already exists
        yearLevelRepository.findAll().stream()
            .filter(y -> y.getYearNumber().equals(yearNumber))
            .findFirst()
            .ifPresent(y -> {
                throw new RuntimeException("Year " + yearNumber + " already exists");
            });
        
        YearLevel yearLevel = new YearLevel();
        yearLevel.setYearNumber(yearNumber);
        return yearLevelRepository.save(yearLevel);
    }

    @Override
    public YearLevelDTO createYear(Integer yearNumber) {
        YearLevel yearLevel = create(yearNumber);
        return mapToDto(yearLevel);
    }

    private YearLevelDTO mapToDto(YearLevel yearLevel) {
        return new YearLevelDTO(
                yearLevel.getId(),
                yearLevel.getYearNumber()
        );
    }
}

