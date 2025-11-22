package com.lms.book;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import com.lms.book.models.customexceptions.BookAlreadyExistsException;
import com.lms.book.models.customexceptions.BookNotFoundException;
import com.lms.book.models.dao.serviceimpl.BookServiceImpl;
import com.lms.book.models.dao.serviceimpl.CopyServiceImpl;
import com.lms.book.models.dto.BookDTO;
import com.lms.book.models.dto.BookCopyDTO;
import com.lms.book.models.pojos.BookCopies;
import com.lms.book.models.pojos.BookDetails;
import com.lms.book.models.repositories.BookRepo;
import com.lms.book.models.repositories.CopyRepo;
@SpringBootTest
class BookApplicationTests {

	@Test
	void contextLoads() {
	}
	
	
	 @Mock
	    private BookRepo bookRepo;

	    @Mock
	    private CopyRepo copyRepo;

	    @InjectMocks
	    private BookServiceImpl bookService;

	    @InjectMocks
	    private CopyServiceImpl copyService;

	    private BookDetails sampleBook;
	    private MultipartFile mockFile;

	    @BeforeEach
	    void setup() {
	        sampleBook = new BookDetails();
	        sampleBook.setBookId(1L);
	        sampleBook.setBookTitle("Java Basics");
	        sampleBook.setBookType("Programming");
	        sampleBook.setAuthor("James");
	        sampleBook.setBookLanguage("English");
	        sampleBook.setDescription("Java intro");
	        sampleBook.setTotalCopies(2);
	        sampleBook.setAvailableCopies(2);
	        sampleBook.setAvailable(true);
	        sampleBook.setBookImage("image".getBytes());
	        sampleBook.setCreatedAt(LocalDateTime.now());

	        mockFile = new MockMultipartFile("file", "img.jpg", "image/jpeg", "image-content".getBytes());
	    }

	  

	    @Test
	    void addBook_WhenBookAlreadyExists_ThrowsException() {
	        when(bookRepo.findByBookTitleIgnoreCase("Java Basics"))
	                .thenReturn(Optional.of(sampleBook));

	        assertThrows(BookAlreadyExistsException.class, () ->
	                bookService.addBook("Java Basics", "Programming", "James", "English", "Intro", 2, mockFile));
	    }

	    @Test
	    void getBookByName_ValidTitle_ReturnsDTO() {
	        when(bookRepo.findByBookTitleIgnoreCaseAndDeletedFalse("Java Basics"))
	                .thenReturn(Optional.of(sampleBook));

	        BookDTO dto = bookService.getBookByName("Java Basics");

	        assertEquals("Java Basics", dto.getBookTitle());
	        assertEquals("Programming", dto.getBookType());
	    }

	    // ----------------- CopyService Tests ----------------------

	    @Test
	    void addCopies_ValidBook_ReturnsCopyIds() {
	        when(bookRepo.findByBookIdAndDeletedFalse(4L)).thenReturn(Optional.of(sampleBook));
	        when(copyRepo.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

	        List<Long> ids = copyService.addCopies(4L, 2);
	        assertEquals(2, ids.size());
	    }


	    @Test
	    void deleteCopy_CopyNotFound_ThrowsException() {
	        when(copyRepo.findById(100L)).thenReturn(Optional.empty());

	        assertThrows(BookNotFoundException.class, () -> copyService.deleteCopy(100L,2L));
	    }

	    @Test
	    void getBookCopies_ValidBookId_ReturnsCopyDTOs() {
	        BookCopies copy1 = new BookCopies();
	        copy1.setCopyId(1L);
	        copy1.setCopyStatus("Available");
	        copy1.setBookDetails(sampleBook);
	        
	        List<BookCopies> copies = List.of(copy1);

	        when(copyRepo.findByBookId(1L)).thenReturn(copies);

	        List<BookCopyDTO> result = copyService.getBookCopies(1L);

	        assertEquals(1, result.size());
	        assertEquals("Available", result.get(0).getCopyStatus());
	    }

	

}
