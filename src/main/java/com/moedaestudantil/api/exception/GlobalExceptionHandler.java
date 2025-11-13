package com.moedaestudantil.api.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> errors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            errors.put(fe.getField(), fe.getDefaultMessage());
        }
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Validation failed");
        body.put("details", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, Object> body = new HashMap<>();
        String message = ex.getMessage();
        if (message != null && message.contains("value too long")) {
            body.put("error", "A imagem é muito grande. Por favor, use uma imagem menor ou uma URL.");
        } else {
            body.put("error", "Erro ao salvar dados: " + (ex.getCause() != null ? ex.getCause().getMessage() : ex.getMessage()));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "A imagem é muito grande. O tamanho máximo permitido é 10MB.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        String message = ex.getMessage();
        
        // Log do erro completo para debug (em produção, usar logger)
        System.err.println("Erro interno: " + ex.getClass().getName());
        ex.printStackTrace();
        
        // Mensagens mais amigáveis para erros comuns
        if (message != null) {
            if (message.contains("value too long") || message.contains("String too long")) {
                body.put("error", "A imagem é muito grande. Por favor, use uma imagem menor ou uma URL.");
            } else if (message.contains("Data too long")) {
                body.put("error", "Os dados são muito grandes. Por favor, use uma imagem menor.");
            } else {
                body.put("error", "Erro interno do servidor: " + message);
            }
        } else {
            body.put("error", "Erro interno do servidor. Por favor, tente novamente.");
        }
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}


