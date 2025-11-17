package com.printandread.printandread.dto;

import lombok.Data;

@Data
public class RegulationCreateRequest {
    private String name;
    private String code;
    private Integer startYear;
    private Integer endYear;
    private String description;
}

