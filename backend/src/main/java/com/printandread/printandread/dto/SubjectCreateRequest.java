package com.printandread.printandread.dto;

import lombok.Data;

@Data
public class SubjectCreateRequest {
    private String name;
    private String code;
    private Long branchId;
    private Long regulationId;
    private Long yearId;
    private Long semesterId;
    private Long subBranchId; // Optional
}

