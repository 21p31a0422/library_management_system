package com.lms.authentication.config;

import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.lms.authentication.models.pojos.BorrowerDetails;
import com.lms.authentication.models.pojos.ManagerDetails;
import com.lms.authentication.models.repositories.BorrowerRepo;
import com.lms.authentication.models.repositories.ManagerRepo;

public class NewUserDetailsService implements UserDetailsService {
	@Autowired
	private BorrowerRepo borrowerRepo;
	
	@Autowired
	private ManagerRepo managerRepo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		
		
		Optional<BorrowerDetails>borrowerOp=borrowerRepo.findByBorrowerEmailAndDeletedFalse(username);
		if(borrowerOp.isPresent())
		{
			return new NewUserDetails(borrowerOp.get().getBorrowerEmail(),borrowerOp.get().getPassword(),borrowerOp.get().getRole().toUpperCase());
		}
		else
		{
			
			Optional<ManagerDetails>managerOp1=managerRepo.findByEmailAndDeletedFalse(username);
			if(managerOp1.isPresent())
			{
				System.out.println("hii");
				return new NewUserDetails(managerOp1.get().getEmail(),managerOp1.get().getPassword(),managerOp1.get().getRole().toUpperCase());
			}
			else
			{
				throw new UsernameNotFoundException("Email not found");	
			}
		}
		
			
		
		
	}

}
