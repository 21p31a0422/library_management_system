package com.lms.authentication.config;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;



public class NewUserDetails implements UserDetails {

	private String email; 
	  private String password; 
	  private List<GrantedAuthority> role; 
	 public NewUserDetails(String email,String password,String role) { 
	 super(); 
	 this.email = email;  //xyz 
	 this.password = password;  //abc 
	 this.role = Arrays.stream(role.split(",")) 
	    .map(SimpleGrantedAuthority::new) 
	    .collect(Collectors.toList()); 
	} 
	 @Override 
	 public Collection<? extends GrantedAuthority> getAuthorities() { 
	  // TODO Auto-generated method stub 
	
	  return this.role; 
	 } 
	 @Override 
	 public String getPassword() { 
	  return this.password; 
	 } 
	 @Override 
	 public String getUsername() { 
	  return this.email; 
	 } 

}
