package com.lms.book.models.dao.services;

import java.util.List;

import com.lms.book.models.dto.BookCopyDTO;
import com.lms.book.models.dto.BookDTO;
import com.lms.book.models.dto.IssueBookDTO;

public interface IssueService {
	String issueBook(Long borrowerId, String bookTitle, Long copyId, Long managerId,String token);
	IssueBookDTO renewBook(Long issueId);
	String returnBook(Long issueId);
	String updateFinesForOverdueBooks();
	List<BookCopyDTO> getAvailableCopiesByTitle(String title);
	BookDTO getCopyDetails(Long copy);
	List<IssueBookDTO> getHistory(Long borrowerId);
	List<IssueBookDTO> getManagerIssuedBooks();
	long getActiveBorrowersCount();
    long getOverdueBooksCount();
    long getTotalBooksCount();
	Long getCheckedOutBooksCount();
}
