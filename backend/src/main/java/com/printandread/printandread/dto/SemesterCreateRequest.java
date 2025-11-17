package com.printandread.printandread.dto;

import lombok.Data;

@Data
public class SemesterCreateRequest {
    private Integer semNumber;
    private Long yearId;
}

