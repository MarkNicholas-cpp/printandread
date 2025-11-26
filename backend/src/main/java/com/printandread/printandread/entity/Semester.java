package com.printandread.printandread.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "printnread_semester")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Semester {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "sem_number", nullable = false)
    private Integer semNumber; // 1-8
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "year_id", nullable = false)
    private YearLevel yearLevel;
    
    // Helper method to get semester display name
    public String getDisplayName() {
        return "Semester " + semNumber;
    }
}

