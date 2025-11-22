package com.lms.book.models.pojos;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="book_details")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookDetails {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="book_id")
	private long bookId;
	
	@NotBlank(message="Title should not be blank")
	@Column(name="book_title",length=30, nullable = false)
	private String bookTitle;
	
	@NotBlank(message="Type should not be blank")
	@Column(name="book_type",length=20, nullable = false)
	private String bookType;
	
	@NotBlank(message="Author should not be blank")
	@Column(name="author",length=40, nullable = false)
	private String author;
	
	@NotBlank(message="Language should not be blank")
	@Column(name="book_language",length=10, nullable = false)
	private String bookLanguage;
	
	@NotBlank(message="description should not be blank")
	@Column(name="description",columnDefinition = "TEXT", nullable = false)
	private String description;
	
	@Min(value=0,message="Total copies cannot be negative or zero")
	@Column(name="total_copies", nullable = false)
	private int totalCopies;
	
	@Min(value=0,message="available copies cannot be negative")
	@Column(name="available_copies", nullable = false)
	private int availableCopies;
	
	@NotNull(message = "Book image cannot be null")
	@Lob
	@Column(name="book_image",columnDefinition = "MEDIUMBLOB", nullable = false)
	private byte[] bookImage;
	
	
	@Column(name="is_available", nullable = false)
	private boolean isAvailable;
	
	@Column(name="created_at", nullable = false)
	private LocalDateTime createdAt;
	
	@Column(name="deleted", nullable = false)
	private boolean deleted = false;

	
	@OneToMany(mappedBy = "bookDetails",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
	private List<BookCopies> bookCopies;

}
