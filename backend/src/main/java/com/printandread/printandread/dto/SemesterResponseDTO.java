package com.printandread.printandread.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SemesterResponseDTO {
    private Long id;
    private Integer semNumber;
    private Long yearId;
    private Integer yearNumber; // For convenience
    private String displayName; // e.g., "Semester 1"
}

