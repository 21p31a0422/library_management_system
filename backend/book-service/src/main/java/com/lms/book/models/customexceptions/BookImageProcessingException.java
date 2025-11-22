package com.lms.book.models.customexceptions;

public class BookImageProcessingException extends RuntimeException{

	
	private static final long serialVersionUID = 1L;
	public BookImageProcessingException(String message)
	{
		super(message);
	}

	
}
