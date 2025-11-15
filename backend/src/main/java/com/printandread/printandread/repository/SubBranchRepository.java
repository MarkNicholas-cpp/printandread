package com.printandread.printandread.repository;

import com.printandread.printandread.entity.SubBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubBranchRepository extends JpaRepository<SubBranch, Long> {
    List<SubBranch> findByBranchId(Long branchId);
    Optional<SubBranch> findByCode(String code);
}

