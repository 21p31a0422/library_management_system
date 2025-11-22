package com.lms.book.models.customexceptions;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ExceptionResponse {
	private LocalDateTime timestamp;
	private String message;
	private String details;
	private String httpCodeMessage;
}
