package com.turnera.servicios.request.exception;

public class RequestVersionConflictException extends RuntimeException {

    public RequestVersionConflictException(String message) {
        super(message);
    }
}
