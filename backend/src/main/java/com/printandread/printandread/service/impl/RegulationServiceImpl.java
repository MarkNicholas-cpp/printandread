package com.printandread.printandread.service.impl;

import com.printandread.printandread.dto.RegulationResponseDTO;
import com.printandread.printandread.entity.Regulation;
import com.printandread.printandread.entity.YearLevel;
import com.printandread.printandread.entity.Semester;
import com.printandread.printandread.exception.ResourceNotFoundException;
import com.printandread.printandread.repository.RegulationRepository;
import com.printandread.printandread.repository.YearLevelRepository;
import com.printandread.printandread.repository.SemesterRepository;
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
    private final YearLevelRepository yearLevelRepository;
    private final SemesterRepository semesterRepository;
    
    @Autowired
    public RegulationServiceImpl(
            RegulationRepository regulationRepository,
            YearLevelRepository yearLevelRepository,
            SemesterRepository semesterRepository) {
        this.regulationRepository = regulationRepository;
        this.yearLevelRepository = yearLevelRepository;
        this.semesterRepository = semesterRepository;
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
    
    @Override
    public Regulation create(String name, String code, Integer startYear, Integer endYear, String description) {
        // Check if code already exists
        regulationRepository.findByCode(code).ifPresent(r -> {
            throw new RuntimeException("Regulation with code " + code + " already exists");
        });
        
        Regulation regulation = new Regulation();
        regulation.setName(name);
        regulation.setCode(code);
        regulation.setStartYear(startYear);
        regulation.setEndYear(endYear);
        regulation.setDescription(description);
        Regulation savedRegulation = regulationRepository.save(regulation);
        
        // Automatically create Years (1-4) and Semesters (2 per year: Year1->1,2; Year2->3,4; Year3->5,6; Year4->7,8) if they don't exist
        createYearsAndSemestersIfNotExist();
        
        return savedRegulation;
    }
    
    /**
     * Creates Years 1-4 and Semesters (2 per year) if they don't already exist
     * Year 1: Semesters 1, 2
     * Year 2: Semesters 3, 4
     * Year 3: Semesters 5, 6
     * Year 4: Semesters 7, 8
     */
    @SuppressWarnings("null")
    private void createYearsAndSemestersIfNotExist() {
        // Create Years 1-4 if they don't exist
        for (int yearNum = 1; yearNum <= 4; yearNum++) {
            final int yearNumber = yearNum;
            boolean yearExists = yearLevelRepository.findAll().stream()
                .anyMatch(y -> y.getYearNumber().equals(yearNumber));
            
            YearLevel savedYear;
            if (!yearExists) {
                YearLevel yearLevel = new YearLevel();
                yearLevel.setYearNumber(yearNumber);
                savedYear = yearLevelRepository.save(yearLevel);
            } else {
                // Year exists, get it
                savedYear = yearLevelRepository.findAll().stream()
                    .filter(y -> y.getYearNumber().equals(yearNumber))
                    .findFirst()
                    .orElse(null);
                
                if (savedYear == null) {
                    continue; // Skip if year not found (shouldn't happen)
                }
            }
            
            // Create 2 semesters for this year
            // Year 1: Semesters 1, 2
            // Year 2: Semesters 3, 4
            // Year 3: Semesters 5, 6
            // Year 4: Semesters 7, 8
            int firstSemester = (yearNumber - 1) * 2 + 1;
            int secondSemester = (yearNumber - 1) * 2 + 2;
            
            // Create first semester if it doesn't exist
            boolean firstSemExists = semesterRepository.findBySemNumberAndYearLevelId(firstSemester, savedYear.getId())
                .isPresent();
            if (!firstSemExists) {
                Semester semester1 = new Semester();
                semester1.setSemNumber(firstSemester);
                semester1.setYearLevel(savedYear);
                semesterRepository.save(semester1);
            }
            
            // Create second semester if it doesn't exist
            boolean secondSemExists = semesterRepository.findBySemNumberAndYearLevelId(secondSemester, savedYear.getId())
                .isPresent();
            if (!secondSemExists) {
                Semester semester2 = new Semester();
                semester2.setSemNumber(secondSemester);
                semester2.setYearLevel(savedYear);
                semesterRepository.save(semester2);
            }
        }
    }

    @Override
    public RegulationResponseDTO createRegulation(String name, String code, Integer startYear, Integer endYear, String description) {
        Regulation regulation = create(name, code, startYear, endYear, description);
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

