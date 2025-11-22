package com.lms.book.controllers;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lms.book.models.dao.services.BookService;
import com.lms.book.models.dao.services.CopyService;
import com.lms.book.models.dto.BookCopyDTO;
import com.lms.book.models.dto.BookDTO;
import com.lms.book.models.pojos.BookCopies;
import com.lms.book.models.pojos.BookDetails;


@RestController
@RequestMapping("/lms/book")
public class BookController {
	
	@Autowired
	private BookService bookService;
	
	@Autowired
	private CopyService copyService;
	

	@PostMapping("/addBook")
	public ResponseEntity<List<Long>> addBook(@RequestParam String bookTitle,@RequestParam String bookType,@RequestParam String author,
			@RequestParam String  bookLanguage, @RequestParam String description,@RequestParam int totalCopies,@RequestParam("bookImage") MultipartFile bookImage)
	{
		System.out.println("from addbook");
		
		List<Long>copyId=bookService.addBook(bookTitle,bookType,author,bookLanguage,description,totalCopies,bookImage);
		System.out.println("response");
		return new ResponseEntity<List<Long>>(copyId,HttpStatus.OK);
	}
	
	
	
	@PostMapping("/addCopies")
	public ResponseEntity<List<Long>>addCopies(@RequestParam Long bookId,@RequestParam int bookCopies)
	{
		List<Long>copyId=copyService.addCopies(bookId,bookCopies);
		return new ResponseEntity<List<Long>>(copyId,HttpStatus.OK);
	}
	
	
	@DeleteMapping("/deleteBook")
	public ResponseEntity<String>deleteBook(@RequestParam Long bookId)
	{
		return new ResponseEntity<String>(bookService.deleteBook(bookId),HttpStatus.OK);
	}
	
	
	@DeleteMapping("/deleteCopy")
	public ResponseEntity<String>deleteCopy(@RequestParam Long copyId,@RequestParam Long bookId)
	{
		System.out.println(bookId);
		return new ResponseEntity<String>(copyService.deleteCopy(copyId,bookId),HttpStatus.OK);
	}
	
	@GetMapping("/getBook")
	public ResponseEntity<BookDTO>getBookByName(@RequestParam String bookTitle)
	{
		BookDTO book=bookService.getBookByName(bookTitle);
		return new ResponseEntity<BookDTO>(book,HttpStatus.OK);
	}
	@GetMapping("/getAllBookType")
	public ResponseEntity<List<BookDTO>>getAllBookType(@RequestParam int pageNumber,@RequestParam int size,@RequestParam String bookType)
	{
		Pageable pageable =  PageRequest.of(pageNumber,size);	
		List<BookDTO> bookList=bookService.getAllBookType(pageable,bookType);
		return new ResponseEntity<>(bookList,HttpStatus.OK);
	}
	
	@GetMapping("/getAllBooks")
	public ResponseEntity<List<BookDTO>>getBooks(@RequestParam int pageNumber,@RequestParam int size)
	{
		Pageable pageable =  PageRequest.of(pageNumber,size);	
		List<BookDTO> bookList=bookService.getBooks(pageable);
		return new ResponseEntity<>(bookList,HttpStatus.OK);
	}

	@GetMapping("/getBookCopies")
	public ResponseEntity<List<BookCopyDTO>>getBookCopies(@RequestParam Long bookId)
	{
		List<BookCopyDTO>copyList=copyService.getBookCopies(bookId);
		return new ResponseEntity<List<BookCopyDTO>>(copyList,HttpStatus.OK);
	}
	@GetMapping("/getBooksDetails")
	public ResponseEntity<List<BookDetails>>getBooksDetails()
	{
		List<BookDetails>bookList=bookService.getBooksDetails();
		return new ResponseEntity<List<BookDetails>>(bookList,HttpStatus.OK);
	}
	@GetMapping("/getBookType")
	public ResponseEntity<List<String>>getBookType()
	{
		System.out.println("from bok type");
		List<String> bookTypeList=bookService.getBookType();
		return new ResponseEntity<>(bookTypeList,HttpStatus.OK);
	}
	
	
	
	@GetMapping("/getAllTitles")
	public ResponseEntity<List<String>>getAllTitles()
	{
		List<String>bookTitles=bookService.getAllTitles();
		return new ResponseEntity<List<String>>(bookTitles,HttpStatus.OK);
	}
	
	@GetMapping("/newReleases")
	public ResponseEntity<List<BookDTO>>newReleases(@RequestParam int pageNumber,@RequestParam int size)
	{
		System.out.println("from new releases");
		Pageable pageable =  PageRequest.of(pageNumber,size);	
		List<BookDTO> bookList=bookService.newReleases(pageable);
		return new ResponseEntity<>(bookList,HttpStatus.OK);
	}
	
	@PutMapping("/updateBook")
	public ResponseEntity<String>updateBook(@RequestParam Long bookId,@RequestParam String bookTitle,@RequestParam String bookType,@RequestParam String author,
			@RequestParam String  bookLanguage, @RequestParam String description,@RequestParam("bookImage") MultipartFile bookImage)
	{
		String result=bookService.updateBook(bookId,bookTitle,bookType,author,bookLanguage,description,bookImage);
		return new ResponseEntity<String>(result,HttpStatus.OK);
	}
	@GetMapping("/getBookTypeAndCount")
	public ResponseEntity<Map<String, Long>> getBookTypeAndCount() {
	    Map<String, Long> result = bookService.getBookTypeAndCount();
	    return new ResponseEntity<Map<String, Long>>(result,HttpStatus.OK);
	}

	
}
