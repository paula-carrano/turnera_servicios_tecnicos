package com.turnera.servicios.request.exception;

public class RequestNotFoundException extends RuntimeException {

    public RequestNotFoundException(String message) {
        super(message);
    }
}
