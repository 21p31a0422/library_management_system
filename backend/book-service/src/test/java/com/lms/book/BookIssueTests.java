package com.lms.book;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.lms.book.models.customexceptions.BookAlreadyExistsException;
import com.lms.book.models.customexceptions.BookNotFoundException;
import com.lms.book.models.customexceptions.BookRenewalException;
import com.lms.book.models.customexceptions.BookReturnException;
import com.lms.book.models.customexceptions.BorrowerNotFoundException;
import com.lms.book.models.dao.serviceimpl.BookServiceImpl;
import com.lms.book.models.dao.serviceimpl.CopyServiceImpl;
import com.lms.book.models.dao.serviceimpl.IssueServiceImpl;
import com.lms.book.models.dto.BookCopyDTO;
import com.lms.book.models.dto.BookDTO;
import com.lms.book.models.dto.IssueBookDTO;
import com.lms.book.models.pojos.BookCopies;
import com.lms.book.models.pojos.BookDetails;
import com.lms.book.models.pojos.BookIssues;
import com.lms.book.models.repositories.BookRepo;
import com.lms.book.models.repositories.CopyRepo;
import com.lms.book.models.repositories.IssueRepo;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
class BookIssueTests  {

    @Test
    void contextLoads() {}

    // ---------- Mocked dependencies ----------
    @Mock private BookRepo bookRepo;
    @Mock private CopyRepo copyRepo;
    @Mock private IssueRepo issueRepo;
    @Mock private RestTemplate restTemplate;

    @InjectMocks private BookServiceImpl bookService;
    @InjectMocks private CopyServiceImpl copyService;
    @InjectMocks private IssueServiceImpl issueService;

    // ---------- Sample objects ----------
    private BookDetails sampleBook;
    private BookCopies sampleCopy;
    private BookIssues sampleIssue;
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
        sampleBook.setDeleted(false);

        sampleCopy = new BookCopies();
        sampleCopy.setCopyId(101L);
        sampleCopy.setCopyStatus("AVAILABLE");
        sampleCopy.setBookDetails(sampleBook);

        sampleIssue = new BookIssues();
        sampleIssue.setIssueId(1001L);
        sampleIssue.setBorrowerId(2001L);
        sampleIssue.setBookDetails(sampleBook);
        sampleIssue.setCopyDetails(sampleCopy);
        sampleIssue.setIssueDate(LocalDateTime.now().minusDays(10));
        sampleIssue.setDueDate(LocalDateTime.now().plusDays(10));
        sampleIssue.setStatus("ISSUED");

        mockFile = new MockMultipartFile("file", "img.jpg", "image/jpeg", "image-content".getBytes());
    }

    // ----------------- BookService Tests ----------------------




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
        assertThrows(BookNotFoundException.class, () -> copyService.deleteCopy(100L, 2L));
    }

    @Test
    void getBookCopies_ValidBookId_ReturnsCopyDTOs() {
        BookCopies copy1 = new BookCopies();
        copy1.setCopyId(1L);
        copy1.setCopyStatus("Available");
        copy1.setBookDetails(sampleBook);

        when(copyRepo.findByBookId(1L)).thenReturn(List.of(copy1));

        List<BookCopyDTO> result = copyService.getBookCopies(1L);

        assertEquals(1, result.size());
        assertEquals("Available", result.get(0).getCopyStatus());
    }


    @Test
    void returnBook_WhenAlreadyReturned_ThrowsException() {
        sampleIssue.setReturnDate(LocalDateTime.now());
        sampleIssue.setStatus("RETURNED");

        when(issueRepo.findById(1001L)).thenReturn(Optional.of(sampleIssue));

        assertThrows(BookReturnException.class, () -> issueService.returnBook(1001L));
    }

    @Test
    void returnBook_OnTime_NoFine() {
        when(issueRepo.findById(1001L)).thenReturn(Optional.of(sampleIssue));
        when(copyRepo.save(any(BookCopies.class))).thenReturn(sampleCopy);
        when(bookRepo.save(any(BookDetails.class))).thenReturn(sampleBook);
        when(issueRepo.save(any(BookIssues.class))).thenReturn(sampleIssue);

        String result = issueService.returnBook(1001L);
        assertTrue(result.contains("returned the book on time"));
    }


    @Test
    void renewBook_Valid_RenewsSuccessfully() {
        when(issueRepo.findById(1001L)).thenReturn(Optional.of(sampleIssue));
        when(issueRepo.save(any(BookIssues.class))).thenReturn(sampleIssue);

        IssueBookDTO dto = issueService.renewBook(1001L);

        assertEquals("RENEWED", dto.getStatus());
        assertEquals(sampleBook.getBookId(), dto.getBookId());
    }

    @Test
    void updateFinesForOverdueBooks_UpdatesCorrectly() {
        sampleIssue.setDueDate(LocalDateTime.now().minusDays(3)); // overdue
        when(issueRepo.findByReturnDateIsNull()).thenReturn(List.of(sampleIssue));

        String result = issueService.updateFinesForOverdueBooks();

        assertTrue(result.contains("1 overdue records updated"));
        assertEquals("OVERDUE", sampleIssue.getStatus());
        assertTrue(sampleIssue.getFineAmount() > 0);
    }
}
