package com.printandread.printandread.repository;

import com.printandread.printandread.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {
    List<Semester> findByYearLevelId(Long yearId);
    List<Semester> findByYearLevel_YearNumber(Integer yearNumber);
    Optional<Semester> findBySemNumberAndYearLevelId(Integer semNumber, Long yearId);
}

