package com.lms.book.models.customexceptions;

public class BorrowerEmailExistsException extends RuntimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public BorrowerEmailExistsException (String message) {
		super(message);
	}
}
