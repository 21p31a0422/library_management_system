package com.lms.authentication.models.customexceptions;

public class BookCopyNotFoundException extends RuntimeException {

	public BookCopyNotFoundException(String message) {
		super(message);
	}
	
}
