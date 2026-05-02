package com.stockflow_mvp.repository;

import com.stockflow_mvp.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}