package com.lms.book.models.dao.serviceimpl;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.lms.book.models.customexceptions.BookAlreadyExistsException;
import com.lms.book.models.customexceptions.BookIssueNotFoundException;
import com.lms.book.models.customexceptions.BookRenewalException;
import com.lms.book.models.customexceptions.BookReturnException;
import com.lms.book.models.customexceptions.BorrowerNotFoundException;
import com.lms.book.models.dao.services.IssueService;
import com.lms.book.models.dto.BookCopyDTO;
import com.lms.book.models.dto.BookDTO;
import com.lms.book.models.dto.BorrowerProfileDTO;
import com.lms.book.models.dto.IssueBookDTO;
import com.lms.book.models.pojos.BookCopies;
import com.lms.book.models.pojos.BookDetails;
import com.lms.book.models.pojos.BookIssues;
import com.lms.book.models.repositories.BookRepo;
import com.lms.book.models.repositories.CopyRepo;
import com.lms.book.models.repositories.IssueRepo;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class IssueServiceImpl implements IssueService {

	@Autowired
	private BookRepo bookRepo;

	@Autowired
	private CopyRepo copyRepo;

	@Autowired
	private IssueRepo issueRepo;
	
	@Autowired 
	private RestTemplate restTemplate;

	private float calculateFine(LocalDateTime dueDate, LocalDateTime returnDate) {
		if (dueDate.isBefore(returnDate)) {
			Duration duration = Duration.between(dueDate, returnDate);
			long daysOverdue = duration.toDays();
			return daysOverdue * 2; // ₹2 per day
		}
		return 0;
	}

	@Override
	public String updateFinesForOverdueBooks() {
		LocalDateTime today = LocalDateTime.now();
		List<BookIssues> issuedBooks = issueRepo.findByReturnDateIsNull();

		int updatedCount = 0;

		for (BookIssues issue : issuedBooks) {
			if (issue.getDueDate().isBefore(today)) {
				float fine = calculateFine(issue.getDueDate(), today);
				issue.setFineAmount(fine);
				issue.setStatus("OVERDUE");
				issueRepo.save(issue);
				updatedCount++;
			}
		}

		return updatedCount + " overdue records updated with fine.";
	}

	@Override
	public String issueBook(Long borrowerId, String bookTitle, Long copyId, Long managerId,String token) {
		
		try {
		
			String borrower = getBorrowerById(borrowerId, token, "ADMIN");
	    if (borrower.equalsIgnoreCase("Not Found"))     {   
	    	throw new BorrowerNotFoundException("Borrower with ID " + borrowerId + " not found");
	    }
	    System.out.println("from issuebook serviceimpl");
		
		
		Optional<BookDetails> bookDetails = bookRepo.findByBookTitleIgnoreCaseAndDeletedFalse(bookTitle);
		BookDetails book = bookDetails.get();
		Optional<BookCopies> bookCopies = copyRepo.findByCopyIdAndDeletedFalse(copyId); // findByCopyId
		BookCopies copy = bookCopies.get();
		List<BookIssues> allBooks = issueRepo.findByReturnDateIsNull();
		boolean isPresent = false;
		for (BookIssues bookTaken : allBooks) {
			if (bookTaken.getBookDetails() == copy.getBookDetails() // check copyId
					&& bookTaken.getBorrowerId() == borrowerId) {
				isPresent = true;
			}
		}
		if (isPresent) {
			throw new BookAlreadyExistsException("Same book cannot be issued twice");
		}
		if("issued".equalsIgnoreCase(copy.getCopyStatus())) {
			throw new BookAlreadyExistsException("Same copy cannot be issued for two or more borrowers");
		}
		copy.setCopyStatus("ISSUED");
		copyRepo.save(copy);
		book.setAvailableCopies(book.getAvailableCopies() - 1);
		book.setAvailable(book.getAvailableCopies() > 0);
		bookRepo.save(book);
		BookIssues bookIssues = new BookIssues();
		bookIssues.setBorrowerId(borrowerId);
		bookIssues.setBookDetails(book);
		bookIssues.setCopyDetails(copy);
		bookIssues.setIssueDate(LocalDateTime.now());
		bookIssues.setDueDate(LocalDateTime.now().plusMonths(1));
		bookIssues.setStatus("ISSUED");
		bookIssues.setManagerId(managerId);
		issueRepo.save(bookIssues);
		return "Book Issued Successfully";
		}
		catch(Exception e)
		{
			throw new RuntimeException(e.getMessage());
		}
	}

	@Override
	public IssueBookDTO renewBook(Long issueId) {
		// TODO Auto-generated method stub
		try {
			Optional<BookIssues> bookIssued = issueRepo.findById(issueId);
			if (bookIssued.isEmpty()) {
				throw new BookIssueNotFoundException("This Book is not issued before");
			}
			BookIssues issuedBook = bookIssued.get();
			if (issuedBook.getReturnDate() != null) {
				throw new BookRenewalException("Renewal is not possible. Kindly issue him/her with new book");
			}
			LocalDateTime today = LocalDateTime.now();
			float fine = 0;
			fine = calculateFine(issuedBook.getDueDate(), today);
			if (fine > 0) {
				issuedBook.setFineAmount(fine);
				issueRepo.save(issuedBook);
				throw new BookRenewalException("Renewal is not possible because you have fine amount of " + fine);
			}
			issuedBook.setIssueDate(today);
			issuedBook.setDueDate(today.plusMonths(1));
			issuedBook.setStatus("RENEWED");
			issueRepo.save(issuedBook);
			IssueBookDTO dto= new IssueBookDTO(issuedBook.getIssueId(), issuedBook.getBorrowerId(),
					issuedBook.getBookDetails().getBookId(), issuedBook.getBookDetails().getBookTitle(),issuedBook.getBookDetails().getAuthor(), issuedBook.getCopyDetails().getCopyId(),
					issuedBook.getIssueDate(), issuedBook.getReturnDate(), issuedBook.getDueDate(),
					issuedBook.getFineAmount(), issuedBook.getStatus(), issuedBook.getManagerId());

			return dto;
		} catch (Exception e) {
			throw new RuntimeException("Renewal Failed");
		}
	}

	@Override
	public String returnBook(Long issueId) {
		// TODO Auto-generated method stub
		Optional<BookIssues> bookIssued = issueRepo.findById(issueId);
		BookIssues issuedBook = bookIssued.get();
		// check with bookTitle or copyId
		if (issuedBook.getReturnDate() != null && issuedBook.getStatus().equalsIgnoreCase("Returned")) {
			throw new BookReturnException("Already returned the book. Check with issueId");
		}
		LocalDateTime today = LocalDateTime.now();
		issuedBook.setReturnDate(today);
		BookDetails book = issuedBook.getBookDetails();
		BookCopies copy = issuedBook.getCopyDetails();
		copy.setCopyStatus("Available");
		copyRepo.save(copy);

		book.setAvailableCopies(book.getAvailableCopies() + 1);
		book.setAvailable(book.getAvailableCopies() > 0);
		bookRepo.save(book);

		float fine = calculateFine(issuedBook.getDueDate(), today);
		issuedBook.setFineAmount(fine);
		issuedBook.setStatus("RETURNED");
		issueRepo.save(issuedBook);

		if (fine > 0) {
			return "You have to pay fine amount of " + fine;
		} else {
			return "Great! You have returned the book on time.";
		}
	}

	@Override
	public List<BookCopyDTO> getAvailableCopiesByTitle(String title) {
		Optional<BookDetails> book = bookRepo.findByBookTitleIgnoreCaseAndDeletedFalse(title);
		Long bookId = book.get().getBookId();
		List<BookCopies> copies = copyRepo.findByBookIdAndcopyStatus(bookId);
		// Convert to DTO to avoid exposing entities directly
		List<BookCopyDTO> allAvailableCopies = copies.stream()
				.map(copy -> new BookCopyDTO(copy.getCopyId(), copy.getCopyStatus())).collect(Collectors.toList());
		return allAvailableCopies;
	}

	@Override
	public BookDTO getCopyDetails(Long copy) {
		Optional<BookCopies> bookCopy = copyRepo.findByCopyIdAndDeletedFalse(copy);
		BookDetails book = bookCopy.get().getBookDetails();
		BookDTO bookDTO = new BookDTO(book.getBookId(), book.getBookTitle(), book.getBookType(), book.getAuthor(),
				book.getBookLanguage(), book.getDescription(), book.getTotalCopies(), book.getAvailableCopies(),
				Base64.getEncoder().encodeToString(book.getBookImage()), book.isAvailable(), book.getCreatedAt());
		return bookDTO;
	}

	@Override
	public List<IssueBookDTO> getHistory(Long borrowerId) {
		// TODO Auto-generated method stub
		List<BookIssues> issuedBooks = issueRepo.findByBorrowerId(borrowerId);
		if (issuedBooks.isEmpty()) {
			return Collections.emptyList();
		}
		List<IssueBookDTO> historyList = new ArrayList<>();
		for (BookIssues issueBook : issuedBooks) {
			// Convert the entity to a DTO using a helper method.
			IssueBookDTO issueBookDTO = new IssueBookDTO(issueBook.getIssueId(), issueBook.getBorrowerId(),
					issueBook.getBookDetails().getBookId(), issueBook.getBookDetails().getBookTitle(),issueBook.getBookDetails().getAuthor(), issueBook.getCopyDetails().getCopyId(),
					issueBook.getIssueDate(), issueBook.getReturnDate(), issueBook.getDueDate(),
					issueBook.getFineAmount(), issueBook.getStatus(), issueBook.getManagerId());

			// Add the converted DTO to the new list.
			historyList.add(issueBookDTO);
		}
		return historyList;
	}
	@Override
	public List<IssueBookDTO> getManagerIssuedBooks() {
		// TODO Auto-generated method stub
		List<BookIssues> issuedBooks = issueRepo.findAll();
		if (issuedBooks.isEmpty()) {
			return Collections.emptyList();
		}
		List<IssueBookDTO> issuedList = new ArrayList<>();
		for (BookIssues issueBook : issuedBooks) {
			// Convert the entity to a DTO using a helper method.
			IssueBookDTO issueBookDTO = new IssueBookDTO(issueBook.getIssueId(), issueBook.getBorrowerId(),
					issueBook.getBookDetails().getBookId(), issueBook.getBookDetails().getBookTitle(),issueBook.getBookDetails().getAuthor(), issueBook.getCopyDetails().getCopyId(),
					issueBook.getIssueDate(), issueBook.getReturnDate(), issueBook.getDueDate(),
					issueBook.getFineAmount(), issueBook.getStatus(), issueBook.getManagerId());

			// Add the converted DTO to the new list.
			issuedList.add(issueBookDTO);
		}
		return issuedList;
	}

	@Override
	public long getActiveBorrowersCount() {
		return issueRepo.countDistinctBorrowersNotReturned();
	}


	@Override
	public long getOverdueBooksCount() {
		updateFinesForOverdueBooks();
        return issueRepo.countBooksWithStatusOverdue();
	}

	@Override
	public long getTotalBooksCount() {
		return bookRepo.countByDeletedFalse();
	}

	@Override
	public Long getCheckedOutBooksCount() {
		return issueRepo.countByStatusNotIgnoreCase("returned");
	}
	
	public String getBorrowerById(Long borrowerId, String token, String role) {
		try {
        String url = "http://AuthenticationApplication/lms/borrower/findborrower?borrowerId=" + borrowerId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.set("Role", role);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );
        System.out.println("from rest template");

        return response.getBody();
		}
		catch(Exception e)
		{
			throw new BorrowerNotFoundException("Borrower with ID " + borrowerId + " not found");
		}
    }

}
