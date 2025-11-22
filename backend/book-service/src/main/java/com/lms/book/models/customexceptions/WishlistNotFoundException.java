package com.lms.book.models.customexceptions;

public class WishlistNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	public WishlistNotFoundException(String message) {
		super(message);
	}
}