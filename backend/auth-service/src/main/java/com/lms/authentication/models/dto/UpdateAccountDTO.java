// UpdateAccountDTO
package com.lms.authentication.models.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAccountDTO {
	
	@Email(message = "Invalid Email Format")
	@NotBlank(message = "Email cannot be Empty")
	private String borrowerEmail;

	@NotBlank(message = "User Name cannot be empty")
	private String userName; 
	
	@NotBlank(message = "First Name cannot be empty")
	private String firstName;
	
	private String lastName;
	
	@Pattern(regexp = "[6-9][0-9]{9}", message = "Mobile Number is Invalid")
	@NotBlank(message = "Mobile Number cannot be empty")
	private String mobileNumber;
	
	@NotBlank(message = "Door No cannot be empty")
    private String doorNo;
	
	@Size(max = 100, message = "Street Name cannot exceed 100 characters")
	@NotBlank(message = "Street Name cannot be blank")
    private String streetName;
	
	@Size(max = 100, message = "Landmark cannot exceed 100 characters")
    private String landmark; 
	
	@Size(max = 100, message = "Area cannot exceed 100 characters")
	@NotBlank(message = "Area cannot be blank")
    private String area;
	
	@Size(max = 50, message = "State cannot exceed 50 characters")
	@NotBlank(message = "State cannot be blank")
    private String state;
	
	@NotBlank(message = "Security Question cannot be empty")
	private String securityQue1;
	
	@NotBlank(message = "Security Question cannot be empty")
	private String securityQue2;
	
	@NotBlank(message = "Security Answer cannot be empty")
	private String securityAns1;
	
	@NotBlank(message = "Security Answer cannot be empty")
	private String securityAns2;
	
}