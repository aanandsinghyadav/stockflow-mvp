package com.stockflow_mvp.service;

import com.stockflow_mvp.entity.Organization;
import com.stockflow_mvp.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;

    @Override
    public Organization createOrganization(String name) {
        Organization org = Organization.builder()
                .name(name)
                .build();
        return organizationRepository.saveAndFlush(org);
    }
}
