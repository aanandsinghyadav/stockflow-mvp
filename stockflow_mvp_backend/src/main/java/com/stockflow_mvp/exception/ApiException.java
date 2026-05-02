package com.stockflow_mvp.exception;

public class ApiException extends RuntimeException {

    public ApiException(String message) {
        super(message);
    }
}
