// BorrowerDetails
package com.lms.authentication.models.pojos;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "borrower_details")
public class BorrowerDetails {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "borrower_id")
	private Long borrowerId;
	
	@Column(name = "borrower_email", length = 40, unique = true)
	private String borrowerEmail;
	
	@Column(name = "password")
	private String password;
	
	@Column(name = "user_name", length = 20, unique = true,nullable=true)
	private String userName; 
	
	@Column(name = "first_name", length = 30,nullable=true)
	private String firstName;
	
	@Column(name = "last_name", length = 20,nullable=true)
	private String lastName;
	
	@Column(name = "mobile_number", unique = true,nullable=true)
	private String mobileNumber;

	@Column(name = "last_visited",nullable=true)
	private LocalDateTime lastVisited;
	
	@Column(name = "is_profile_complete")
	private boolean isProfileComplete = false;
	
	@OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "address_id",nullable=true)
	private AddressDetails address;
	
	@Column(name="role") 
	private String role="user";

	@ManyToOne
	@JoinColumn(name = "manager_id")
	@ToString.Exclude
	@JsonIgnoreProperties("borrower") // avoid recursion in JSON
	private ManagerDetails manager;
	
	private String securityQue1;
	
	private String securityQue2;
	
	private String securityAns1;
	
	private String securityAns2;
	
	@Column(name="deleted", nullable = false)
	private boolean deleted = false;
	
	
}