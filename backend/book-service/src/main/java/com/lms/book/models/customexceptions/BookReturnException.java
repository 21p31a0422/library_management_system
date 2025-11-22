package com.lms.book.models.customexceptions;

public class BookReturnException extends RuntimeException{
	public BookReturnException(String message) {
		super(message);
	}
}
