package com.printandread.printandread.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.printandread.printandread.dto.MaterialResponseDTO;
import com.printandread.printandread.dto.MaterialUploadRequest;
import com.printandread.printandread.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialService materialService;

    @Autowired
    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MaterialResponseDTO> uploadMaterial(
            @RequestParam("data") String dataJson,
            @RequestParam("file") MultipartFile file) {

        try {
            // Parse JSON string to MaterialUploadRequest
            ObjectMapper objectMapper = new ObjectMapper();
            MaterialUploadRequest request = objectMapper.readValue(dataJson, MaterialUploadRequest.class);

            MaterialResponseDTO saved = materialService.uploadMaterialAndReturnDto(request, file);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse request data: " + e.getMessage(), e);
        }
    }

    @GetMapping
    public ResponseEntity<List<MaterialResponseDTO>> getAllMaterials(
            @RequestParam(required = false) Long subjectId) {

        if (subjectId != null) {
            List<MaterialResponseDTO> materials = materialService.getMaterialDtosBySubjectId(subjectId);
            return ResponseEntity.ok(materials);
        }

        List<MaterialResponseDTO> materials = materialService.getAllMaterialDtos();
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> getMaterialById(@PathVariable Long id) {
        MaterialResponseDTO material = materialService.getMaterialDtoById(id);
        return ResponseEntity.ok(material);
    }
}
