package com.turnera.servicios.request.dto;

import java.util.Map;

public record ErrorResponse(String code, String message, Map<String, String> fields) {

    public ErrorResponse {
        fields = fields == null || fields.isEmpty() ? null : Map.copyOf(fields);
    }
}
