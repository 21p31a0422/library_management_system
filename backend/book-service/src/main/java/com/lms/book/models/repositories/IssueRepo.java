package com.lms.book.models.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.lms.book.models.pojos.BookIssues;

public interface IssueRepo extends JpaRepository<BookIssues,Long> {
	List<BookIssues> findByReturnDateIsNull();
	
	@Query("SELECT SUM(b.fineAmount) FROM BookIssues b WHERE b.returnDate IS NULL")
	Float getTotalFineAmount(); //return total != null ? total : 0;

	List<BookIssues> findByBorrowerId(Long borrowerId);

	
	
	@Query("SELECT COUNT(DISTINCT i.borrowerId) FROM BookIssues i WHERE LOWER(i.status) = 'issued'")
    long countDistinctBorrowersWithStatusIssued();

    @Query("SELECT COUNT(i) FROM BookIssues i WHERE LOWER(i.status) = 'overdue'")
    long countBooksWithStatusOverdue();

	long countByStatusNotIgnoreCase(String string);

	@Query("SELECT COUNT(DISTINCT i.borrowerId) FROM BookIssues i WHERE LOWER(i.status) <> 'returned'")
	long countDistinctBorrowersNotReturned();
}
	