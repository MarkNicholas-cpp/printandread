package com.printandread.printandread.repository;

import com.printandread.printandread.entity.YearLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YearLevelRepository extends JpaRepository<YearLevel, Long> {
    
}

