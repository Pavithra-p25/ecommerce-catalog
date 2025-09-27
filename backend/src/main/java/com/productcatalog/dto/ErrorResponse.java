package com.productcatalog.dto;

import java.util.List;

public class ErrorResponse {
    
    private String message;
    private List<FieldError> errors;
    private int status;
    private String path;
    private long timestamp;
    
    // Constructors
    public ErrorResponse() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public ErrorResponse(String message, int status, String path) {
        this();
        this.message = message;
        this.status = status;
        this.path = path;
    }
    
    public ErrorResponse(String message, List<FieldError> errors, int status, String path) {
        this(message, status, path);
        this.errors = errors;
    }
    
    // Getters and Setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public List<FieldError> getErrors() {
        return errors;
    }
    
    public void setErrors(List<FieldError> errors) {
        this.errors = errors;
    }
    
    public int getStatus() {
        return status;
    }
    
    public void setStatus(int status) {
        this.status = status;
    }
    
    public String getPath() {
        return path;
    }
    
    public void setPath(String path) {
        this.path = path;
    }
    
    public long getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
    
    // Inner class for field-specific errors
    public static class FieldError {
        private String field;
        private String message;
        
        public FieldError() {}
        
        public FieldError(String field, String message) {
            this.field = field;
            this.message = message;
        }
        
        public String getField() {
            return field;
        }
        
        public void setField(String field) {
            this.field = field;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}
