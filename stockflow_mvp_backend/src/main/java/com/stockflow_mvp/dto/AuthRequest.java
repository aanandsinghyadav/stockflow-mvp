package com.stockflow_mvp.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
    private String organizationName; // used only for signup
}