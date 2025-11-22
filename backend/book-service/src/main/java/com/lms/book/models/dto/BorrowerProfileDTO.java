package com.lms.book.models.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BorrowerProfileDTO {
	
	private Long borrowerId;
	private String userName;
	private String firstName;
	private String lastName;
	private String mobileNumber;
    private String doorNo;
    private String streetName;
    private String landmark;
    private String area;
    private String state;
	
}