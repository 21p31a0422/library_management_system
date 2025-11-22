package com.lms.authentication.models.customexceptions;

public class BorrowerNotFoundException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public BorrowerNotFoundException (String message) {
		super(message);
	}

}
