package com.lms.book.models.dao.services;

import java.util.List;

import com.lms.book.models.dto.BookCopyDTO;

public interface CopyService {

	String deleteCopy(Long copyId, Long bookId);

	List<Long> addCopies(Long bookId, int bookCopies);

	List<BookCopyDTO> getBookCopies(Long bookId);

}
