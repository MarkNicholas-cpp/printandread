package com.printandread.printandread.service;

import com.printandread.printandread.dto.MaterialResponseDTO;
import com.printandread.printandread.dto.MaterialUploadRequest;
import com.printandread.printandread.entity.Material;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface MaterialService {
    List<Material> findAll();
    List<Material> findBySubjectId(Long subjectId);
    Material findById(Long id);
    Material save(Material material);
    Material uploadMaterial(MaterialUploadRequest request, MultipartFile file);
    
    // DTO methods for API responses
    List<MaterialResponseDTO> getAllMaterialDtos();
    List<MaterialResponseDTO> getMaterialDtosBySubjectId(Long subjectId);
    MaterialResponseDTO getMaterialDtoById(Long id);
    MaterialResponseDTO uploadMaterialAndReturnDto(MaterialUploadRequest request, MultipartFile file);
}
