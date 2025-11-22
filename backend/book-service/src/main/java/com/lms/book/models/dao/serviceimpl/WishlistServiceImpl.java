// WishlistServiceImpl

package com.lms.book.models.dao.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lms.book.models.customexceptions.BookNotFoundException;
import com.lms.book.models.customexceptions.WishlistAlreadyExistsException;
import com.lms.book.models.customexceptions.WishlistNotFoundException;
import com.lms.book.models.dao.services.WishlistService;
import com.lms.book.models.dto.WishlistDTO;
import com.lms.book.models.pojos.BookDetails;
import com.lms.book.models.pojos.Wishlist;
import com.lms.book.models.repositories.BookRepo;
import com.lms.book.models.repositories.WishlistRepository;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private BookRepo bookRepo;

    @Override
    public String addToWishlist(WishlistDTO dto) {
    	Optional<BookDetails>op=bookRepo.findByBookTitleIgnoreCaseAndDeletedFalse(dto.getBookTitle());
    	if(op.isEmpty())
    	{
    		throw new BookNotFoundException("Book Not Found");
    	}
    	Optional<Wishlist> existing = wishlistRepository.findByBorrowerIdAndBookTitle(dto.getBorrowerId(), dto.getBookTitle());
//        System.out.println("Entered into service impl");
        if (existing.isPresent()) {
            throw new WishlistAlreadyExistsException(
                    "Book already exists in wishlist for borrowerId: " + dto.getBorrowerId());
        }
//        System.out.println("Entered into service impl2");
        Wishlist wishlist = new Wishlist();
        wishlist.setBorrowerId(dto.getBorrowerId());
        wishlist.setBookTitle(dto.getBookTitle());
        wishlist.setDateAdded(LocalDateTime.now());
        System.out.println("Entered into service impl3");
        wishlistRepository.save(wishlist);
        return "Book added to wishlist successfully";
    }

    @Override
    public List<String> getBooksFromWishlist(Long borrowerId) {
    	
        Optional<List<Wishlist>> op = wishlistRepository.findAllByBorrowerId(borrowerId);

        if (op.isEmpty()) {
            throw new WishlistNotFoundException("No books found in wishlist for borrowerId: " + borrowerId);
        }
        List<Wishlist> wishlistEntries=op.get();
        
        List<String> titles = wishlistEntries.stream()
                .map(Wishlist::getBookTitle)
                .collect(Collectors.toList());

        return titles;
    }

    @Override
    public String removeFromWishlist(Long borrowerId, String bookTitle) {
        Optional<Wishlist> existing = wishlistRepository.findByBorrowerIdAndBookTitle(borrowerId, bookTitle);

        if (existing.isEmpty()) {
            throw new BookNotFoundException("Book not found in wishlist for borrowerId: " + borrowerId);
        }

        wishlistRepository.deleteByBorrowerIdAndBookTitle(borrowerId, bookTitle);
        return "Book removed from wishlist successfully";
    }
}