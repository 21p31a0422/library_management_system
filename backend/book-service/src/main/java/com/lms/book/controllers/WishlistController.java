package com.lms.book.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lms.book.models.dao.services.WishlistService;
import com.lms.book.models.dto.WishlistDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/lms/wishlist")
public class WishlistController {
	
	@Autowired
	private WishlistService wishlistService;
	
	@PostMapping("/addToWishlist")
	public ResponseEntity<String> addToWishlist(@RequestBody @Valid WishlistDTO dto) {
		System.out.println("In WishlistController");
		return new ResponseEntity<String>(wishlistService.addToWishlist(dto), HttpStatus.OK);
	}
	
	@GetMapping("/getBooksFromWishlist")
	public ResponseEntity<List<String>> getBooksFromWishlist(@RequestParam Long borrowerId) {
		List<String> bookList = wishlistService.getBooksFromWishlist(borrowerId);
		return new ResponseEntity<List<String>>(bookList, HttpStatus.OK);
	}
	
	@DeleteMapping("/removeFromWishlist")
	public ResponseEntity<String> removeFromWishlist(@RequestParam Long borrowerId, @RequestParam String bookTitle) {
		return new ResponseEntity<String>(wishlistService.removeFromWishlist(borrowerId, bookTitle), HttpStatus.OK);
	}
}