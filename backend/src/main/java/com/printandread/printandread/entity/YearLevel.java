package com.printandread.printandread.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "year_level")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class YearLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "year_number", nullable = false)
    private Integer yearNumber;
}

