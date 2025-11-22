package com.lms.book.models.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lms.book.models.pojos.BookCopies;
import com.lms.book.models.pojos.BookDetails;

@Repository
public interface CopyRepo extends JpaRepository<BookCopies, Long> {



	
	Optional<BookCopies> findByCopyIdAndDeletedFalse(Long copyId);
	
	@Query("SELECT c FROM BookCopies c WHERE c.bookDetails.bookId = ?1 AND c.deleted = false")
	List<BookCopies> findByBookId(Long bookId);
	
	@Query("SELECT b FROM BookCopies b WHERE b.bookDetails.bookId = ?1 AND UPPER(b.copyStatus) = 'AVAILABLE' AND b.deleted = false")
    List<BookCopies> findByBookIdAndcopyStatus(Long bookId);
	
	
	

}
