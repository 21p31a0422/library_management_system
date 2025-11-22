package com.lms.book.models.repositories;


import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lms.book.models.dto.BookDTO;
import com.lms.book.models.pojos.BookDetails;

@Repository
public interface BookRepo extends JpaRepository<BookDetails,Integer> {


	
	
	Optional<BookDetails> findByBookIdAndDeletedFalse(Long bookId);
	Page<BookDetails> findByDeletedFalse(Pageable pageable);
	Optional<BookDetails> findByBookTitleIgnoreCaseAndDeletedFalse(String bookTitle);
	List<BookDetails> findByDeletedFalse();
	@Query("SELECT b.bookTitle FROM BookDetails b WHERE b.deleted = false")
	List<String> findAllTitlesByDeletedFalse();
	@Query("SELECT DISTINCT b.bookType FROM BookDetails b WHERE b.deleted = false")
	List<String> findDistinctBookTypesByDeletedFalse();

	Page<BookDetails> findByBookTypeAndDeletedFalse(Pageable pageable, String bookType);
	
	@Query("SELECT b.bookType AS type, COUNT(b) AS count FROM BookDetails b WHERE b.deleted = false GROUP BY b.bookType")
	List<Object[]> findBookTypeCount();
	@Query("SELECT b FROM BookDetails b WHERE b.createdAt >= ?1 AND b.deleted = false")
	Page<BookDetails> findNewReleases(LocalDateTime threeDaysAgo, Pageable pageable);
	long countByDeletedFalse();
	Optional<BookDetails> findByBookTitleIgnoreCase(String bookTitle);
}
