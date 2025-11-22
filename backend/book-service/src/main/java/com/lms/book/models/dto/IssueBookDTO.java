package com.lms.book.models.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueBookDTO {
	private long issueId;
	
	@NotBlank(message = "Borrower Id cannot be Empty")
	private long borrowerId;

	@NotBlank(message = "BookId cannot be Empty")
	private long bookId;
	
	private String bookTitle;
	private String author;

	@NotBlank(message = "CopyId cannot be Empty")
	private long copyId;
	
	private LocalDateTime issueDate;
	
	private LocalDateTime returnDate=null;
	private LocalDateTime dueDate;
	private float fineAmount=0;
	private String status;
	private long managerId;
}
