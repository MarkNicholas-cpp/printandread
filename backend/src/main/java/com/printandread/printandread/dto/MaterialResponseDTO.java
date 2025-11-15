package com.printandread.printandread.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialResponseDTO {
    private Long id;
    private String title;
    private String materialType;
    private String cloudinaryUrl;
    private LocalDateTime uploadedOn;
    private String subjectName;
    private Long subjectId;
}

