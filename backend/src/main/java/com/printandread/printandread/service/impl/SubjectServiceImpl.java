package com.printandread.printandread.service.impl;

import com.printandread.printandread.dto.SubjectResponseDTO;
import com.printandread.printandread.entity.Subject;
import com.printandread.printandread.exception.ResourceNotFoundException;
import com.printandread.printandread.repository.MaterialRepository;
import com.printandread.printandread.repository.SubjectRepository;
import com.printandread.printandread.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final MaterialRepository materialRepository;

    @Autowired
    public SubjectServiceImpl(SubjectRepository subjectRepository, MaterialRepository materialRepository) {
        this.subjectRepository = subjectRepository;
        this.materialRepository = materialRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Subject> findAll() {
        return subjectRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Subject> findByBranchIdAndYearId(Long branchId, Long yearId) {
        return subjectRepository.findByBranchIdAndYearLevelId(branchId, yearId);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public Subject findById(Long id) {
        return subjectRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectResponseDTO> getAllSubjectDtos() {
        // Use custom query with eager fetching instead of findAll()
        return subjectRepository.findByFilters(null, null, null, null, null).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectResponseDTO> getSubjectDtosByBranchAndYear(Long branchId, Long yearId) {
        return subjectRepository.findByBranchIdAndYearLevelId(branchId, yearId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Subject> findByFilters(Long branchId, Long regulationId, Long subBranchId, Long yearId,
            Long semesterId) {
        return subjectRepository.findByFilters(branchId, regulationId, subBranchId, yearId, semesterId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectResponseDTO> getSubjectDtosByFilters(Long branchId, Long regulationId, Long subBranchId,
            Long yearId, Long semesterId) {
        return subjectRepository.findByFilters(branchId, regulationId, subBranchId, yearId, semesterId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectResponseDTO getSubjectDtoById(Long id) {
        Subject subject = findById(id);
        return mapToDto(subject);
    }

    private SubjectResponseDTO mapToDto(Subject subject) {
        // Load lazy-loaded relationships (now eagerly fetched via JOIN FETCH)
        String branchCode = subject.getBranch().getCode();
        String branchName = subject.getBranch().getName();
        Integer yearNumber = subject.getYearLevel().getYearNumber();

        // Phase 2: Load regulation relationship (required, should not be null)
        Long regulationId = null;
        String regulationCode = null;
        String regulationName = null;
        if (subject.getRegulation() != null) {
            regulationId = subject.getRegulation().getId();
            regulationCode = subject.getRegulation().getCode();
            regulationName = subject.getRegulation().getName();
        }

        // Phase 2: Load semester relationship (required, should not be null)
        Integer semNumber = null;
        String semesterDisplayName = null;
        if (subject.getSemester() != null) {
            semNumber = subject.getSemester().getSemNumber();
            semesterDisplayName = subject.getSemester().getDisplayName();
        }

        // Phase 2: Load subBranch relationship (optional)
        Long subBranchId = null;
        String subBranchCode = null;
        String subBranchName = null;
        if (subject.getSubBranch() != null) {
            subBranchId = subject.getSubBranch().getId();
            subBranchCode = subject.getSubBranch().getCode();
            subBranchName = subject.getSubBranch().getName();
        }

        // Count materials for this subject
        Long materialCount = materialRepository.countBySubjectId(subject.getId());

        return new SubjectResponseDTO(
                subject.getId(),
                subject.getName(),
                subject.getCode(),
                branchCode,
                branchName,
                yearNumber,
                semNumber,
                semesterDisplayName,
                regulationId,
                regulationCode,
                regulationName,
                subBranchId,
                subBranchCode,
                subBranchName,
                materialCount);
    }
}
