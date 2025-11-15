package com.printandread.printandread.service;

import com.printandread.printandread.dto.SemesterResponseDTO;
import com.printandread.printandread.entity.Semester;
import java.util.List;

public interface SemesterService {
    List<Semester> findAll();
    Semester findById(Long id);
    List<Semester> findByYearId(Long yearId);
    List<Semester> findByYearNumber(Integer yearNumber);
    
    // DTO methods for API responses
    List<SemesterResponseDTO> getAllSemesterDtos();
    List<SemesterResponseDTO> getSemesterDtosByYearId(Long yearId);
    List<SemesterResponseDTO> getSemesterDtosByYearNumber(Integer yearNumber);
    SemesterResponseDTO getSemesterDtoById(Long id);
}

