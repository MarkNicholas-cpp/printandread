package com.printandread.printandread.service.impl;

import com.printandread.printandread.dto.SemesterResponseDTO;
import com.printandread.printandread.entity.Semester;
import com.printandread.printandread.exception.ResourceNotFoundException;
import com.printandread.printandread.repository.SemesterRepository;
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
    
    @Autowired
    public SemesterServiceImpl(SemesterRepository semesterRepository) {
        this.semesterRepository = semesterRepository;
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

