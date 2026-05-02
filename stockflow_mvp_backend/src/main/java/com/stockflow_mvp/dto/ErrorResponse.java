package com.stockflow_mvp.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ErrorResponse {

    private boolean success;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> errors;
}