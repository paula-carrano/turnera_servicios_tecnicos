package com.turnera.servicios.request.exception;

public class RequestValidationException extends RuntimeException {

    public RequestValidationException(String message) {
        super(message);
    }
}
