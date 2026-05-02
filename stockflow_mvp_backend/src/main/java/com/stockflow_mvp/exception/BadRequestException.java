package com.stockflow_mvp.exception;

public class BadRequestException extends ApiException {

    public BadRequestException(String message) {
        super(message);
    }
}