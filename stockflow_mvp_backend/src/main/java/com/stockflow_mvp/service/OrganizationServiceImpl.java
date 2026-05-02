package com.stockflow_mvp.service;

import com.stockflow_mvp.entity.Organization;
import com.stockflow_mvp.repository.OrganizationRepository;
import com.stockflow_mvp.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrganizationServiceImpl implements OrganizationService {

    @Autowired
    private final OrganizationRepository organizationRepository;

    @Override
    public Organization createOrganization(String name) {

        Organization org = Organization.builder()
                .name(name)
                .build();

        return organizationRepository.saveAndFlush(org); // IMPORTANT
    }
}