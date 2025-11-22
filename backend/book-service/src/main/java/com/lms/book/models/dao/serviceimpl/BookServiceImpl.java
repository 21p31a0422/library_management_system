package com.lms.book.models.dao.serviceimpl;


import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.management.RuntimeErrorException;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.lms.book.models.customexceptions.BookAlreadyExistsException;
import com.lms.book.models.customexceptions.BookImageProcessingException;
import com.lms.book.models.customexceptions.BookNotFoundException;
import com.lms.book.models.customexceptions.BookUpdateException;
import com.lms.book.models.dao.services.BookService;
import com.lms.book.models.dto.BookDTO;
import com.lms.book.models.pojos.BookCopies;
import com.lms.book.models.pojos.BookDetails;
import com.lms.book.models.repositories.BookRepo;
import com.lms.book.models.repositories.CopyRepo;

import jakarta.transaction.Transactional;

@Service
public class BookServiceImpl implements BookService {

	@Autowired
	private BookRepo bookrepo;
	
	@Autowired 
	private CopyRepo copyrepo;
	

	
	@Override
	public List<Long> addBook(String bookTitle,String bookType,String author,String  bookLanguage, String description,int totalCopies,MultipartFile bookImage){ 
		Optional<BookDetails>op=bookrepo.findByBookTitleIgnoreCase(bookTitle);
		
		System.out.println("from boook impl");
		if(op.isPresent() && !(op.get().isDeleted()))
		{
			throw new BookAlreadyExistsException("Book with title "+bookTitle+" Already Exist!");
		}
		BookDetails bookdetails;
		if(op.isPresent() && op.get().isDeleted())
		{
			bookdetails=op.get();
			bookdetails.setDeleted(false);
			System.out.println("In add book book service impl line 65");
		}
		else
		{
			bookdetails = new BookDetails();
			System.out.println("In add book book service impl line 70");
		}
		
		 
		System.out.println("book not present");
		try {
		    bookdetails.setBookTitle(bookTitle);
	        bookdetails.setBookType(bookType);
	        bookdetails.setAuthor(author);
	        bookdetails.setBookLanguage(bookLanguage);
	        bookdetails.setDescription(description);
	        bookdetails.setTotalCopies(totalCopies);
	        bookdetails.setAvailableCopies(totalCopies);
	        bookdetails.setAvailable(totalCopies>0);
	        bookdetails.setCreatedAt(LocalDateTime.now());
			bookdetails.setBookImage(bookImage.getBytes());
			System.out.println("In add book book service impl line 86");
			
//			
			
			List<BookCopies> copiesList = new ArrayList<>();
			for(int i=1;i<=totalCopies;i++)
			{
				BookCopies copy = new BookCopies();
				copy.setCopyStatus("Available");
				copy.setBookDetails(bookdetails);
				copiesList.add(copy);		
			}
			System.out.println("book");
			bookdetails.setBookCopies(copiesList);
		
			BookDetails newBook=bookrepo.save(bookdetails);
			System.out.println("booksaved");
			return newBook.getBookCopies().stream().map(copy->copy.getCopyId()).toList();	
		
		}
		catch (IOException e)
		{
			throw new BookImageProcessingException("Failed to Process the Book Image");	
		}
		catch(Exception e)
		{
			throw new RuntimeException("Error occured while adding the book");
		}
	}
	@Override
	@Transactional
	public String deleteBook(Long bookId) {
		
		Optional<BookDetails> bookOpt = bookrepo.findByBookIdAndDeletedFalse(bookId);
		if (bookOpt.isEmpty()) {
		    throw new BookNotFoundException("Book with ID " + bookId + " not found or already deleted");
		}
		// TODO Auto-generated method stub
		try
		{
			BookDetails book = bookOpt.get();
			System.out.println("abivecopy");

			List<BookCopies> copies = book.getBookCopies();
			if (copies != null) {
			    for (BookCopies i : copies) {
			    	i.setCopyStatus("Not Available");
			        i.setDeleted(true);
			       			  
			        }
			   
			  
			}
			System.out.println("belowcpoy");
			

			book.setBookCopies(copies);
			book.setAvailableCopies(0);
			book.setTotalCopies(0);
			book.setAvailable(false);
			book.setDeleted(true);
			System.out.println("belowcpoy2");
			bookrepo.save(book);
				return bookId+" deleted succesfully";
			
		}
		catch(Exception e)
		{
			throw new RuntimeException("Error occured while deleting the books");
		}
	}

	@Override
	@Transactional
	public List<BookDTO> getBooks(Pageable pageable) {
		
		Page<BookDetails> booksPage = bookrepo.findByDeletedFalse(pageable); 
		if (!booksPage.hasContent()) {
			throw new BookNotFoundException("Books Not Found");
		}
		
		try
		{
			 
			    List<BookDTO> newBooks = new ArrayList<>();

			    for (BookDetails i : booksPage.getContent()) { 
			    	
			        BookDTO dto = new BookDTO(
			            i.getBookId(),
			            i.getBookTitle(),
			            i.getBookType(),
			            i.getAuthor(),
			            i.getBookLanguage(),
			            i.getDescription(),
			            i.getTotalCopies(),
			            i.getAvailableCopies(),
			            Base64.getEncoder().encodeToString(i.getBookImage()), 
			            i.isAvailable(),
			            i.getCreatedAt()
			        );
			        newBooks.add(dto);
			    }
			    return newBooks;
			
		}
		catch(Exception e)
		{
			throw new RuntimeException("Error occured while retrieving the books");
		}
	}


	@Override
	public BookDTO getBookByName(String bookTitle) {
		System.out.println("From getbook byname");
		Optional<BookDetails> op=bookrepo.findByBookTitleIgnoreCaseAndDeletedFalse(bookTitle);
		if(op.isEmpty()) {
			throw new BookNotFoundException("Book with title "+bookTitle+" does not exists");
		}
				try
				{
	
						BookDetails book =op.get();
						 BookDTO dto = new BookDTO(
						            book.getBookId(),
						            book.getBookTitle(),
						            book.getBookType(),
						            book.getAuthor(),
						            book.getBookLanguage(),
						            book.getDescription(),
						            book.getTotalCopies(),
						            book.getAvailableCopies(),
						            Base64.getEncoder().encodeToString(book.getBookImage()), 
						            book.isAvailable(),
						            book.getCreatedAt()	  );
						 return dto;
					
				}
				catch(Exception e)
				{
					throw new RuntimeException("Error occured while retriving the "+bookTitle);
				}
		
	}



	@Override
	public String updateBook(Long bookId,String bookTitle, String bookType, String author, String bookLanguage, String description,
			 MultipartFile bookImage) {
		Optional<BookDetails>op=bookrepo.findByBookIdAndDeletedFalse(bookId);
		if(op.isEmpty())
		{
			throw new BookNotFoundException("Book with title "+bookTitle+" does not exists");
		}
		Optional<BookDetails>op1=bookrepo.findByBookTitleIgnoreCaseAndDeletedFalse(bookTitle);
		if(op1.isPresent() && op1.get().getBookId()!=bookId)
		{
			throw new BookAlreadyExistsException("Book with title "+bookTitle+" Already Exist!");
		}
		try {
				BookDetails bookdetails=op.get();
				 bookdetails.setBookTitle(bookTitle);
			        bookdetails.setBookType(bookType);
			        bookdetails.setAuthor(author);
			        bookdetails.setBookLanguage(bookLanguage);
			        bookdetails.setDescription(description);
					bookdetails.setBookImage(bookImage.getBytes());
					bookrepo.save(bookdetails);
					
					return bookTitle+" updated successfully";
			
		}
		catch(Exception e)
		{
			throw new RuntimeException("Error occured while updating the "+bookTitle);
		}
	
	}
	@Override

	public List<BookDetails> getBooksDetails() {
		// TODO Auto-generated method stub
		List<BookDetails>books=bookrepo.findByDeletedFalse();
		for(BookDetails i:books)
		{
			i.setBookImage(null);
			i.setBookCopies(null);
		}
		return books;
	}
	@Override
	public List<String> getAllTitles() {
		// TODO Auto-generated method stub
		List<String>Titles=bookrepo.findAllTitlesByDeletedFalse();
		return Titles;
	}
	@Override
	public List<String> getBookType() {
		// TODO Auto-generated method stub
		List<String> bookTypeList = bookrepo.findDistinctBookTypesByDeletedFalse();

		return bookTypeList;
	}
	@Override
	public List<BookDTO> getAllBookType(Pageable pageable, String bookType) {
		// TODO Auto-generated method stub
		Page<BookDetails> typesPage = bookrepo.findByBookTypeAndDeletedFalse(pageable,bookType);
		if (!typesPage.hasContent()) {
			throw new BookNotFoundException("Books Not Found");
		}
		
		try
		{
			List<BookDTO>allBookTypeList = new ArrayList<>();

			    for (BookDetails i : typesPage.getContent()) { 
			    	
			        BookDTO dto = new BookDTO(
			            i.getBookId(),
			            i.getBookTitle(),
			            i.getBookType(),
			            i.getAuthor(),
			            i.getBookLanguage(),
			            i.getDescription(),
			            i.getTotalCopies(),
			            i.getAvailableCopies(),
			            Base64.getEncoder().encodeToString(i.getBookImage()), 
			            i.isAvailable(),
			            i.getCreatedAt()
			        );
			        allBookTypeList.add(dto);
			    }
			    return allBookTypeList;
			
		}
		catch(Exception e)
		{
			throw new RuntimeException("Error occured while retrieving the books");
		}
	}
	@Override
	public List<BookDTO> newReleases(Pageable pageable) {
		// TODO Auto-generated method stub
		List<BookDTO>newReleasesList = new ArrayList<>();
		LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);
	

		Page<BookDetails> newReleasesPage = bookrepo.findNewReleases(threeDaysAgo,pageable);
		if (!newReleasesPage.hasContent()) {
			throw new BookNotFoundException("Books Not Found");
		}
		try
		{
			    for (BookDetails i : newReleasesPage.getContent()) { 
			    	
			        BookDTO dto = new BookDTO(
			            i.getBookId(),
			            i.getBookTitle(),
			            i.getBookType(),
			            i.getAuthor(),
			            i.getBookLanguage(),
			            i.getDescription(),
			            i.getTotalCopies(),
			            i.getAvailableCopies(),
			            Base64.getEncoder().encodeToString(i.getBookImage()), 
			            i.isAvailable(),
			            i.getCreatedAt()
			        );
			        newReleasesList.add(dto);
			    }
			    return newReleasesList;
			
		}
		catch(Exception e)
		{
			throw new RuntimeException("Error occured while retrieving the books");
		}
		
		
	}
	

	
	
	@Override
	public Map<String, Long> getBookTypeAndCount() {
	    List<Object[]> results = bookrepo.findBookTypeCount();
	    Map<String, Long> countByType = new HashMap<>();
	    for (Object[] row : results) {
	        String type = (String) row[0];
	        Long count = (Long) row[1];
	        countByType.put(type, count);
	    }
	    return countByType;
	}

}

	


