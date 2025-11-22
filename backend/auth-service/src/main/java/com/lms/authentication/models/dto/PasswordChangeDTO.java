// PaswordChangeDTO


package com.lms.authentication.models.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeDTO {
    
    @NotNull(message = "Borrower ID cannot be null")
    @Min(value = 1, message = "Borrower ID must be greater than 0")
    private Long borrowerId;

    @Pattern(
    		 regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])\\S{8,}$",
    	    message = "New Password must be at least 8 characters long, contain at least one uppercase, one lowercase, one digit, one special character (@#$%^&+=!), and must not contain spaces."
    	)
    private String newPwd;


    private String oldPwd;
}