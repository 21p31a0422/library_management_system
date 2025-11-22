package com.lms.authentication.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.lms.authentication.models.dao.serviceimpl.JwtService;
import com.lms.authentication.models.filters.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
	@Bean
	public PasswordEncoder passwordEncoder() 
	{
		return new BCryptPasswordEncoder();
	}
	
	private final JwtService jwtService; 
	 
	 public SecurityConfig(JwtService jwtService) { 
	  super(); 
	  this.jwtService = jwtService; 
	 } 
	 @Bean 
	    public JwtAuthenticationFilter jwtAuthenticationFilter() { 
	        return new JwtAuthenticationFilter(userDetailsService(), jwtService); 
	    } 
	 
//	 
	  @Bean 
	     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { 
	       http.authorizeHttpRequests 
	         (auth->auth.requestMatchers("/lms/borrower/Validate","/lms/manager/Validate","/lms/borrower/Validatetoken","/lms/borrower/getSecurityCredentials","/lms/borrower/updatePassword").permitAll() 
	           .anyRequest().authenticated()) 
	                 .sessionManagement(session -> session 
	                 .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) 
	                 .authenticationProvider(authenticationProvider()) 
	                 .addFilterBefore(jwtAuthenticationFilter(), 
	UsernamePasswordAuthenticationFilter.class) 
	                 .csrf(AbstractHttpConfigurer::disable); 
	            return http.build(); 
	                       
	     } 
	 
	 


//	 public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { 
//	 	       http.authorizeHttpRequests 
//	 	         (auth->auth.requestMatchers("/lms/borrower/Validate","/lms/manager/Validate","/lms/borrower/Validatetoken", "/lms/borrower/getSecurityCredentials", "/lms/borrower/updatePassword").permitAll() 
//	 	           .anyRequest().authenticated()) 
//	 	                 .sessionManagement(session -> session 
//	 	                 .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) 
//	 	                 .authenticationProvider(authenticationProvider()) 
//	 	                 .addFilterBefore(jwtAuthenticationFilter(), 
//	 	UsernamePasswordAuthenticationFilter.class) 
//	 	                 .csrf(AbstractHttpConfigurer::disable); 
//	 	            return http.build(); 
//	 	                       
//	 	     }
//	 
	  @Bean 
	  public UserDetailsService userDetailsService() 
	  { 
	   System.out.println("UserDetails Service"); 
	   return new NewUserDetailsService(); 
	  } 
	  @Bean 
	  public AuthenticationProvider authenticationProvider() 
	  { 
	   DaoAuthenticationProvider daoAuthenticationProvider=new 
	DaoAuthenticationProvider(); 
	   daoAuthenticationProvider.setUserDetailsService(userDetailsService());
	   daoAuthenticationProvider.setPasswordEncoder(passwordEncoder()); 
	   return daoAuthenticationProvider; 
	  } 
	   
	  @Bean 
	  public AuthenticationManager authenticationManager(AuthenticationConfiguration 
	config) throws Exception 
	  { 
	   return config.getAuthenticationManager(); 
	  } 
}
