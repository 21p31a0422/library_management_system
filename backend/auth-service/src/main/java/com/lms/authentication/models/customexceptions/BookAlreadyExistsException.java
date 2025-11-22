package com.lms.authentication.models.customexceptions;

public class BookAlreadyExistsException extends RuntimeException{

	
	private static final long serialVersionUID = 1L;
	public BookAlreadyExistsException(String message)
	{
		super(message);
	}
	
	

}
