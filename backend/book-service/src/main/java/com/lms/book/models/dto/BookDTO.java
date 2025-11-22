package com.lms.book.models.dto;

import java.time.LocalDateTime;



import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;



@NoArgsConstructor
@AllArgsConstructor
@Data
public class BookDTO {
	
	
	private long bookId;
	
	private String bookTitle;
	
	private String bookType;

	private String author;

	private String bookLanguage;
	

	private String description;
	
	
	private int totalCopies;
	
	
	private int availableCopies;
	
	
	private String bookImage;
	

	private boolean isAvailable;
	
	private LocalDateTime createdAt;
	
	


}
