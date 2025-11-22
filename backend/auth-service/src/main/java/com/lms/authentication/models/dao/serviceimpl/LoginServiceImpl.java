//package com.lms.authentication.models.dao.serviceimpl;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import com.lms.authentication.models.dao.services.LoginService;
//import com.lms.authentication.models.dto.LoginDTO;
//import com.lms.authentication.models.pojos.BorrowerDetails;
//import com.lms.authentication.models.pojos.ManagerDetails;
//import com.lms.authentication.models.repositories.BorrowerRepo;
//import com.lms.authentication.models.repositories.ManagerRepo;
//
//@Service
//public class LoginServiceImpl implements LoginService {
//
//	@Autowired
//	private BorrowerRepo borrowerRepository;
//
//	@Autowired
//	private ManagerRepo managerRepository;
//
//	@Autowired
//	private PasswordEncoder passwordEncoder;
//
//	@Autowired
//	private JwtService jwtService;
//
//	@Autowired
//	private AuthenticationManager authenticationManager;
//
//	@Override
//	public Map<String, String> validateLogin(LoginDTO logindto) {
//		// TODO Auto-generated method stub
//		Map<String, String> usermap = new HashMap<String, String>();
//
//		String role = logindto.getRole();
//		String email = logindto.getEmail();
//		String password = logindto.getPassword();
//		String dbEmail = "";
//		String dbPassword = "";
//		String dbRole = "";
//		if ("BORROWER".equalsIgnoreCase(role)) {
//			Optional<BorrowerDetails> borrowerOp = borrowerRepository.findByBorrowerEmail(email);
//			dbEmail = borrowerOp.get().getBorrowerEmail();
//			dbPassword = borrowerOp.get().getPassword();
//			dbRole = borrowerOp.get().getRole();
//		} else {
//			Optional<ManagerDetails> managerOp = managerRepository.findByEmail(email);
//			System.out.println("hii");
//			dbEmail = managerOp.get().getEmail();
//			dbPassword = managerOp.get().getPassword();
//			dbRole = managerOp.get().getRole();
//		
//		}
//
//		if (dbEmail.length() == 0) {
//			usermap.put("error", "Email not found");
//			return usermap;
//		} else if (!passwordEncoder.matches(password, dbPassword)) {
//			usermap.put("error", "Password not correct");
//			
//			return usermap;
//		} else {
//			System.out.println("hello");
//
//			Authentication authentication = authenticationManager.authenticate(
//					new UsernamePasswordAuthenticationToken(logindto.getEmail(), logindto.getPassword()));
//			
//			System.out.println("hii");
//			if (authentication.isAuthenticated()) {
//
//				usermap.put("role", dbRole);
//
//				usermap.put("token", jwtService.generateToken(authentication.getName(),
//						authentication.getAuthorities().toArray()[0].toString()));
//				return usermap;
//			}
//		}
//		return usermap;
//	}
//
//}
package com.lms.authentication.models.dao.serviceimpl;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lms.authentication.models.dao.services.LoginService;
import com.lms.authentication.models.dto.LoginDTO;
import com.lms.authentication.models.pojos.BorrowerDetails;
import com.lms.authentication.models.pojos.ManagerDetails;
import com.lms.authentication.models.repositories.BorrowerRepo;
import com.lms.authentication.models.repositories.ManagerRepo;

@Service
public class LoginServiceImpl implements LoginService {

	@Autowired
	private BorrowerRepo borrowerRepository;

	@Autowired
	private ManagerRepo managerRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Override
	public Map<String, String> validateLogin(LoginDTO logindto) {
		// TODO Auto-generated method stub
		Map<String, String> usermap = new HashMap<String, String>();
		
		usermap.put("isProfileComplete", null);
		String role = logindto.getRole();
		String email = logindto.getEmail();
		String password = logindto.getPassword();
		String dbEmail = "";
		String dbPassword = "";
		String dbRole = "";
		
		if ("BORROWER".equalsIgnoreCase(role)) {
			System.out.println("Auth service-LoginServiceImpl - 53 Borrower" + role);
			Optional<BorrowerDetails> borrowerOp = borrowerRepository.findByBorrowerEmailAndDeletedFalse(email);
			if (borrowerOp.isPresent()) {
				dbEmail = borrowerOp.get().getBorrowerEmail();
				dbPassword = borrowerOp.get().getPassword();
				dbRole = borrowerOp.get().getRole();
				usermap.put("isProfileComplete", borrowerOp.get().isProfileComplete() ? "true" : "false");
				usermap.put("id", ""+borrowerOp.get().getBorrowerId());
			}
		} else {
			System.out.println("Auth service-LoginServiceImpl - 59 Manager" + role);
			Optional<ManagerDetails> managerOp = managerRepository.findByEmailAndDeletedFalse(email);
			System.out.println("In Login service Impl of auth-service");
			if (managerOp.isPresent()) {
				dbEmail = managerOp.get().getEmail();
				dbPassword = managerOp.get().getPassword();
				dbRole = managerOp.get().getRole();
				usermap.put("id", "" + managerOp.get().getManagerId());
			}
			
		}

		if (dbEmail.length() == 0) {
			usermap.put("error", "Email not found");
			return usermap;
		} else if (!passwordEncoder.matches(password, dbPassword)) {
			usermap.put("error", "Password not correct");
			
			return usermap;
		} else {
			System.out.println("In Login service Impl of auth-service");

			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(logindto.getEmail(), logindto.getPassword()));
			
			System.out.println("In Login service Impl of auth-service");
			if (authentication.isAuthenticated()) {

				usermap.put("role", dbRole);

				usermap.put("token", jwtService.generateToken(authentication.getName(),
						authentication.getAuthorities().toArray()[0].toString()));
				
				usermap.put("email", dbEmail);
				
				return usermap;
			}
		}
		return usermap;
	}

}