package com.printandread.printandread.dto;

import lombok.Data;

@Data
public class MaterialUploadRequest {
    private Long subjectId;
    private String materialType;
    private String title;
}

