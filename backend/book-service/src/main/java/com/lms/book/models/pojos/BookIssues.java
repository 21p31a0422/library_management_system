package com.lms.book.models.pojos;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "book_issues")
@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BookIssues {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "issue_id")
	private Long issueId;
	
	@JoinColumn(name = "borrower_id", referencedColumnName = "borrower_id")
	private Long borrowerId;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "book_id")
	private BookDetails bookDetails;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "copy_id")
	private BookCopies copyDetails;

	@Column(name = "issue_date")
	private LocalDateTime issueDate;

	@Column(name = "return_date")
	private LocalDateTime returnDate=null;

	@Column(name = "due_date")
	private LocalDateTime dueDate;

	@Column(name = "fine_amount")
	private float fineAmount=0;

	@Column(name = "status")
	private String status;
	
	@Column(name = "manager_id")
	private long managerId;
}
