//change password dto 

package com.lms.authentication.models.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordDTO {
    @NotBlank(message = "Email is required")
    private String email;
    
   
    private String currentPassword;
    
    @Pattern(
    	    regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])\\S{8,}$",
    	    message = "New Password must be at least 8 characters long, contain at least one uppercase, one lowercase, one digit, one special character (@#$%^&+=!), and must not contain spaces."
    	)
    private String newPassword;
}