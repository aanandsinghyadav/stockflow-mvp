package com.stockflow_mvp.exception;


public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}