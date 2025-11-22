package com.lms.book.models.customexceptions;

public class WishlistAlreadyExistsException extends RuntimeException{
	
	private static final long serialVersionUID = 1L;
	public WishlistAlreadyExistsException(String message) {
		super(message);
	}
}