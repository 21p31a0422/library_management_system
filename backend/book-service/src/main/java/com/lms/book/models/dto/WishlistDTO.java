package com.lms.book.models.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class WishlistDTO {
	
	@NotNull(message = "Borrower Id cannot be empty")
	private Long borrowerId;
	
	@NotBlank(message = "Book title cannot be empty")
	private String bookTitle;
}