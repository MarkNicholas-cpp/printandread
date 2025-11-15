package com.printandread.printandread.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "material")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    @Column(name = "material_type", nullable = false, length = 50)
    private String materialType;
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "cloudinary_url", nullable = false, columnDefinition = "TEXT")
    private String cloudinaryUrl;
    
    @Column(name = "public_id", nullable = false, columnDefinition = "TEXT")
    private String publicId;
    
    @Column(name = "file_type", nullable = false, length = 20)
    private String fileType = "pdf";
    
    @CreationTimestamp
    @Column(name = "uploaded_on", nullable = false, updatable = false)
    private LocalDateTime uploadedOn;
}

