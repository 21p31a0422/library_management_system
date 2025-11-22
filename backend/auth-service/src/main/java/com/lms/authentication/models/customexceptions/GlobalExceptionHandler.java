package com.lms.authentication.models.customexceptions;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request)
	{
		ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "INTERNAL_SERVER_ERROR"); 
		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request)
	{
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(error -> {
			errors.put(error.getField(), error.getDefaultMessage());
		});
		ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), "Validation Failed", errors.toString(), HttpStatus.BAD_REQUEST.toString());
		
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

    @ExceptionHandler(BookAlreadyExistsException.class)
    public ResponseEntity<ExceptionResponse> handleBookAlreadyExists(BookAlreadyExistsException ex, WebRequest request) {
    	ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "CONFLICT");
    	return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }
    @ExceptionHandler(BookImageProcessingException.class)
    public ResponseEntity<ExceptionResponse> imageProcessing(BookImageProcessingException ex, WebRequest request)
    {
    	ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "BAD_REQUEST");
    	return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<ExceptionResponse> bookNotFound(BookNotFoundException ex, WebRequest request)
    {
    	ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "NOT_FOUND");
    	return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(BookUpdateException.class)
    public ResponseEntity<ExceptionResponse> bookNot(BookUpdateException ex, WebRequest request)
    {
    	ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "BAD_REQUEST");
    	return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(BorrowerEmailExistsException.class)
    public ResponseEntity<ExceptionResponse> handleEmailExists(BorrowerEmailExistsException ex, WebRequest request)
    {
    	ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "CONFLICT");
    	return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }
    
    @ExceptionHandler(BorrowerNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleBorrowerNotFound(BorrowerNotFoundException ex, WebRequest request) {
    	ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "NOT_FOUND");
    	return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(BorrowerAccountUpdationException.class)
    public ResponseEntity<ExceptionResponse> handleBorrowerccountNotUpdated(BorrowerAccountUpdationException ex, WebRequest request) {
    	ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "CONFLICT");
    	return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }
    @ExceptionHandler(BookCopyNotFoundException.class)
    public ResponseEntity<ExceptionResponse> bookCopyNotFound(BookCopyNotFoundException ex, WebRequest request)
    {
    	ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "NOT_FOUND");
    	return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(BookIssueNotFoundException.class)
    public ResponseEntity<ExceptionResponse> bookIssueNotFound(BookIssueNotFoundException ex, WebRequest request)
    {
    	ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "NOT_FOUND");
    	return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(BookRenewalException.class)
    public ResponseEntity<ExceptionResponse> bookRenewal(BookRenewalException ex, WebRequest request)
    {
    	ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "BAD_REQUEST");
    	return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(BookReturnException.class)
    public ResponseEntity<ExceptionResponse> bookReturn(BookReturnException ex, WebRequest request)
    {
    	ExceptionResponse response = new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "BAD_REQUEST");
    	return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
