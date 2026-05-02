package com.stockflow_mvp.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Organization name is required")
    private String organizationName;
}
