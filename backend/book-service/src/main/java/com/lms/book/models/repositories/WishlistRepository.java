// WishlistRepository

package com.lms.book.models.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.lms.book.models.pojos.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByBorrowerIdAndBookTitle(Long borrowerId, String bookTitle);
    Optional<List<Wishlist>> findAllByBorrowerId(Long borrowerId);
    @Modifying
    @Transactional
    @Query("DELETE FROM Wishlist w WHERE w.borrowerId = :borrowerId AND w.bookTitle = :bookTitle")
    void deleteByBorrowerIdAndBookTitle(@Param("borrowerId") Long borrowerId,
                                        @Param("bookTitle") String bookTitle);
}