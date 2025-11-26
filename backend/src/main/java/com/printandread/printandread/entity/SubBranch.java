package com.printandread.printandread.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "printnread_sub_branch")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubBranch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name; // e.g., "CSE-AIML", "CSE-DS"
    
    @Column(name = "code", nullable = false, length = 30)
    private String code; // e.g., "CSE-AIML", "CSE-DS"
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
}

