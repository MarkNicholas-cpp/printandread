package com.printandread.printandread.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubBranchResponseDTO {
    private Long id;
    private String name;
    private String code;
    private Long branchId;
    private String branchCode; // For convenience
    private String branchName; // For convenience
}

