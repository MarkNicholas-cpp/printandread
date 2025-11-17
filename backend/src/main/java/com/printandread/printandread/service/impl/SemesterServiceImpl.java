package com.printandread.printandread.service.impl;

import com.printandread.printandread.dto.SemesterResponseDTO;
import com.printandread.printandread.entity.Semester;
import com.printandread.printandread.entity.YearLevel;
import com.printandread.printandread.exception.ResourceNotFoundException;
import com.printandread.printandread.repository.SemesterRepository;
import com.printandread.printandread.repository.YearLevelRepository;
import com.printandread.printandread.service.SemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SemesterServiceImpl implements SemesterService {
    
    private final SemesterRepository semesterRepository;
    private final YearLevelRepository yearLevelRepository;
    
    @Autowired
    public SemesterServiceImpl(SemesterRepository semesterRepository, YearLevelRepository yearLevelRepository) {
        this.semesterRepository = semesterRepository;
        this.yearLevelRepository = yearLevelRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Semester> findAll() {
        return semesterRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public Semester findById(Long id) {
        return semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Semester> findByYearId(Long yearId) {
        return semesterRepository.findByYearLevelId(yearId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Semester> findByYearNumber(Integer yearNumber) {
        return semesterRepository.findByYearLevel_YearNumber(yearNumber);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SemesterResponseDTO> getAllSemesterDtos() {
        return semesterRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SemesterResponseDTO> getSemesterDtosByYearId(Long yearId) {
        return semesterRepository.findByYearLevelId(yearId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SemesterResponseDTO> getSemesterDtosByYearNumber(Integer yearNumber) {
        return semesterRepository.findByYearLevel_YearNumber(yearNumber).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public SemesterResponseDTO getSemesterDtoById(Long id) {
        Semester semester = findById(id);
        return mapToDto(semester);
    }
    
    @Override
    public Semester create(Integer semNumber, Long yearId) {
        // Check if semester already exists for this year
        semesterRepository.findBySemNumberAndYearLevelId(semNumber, yearId).ifPresent(s -> {
            throw new RuntimeException("Semester " + semNumber + " already exists for this year");
        });
        
        @SuppressWarnings("null")
        YearLevel yearLevel = yearLevelRepository.findById(yearId)
            .orElseThrow(() -> new ResourceNotFoundException("YearLevel", yearId));
        
        Semester semester = new Semester();
        semester.setSemNumber(semNumber);
        semester.setYearLevel(yearLevel);
        return semesterRepository.save(semester);
    }

    @Override
    public SemesterResponseDTO createSemester(Integer semNumber, Long yearId) {
        Semester semester = create(semNumber, yearId);
        return mapToDto(semester);
    }

    private SemesterResponseDTO mapToDto(Semester semester) {
        // Load lazy-loaded yearLevel relationship
        Long yearId = semester.getYearLevel().getId();
        Integer yearNumber = semester.getYearLevel().getYearNumber();
        String displayName = semester.getDisplayName();
        
        return new SemesterResponseDTO(
                semester.getId(),
                semester.getSemNumber(),
                yearId,
                yearNumber,
                displayName
        );
    }
}

