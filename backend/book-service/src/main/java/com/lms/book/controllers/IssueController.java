package com.lms.book.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lms.book.models.dao.services.IssueService;
import com.lms.book.models.dto.BookCopyDTO;
import com.lms.book.models.dto.BookDTO;
import com.lms.book.models.dto.IssueBookDTO;

@RestController
@RequestMapping("/lms/bookissue")
public class IssueController {
	@Autowired
	private IssueService issueService;
	@PostMapping("/issueBook")
	public ResponseEntity<String> issueBook(@RequestParam Long borrowerId, @RequestParam String bookTitle,@RequestParam Long copyId, @RequestParam Long managerId,@RequestParam String token)
	{
		System.out.println("from issuebook controller");
		String result = issueService.issueBook(borrowerId, bookTitle, copyId, managerId,token);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	@PutMapping("/renewBook")
	public ResponseEntity<IssueBookDTO> renewBook(@RequestParam Long issueId) {
		IssueBookDTO result = issueService.renewBook(issueId);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	@PutMapping("/returnBook")
	public ResponseEntity<String> returnBook(@RequestParam Long issueId) {
		String result = issueService.returnBook(issueId);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	@PutMapping("/updateFines")
	public ResponseEntity<String> updateFines() {
	    String result = issueService.updateFinesForOverdueBooks();
	    return new ResponseEntity<>(result, HttpStatus.OK);
	}
	@GetMapping("/getAvailableCopies")
    public ResponseEntity<List<BookCopyDTO>> getAvailableCopies(@RequestParam String title) {
        List<BookCopyDTO> result= issueService.getAvailableCopiesByTitle(title);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
	@GetMapping("/getCopyDetails")
	public ResponseEntity<BookDTO> getCopyDetails(@RequestParam Long copy) {
		BookDTO result= issueService.getCopyDetails(copy);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	@GetMapping("/getHistory")
	public ResponseEntity<List<IssueBookDTO>> getHistory(@RequestParam Long borrowerId) {
		List<IssueBookDTO> result= issueService.getHistory(borrowerId);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	@GetMapping("/getManagerIssuedBooks")
	public ResponseEntity<List<IssueBookDTO>> getManagerIssuedBooks() {
		List<IssueBookDTO> result= issueService.getManagerIssuedBooks();
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	@GetMapping("/getActiveBorrowersCount")
    public ResponseEntity<Long> getActiveBorrowersCount() {
        long count = issueService.getActiveBorrowersCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/getOverdueBooksCount")
    public ResponseEntity<Long> getOverdueBooksCount() {
        long count = issueService.getOverdueBooksCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/getTotalBooksCount")
    public ResponseEntity<Long> getTotalBooksCount() {
        long count = issueService.getTotalBooksCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    @GetMapping("/getCheckedOutBooksCount")
	public ResponseEntity<Long> getCheckedOutBooksCount() {
		Long result=issueService.getCheckedOutBooksCount();
		return new ResponseEntity<Long>(result, HttpStatus.OK);
	}

}
