//CreateAccountDTO

package com.lms.authentication.models.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class CreateAccountDTO {
	
	@Email(message = "Invalid Email Format")
	@NotBlank(message = "Email cannot be Empty")
	private String borrowerEmail;
	
	@Pattern(
			 regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])\\S{8,}$",
    	    message = "Password must be at least 8 characters long, contain at least one uppercase, one lowercase, one digit, one special character (@#$%^&+=!), and must not contain spaces."
    	)
	private String password;
	
	private int managerId;
}