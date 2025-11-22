

package com.lms.authentication.models.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {

	@Email(message = "Invalid Email Format")
	@NotBlank(message = "Email cannot be Empty")
	private String email;
	
	private String password;
	
	private String role;
}