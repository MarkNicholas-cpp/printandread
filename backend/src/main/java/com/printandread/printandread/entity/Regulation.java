package com.printandread.printandread.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "regulation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Regulation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name; // e.g., "Regulation 2022"
    
    @Column(name = "code", nullable = false, unique = true, length = 20)
    private String code; // e.g., "R22"
    
    @Column(name = "start_year", nullable = false)
    private Integer startYear; // e.g., 2022
    
    @Column(name = "end_year")
    private Integer endYear; // nullable, for regulations that are no longer active
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // optional description
}

