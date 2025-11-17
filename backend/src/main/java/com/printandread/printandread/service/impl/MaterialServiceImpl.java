package com.printandread.printandread.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.printandread.printandread.dto.MaterialResponseDTO;
import com.printandread.printandread.dto.MaterialUploadRequest;
import com.printandread.printandread.entity.Material;
import com.printandread.printandread.entity.Subject;
import com.printandread.printandread.exception.ResourceNotFoundException;
import com.printandread.printandread.repository.MaterialRepository;
import com.printandread.printandread.repository.SubjectRepository;
import com.printandread.printandread.service.MaterialService;
import com.printandread.printandread.utils.SlugUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final SubjectRepository subjectRepository;
    private final Cloudinary cloudinary;

    @Autowired
    public MaterialServiceImpl(MaterialRepository materialRepository,
            SubjectRepository subjectRepository,
            Cloudinary cloudinary) {
        this.materialRepository = materialRepository;
        this.subjectRepository = subjectRepository;
        this.cloudinary = cloudinary;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Material> findAll() {
        return materialRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Material> findBySubjectId(Long subjectId) {
        return materialRepository.findBySubjectId(subjectId);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public Material findById(Long id) {
        return materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material", id));
    }

    @Override
    @SuppressWarnings("null")
    public Material save(Material material) {
        return materialRepository.save(material);
    }

    @Override
    @SuppressWarnings("null")
    public Material uploadMaterial(MaterialUploadRequest request, MultipartFile file) {
        // 1. Validate subject exists
        Long subjectId = request.getSubjectId();
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", subjectId));

        // Load branch and yearLevel (they are lazy-loaded, accessing them triggers
        // loading)
        String branchCode = subject.getBranch().getCode();
        Integer yearNumber = subject.getYearLevel().getYearNumber();

        // 2. Build structured Cloudinary folder path
        String folderPath = String.format(
                "materials/%s/year%d/%s/%s",
                branchCode,
                yearNumber,
                SlugUtil.toSlug(subject.getName()),
                SlugUtil.toSlug(request.getMaterialType()));

        try {
            // 3. Upload file to Cloudinary
            // Get original filename to preserve .pdf extension
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                originalFilename = "material_" + System.currentTimeMillis() + ".pdf";
            }

            // Ensure the file has a .pdf extension
            String finalFilename = originalFilename;
            if (!finalFilename.toLowerCase().endsWith(".pdf")) {
                finalFilename = finalFilename + ".pdf";
            }

            // Upload with correct Cloudinary configuration for PDFs
            @SuppressWarnings("unchecked")
            Map<String, Object> options = (Map<String, Object>) ObjectUtils.asMap(
                    "folder", folderPath, // e.g., materials/cse/year2/subject/notes
                    "resource_type", "raw", // The ONLY valid way to upload PDFs
                    "public_id", finalFilename // Only the filename, NOT the full path
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(
                    file.getBytes(), options);

            // Extract values
            String url = uploadResult.get("secure_url").toString();
            String publicId = uploadResult.get("public_id").toString();

            // 4. Save in DB
            Material material = new Material();
            material.setSubject(subject);
            material.setMaterialType(request.getMaterialType());
            material.setTitle(request.getTitle());
            material.setCloudinaryUrl(url);
            material.setPublicId(publicId);
            material.setFileType("pdf");
            // uploadedOn is auto-set by @CreationTimestamp

            return materialRepository.save(material);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Cloudinary", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaterialResponseDTO> getAllMaterialDtos() {
        return materialRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaterialResponseDTO> getMaterialDtosBySubjectId(Long subjectId) {
        return materialRepository.findBySubjectId(subjectId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MaterialResponseDTO getMaterialDtoById(Long id) {
        Material material = findById(id);
        return mapToDto(material);
    }

    @Override
    public MaterialResponseDTO uploadMaterialAndReturnDto(MaterialUploadRequest request, MultipartFile file) {
        Material material = uploadMaterial(request, file);
        return mapToDto(material);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaterialResponseDTO> getRecentMaterialDtos(int limit) {
        List<Material> materials = materialRepository.findAllOrderByUploadedOnDesc();
        return materials.stream()
                .limit(limit)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private MaterialResponseDTO mapToDto(Material material) {
        // Load lazy-loaded subject relationship
        Subject subject = material.getSubject();
        String subjectName = subject.getName();
        Long subjectId = subject.getId();

        return new MaterialResponseDTO(
                material.getId(),
                material.getTitle(),
                material.getMaterialType(),
                material.getCloudinaryUrl(),
                material.getUploadedOn(),
                subjectName,
                subjectId);
    }
}
