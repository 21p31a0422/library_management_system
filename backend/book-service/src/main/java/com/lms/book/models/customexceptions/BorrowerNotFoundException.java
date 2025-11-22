package com.lms.book.models.customexceptions;

public class BorrowerNotFoundException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public BorrowerNotFoundException (String message) {
		super(message);
	}

}
