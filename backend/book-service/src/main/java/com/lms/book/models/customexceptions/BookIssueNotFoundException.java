package com.lms.book.models.customexceptions;

public class BookIssueNotFoundException extends RuntimeException {

	public BookIssueNotFoundException(String message) {
		super(message);
	}
	
}
