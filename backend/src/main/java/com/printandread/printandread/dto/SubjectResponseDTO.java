package com.printandread.printandread.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResponseDTO {
    private Long id;
    private String name;
    private String code;
    
    // Branch information
    private String branchCode;
    private String branchName;
    
    // Year and Semester information
    private Integer yearNumber;
    private Integer semNumber; // Phase 2: Semester number (1-8)
    private String semesterDisplayName; // e.g., "Semester 1"
    
    // Regulation information (Phase 2)
    private Long regulationId;
    private String regulationCode; // e.g., "R22"
    private String regulationName; // e.g., "Regulation 2022"
    
    // SubBranch information (Phase 2 - optional)
    private Long subBranchId;
    private String subBranchCode; // e.g., "CSE-AIML"
    private String subBranchName; // e.g., "CSE - Artificial Intelligence & Machine Learning"
    
    // Material count
    private Long materialCount; // Number of materials available for this subject
}

