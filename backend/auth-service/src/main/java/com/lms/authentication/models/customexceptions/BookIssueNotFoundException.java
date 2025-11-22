package com.lms.authentication.models.customexceptions;

public class BookIssueNotFoundException extends RuntimeException {

	public BookIssueNotFoundException(String message) {
		super(message);
	}
	
}
