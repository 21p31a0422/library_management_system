package com.lms.book.models.dao.services;


import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.lms.book.models.dto.BookDTO;
import com.lms.book.models.pojos.BookDetails;

public interface BookService {
	

	List<Long> addBook(String bookTitle, String bookType, String author, String bookLanguage, String description,int totalCopies, MultipartFile bookImage);
	String deleteBook(Long bookId);
	List<BookDTO> getBooks(Pageable pageable);
	BookDTO getBookByName(String bookTitle);
	String updateBook(Long bookId,String bookTitle, String bookType, String author, String bookLanguage, String description,
			 MultipartFile bookImage);

	List<BookDetails> getBooksDetails();
	List<String> getAllTitles();
	List<String> getBookType();
	List<BookDTO> getAllBookType(Pageable pageable, String bookType);
	List<BookDTO> newReleases(Pageable pageable);
	Map<String, Long> getBookTypeAndCount();

	

}