

package com.lms.book.models.dao.services;

import java.util.List;

import com.lms.book.models.dto.WishlistDTO;

public interface WishlistService {
	String addToWishlist(WishlistDTO dto);
	List<String> getBooksFromWishlist(Long borrowerId);
	String removeFromWishlist(Long borrowerId, String bookTitle);
}