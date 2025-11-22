// BorrowerController
package com.lms.authentication.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lms.authentication.models.dao.serviceimpl.JwtService;
import com.lms.authentication.models.dao.services.BorrowerService;
import com.lms.authentication.models.dao.services.LoginService;
import com.lms.authentication.models.dto.BorrowerProfileDTO;
import com.lms.authentication.models.dto.CreateAccountDTO;
import com.lms.authentication.models.dto.LoginDTO;
import com.lms.authentication.models.dto.PasswordChangeDTO;
import com.lms.authentication.models.dto.PasswordUpdateDTO;
import com.lms.authentication.models.dto.UpdateAccountDTO;
import com.lms.authentication.models.pojos.BorrowerDetails;
import com.lms.authentication.models.repositories.BorrowerRepo;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/lms/borrower")
public class BorrowerController {
	
	@Autowired
	private BorrowerService borrowerService;
	
	
	@Autowired
	private LoginService loginService;
	
	@Autowired
	private JwtService jwtService;
	
	@PutMapping("/updateAccount")
	public ResponseEntity<BorrowerDetails> updateBorrowerAccount(@Valid @RequestBody UpdateAccountDTO dto) {
		return new ResponseEntity<BorrowerDetails>(borrowerService.updateBorrowerAccount(dto), HttpStatus.OK);
	}
		
	@GetMapping("/fetchBorrowers")
	public ResponseEntity<List<BorrowerDetails>> getBorrowerList() {
		return new ResponseEntity<List<BorrowerDetails>>(borrowerService.getBorrowerList(), HttpStatus.OK);
	}
	@PostMapping("/findborrower")
	public ResponseEntity<String> findBorrowerId(@RequestParam Long borrowerId) {
		return new ResponseEntity<String>(borrowerService.findBorrowerId(borrowerId),HttpStatus.OK);
	}
	
	@DeleteMapping("/deleteAccount")
	public ResponseEntity<String> deleteBorrowerAccount(@RequestParam String email) {
		return new ResponseEntity<String> (borrowerService.deleteBorrowerAccount(email), HttpStatus.OK);
	}
	@PostMapping("/Validate") 
	 public ResponseEntity<Map<String,String>> LoginValidate(@Valid @RequestBody LoginDTO logindto) 
	 { 
	   return new ResponseEntity<Map<String,String>>(loginService.validateLogin(logindto),HttpStatus.OK); 
	 } 
	 @GetMapping("/Validatetoken")
	    public String validateToken(@RequestParam("Authorization") String token) {
	      System.out.println("In Validation Token");
		     if(jwtService.validateToken(token))
		     return jwtService.extractRoleFromToken(token);
		     else
		    	return  "Not Valid";
	 }
	
	 
	 @GetMapping("/getBorrowerByBorrowerId")
	 public ResponseEntity<BorrowerProfileDTO> getBorrowerByBorrowerId(@RequestParam Long borrowerId) {
		 return new ResponseEntity<BorrowerProfileDTO>(borrowerService.getBorrowerByBorrowerId(borrowerId), HttpStatus.OK);
	 }
	 
	 @PutMapping("/changePassword")
	 public ResponseEntity<String> changePassword(@Valid @RequestBody PasswordChangeDTO dto) {
		 return new ResponseEntity<String>(borrowerService.changePassword(dto), HttpStatus.OK);
	 }

	 @GetMapping("/getSecurityCredentials")
	 public ResponseEntity<BorrowerProfileDTO> getSecurityCredentials(@RequestParam String borrowerEmail) {
		 return new ResponseEntity<BorrowerProfileDTO>(borrowerService.getSecurityCredentials(borrowerEmail), HttpStatus.OK);
	 }

	 @PutMapping("/updatePassword")
	 public ResponseEntity<String> updatePassword(@Valid @RequestBody PasswordUpdateDTO dto) {
		 return new ResponseEntity<String>(borrowerService.updatePassword(dto), HttpStatus.OK);
	 }
	 @PutMapping("/updateBorrowerProfile")
	 public ResponseEntity<String> updateBorrowerProfile(@Valid @RequestBody BorrowerProfileDTO dto) {
		 return new ResponseEntity<String>(borrowerService.updateBorrowerProfile(dto), HttpStatus.OK);
	 }
}