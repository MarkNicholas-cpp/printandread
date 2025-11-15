package com.printandread.printandread.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegulationResponseDTO {
    private Long id;
    private String name;
    private String code;
    private Integer startYear;
    private Integer endYear;
    private String description;
}

