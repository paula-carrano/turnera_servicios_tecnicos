package com.turnera.servicios.request.exception;

import com.turnera.servicios.request.dto.ErrorResponse;
import jakarta.persistence.OptimisticLockException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
    Map<String, String> fields = new LinkedHashMap<>();
    exception
        .getBindingResult()
        .getFieldErrors()
        .forEach(error -> fields.put(error.getField(), error.getDefaultMessage()));
    return ResponseEntity.badRequest()
        .body(new ErrorResponse("VALIDATION_ERROR", "Los datos enviados no son válidos.", fields));
  }

  @ExceptionHandler(RequestValidationException.class)
  public ResponseEntity<ErrorResponse> handleRequestValidation(
      RequestValidationException exception) {
    return ResponseEntity.badRequest()
        .body(new ErrorResponse("VALIDATION_ERROR", exception.getMessage(), null));
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleUnreadableMessage(
      HttpMessageNotReadableException exception) {
    return ResponseEntity.badRequest()
        .body(
            new ErrorResponse("VALIDATION_ERROR", "Los datos enviados no son v\u00e1lidos.", null));
  }

  @ExceptionHandler(RequestNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleNotFound(RequestNotFoundException exception) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ErrorResponse("NOT_FOUND", exception.getMessage(), null));
  }

  @ExceptionHandler({
    RequestVersionConflictException.class,
    OptimisticLockException.class,
    OptimisticLockingFailureException.class
  })
  public ResponseEntity<ErrorResponse> handleConflict(Exception exception) {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(
            new ErrorResponse(
                "VERSION_CONFLICT", "La solicitud fue modificada por otra persona.", null));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnexpected(Exception exception) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new ErrorResponse("INTERNAL_ERROR", "Ocurrió un error interno.", null));
  }
}
