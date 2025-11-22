//BorrowerServiceImpl


package com.lms.authentication.models.dao.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lms.authentication.models.customexceptions.BorrowerAccountUpdationException;
import com.lms.authentication.models.customexceptions.BorrowerEmailExistsException;
import com.lms.authentication.models.customexceptions.BorrowerNotFoundException;
import com.lms.authentication.models.customexceptions.InvalidPasswordException;
import com.lms.authentication.models.dao.services.BorrowerService;
import com.lms.authentication.models.dto.BorrowerProfileDTO;
import com.lms.authentication.models.dto.CreateAccountDTO;
import com.lms.authentication.models.dto.PasswordChangeDTO;
import com.lms.authentication.models.dto.PasswordUpdateDTO;
import com.lms.authentication.models.dto.UpdateAccountDTO;
import com.lms.authentication.models.pojos.AddressDetails;
import com.lms.authentication.models.pojos.BorrowerDetails;
import com.lms.authentication.models.pojos.ManagerDetails;
import com.lms.authentication.models.repositories.BorrowerRepo;
import com.lms.authentication.models.repositories.ManagerRepo;

import jakarta.validation.Valid;

@Service
public class BorrowerServiceImpl implements BorrowerService {
	
	@Autowired
	private BorrowerRepo borrowerRepo;
	@Autowired
	private ManagerRepo managerRepo;
	@Autowired
	private ManagerServiceImpl serviceImpl;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
@Override
	public String createBorrowerAccount(CreateAccountDTO dto) {
		Optional<BorrowerDetails> opt = borrowerRepo.findByBorrowerEmail(dto.getBorrowerEmail());
		
		if (opt.isPresent()) {
			throw new BorrowerEmailExistsException("A Borrower account with " + dto.getBorrowerEmail() + " already exists");
		}
		try {
			BorrowerDetails saveBorrower = new BorrowerDetails();
			saveBorrower.setBorrowerEmail(dto.getBorrowerEmail());
			saveBorrower.setPassword(passwordEncoder.encode(dto.getPassword()));
		
			Optional<ManagerDetails>op=managerRepo.findById(dto.getManagerId());
			if(op.isPresent())
			{
			ManagerDetails manager = op.get();
			saveBorrower.setManager(manager);
			}
			borrowerRepo.save(saveBorrower);
			return "Account Created Successfully";
			
		} catch (Error e) {
			throw new RuntimeException("Error while creating Borrower Account");
		}
		
	}
	
	
	
	@Override
	public BorrowerDetails updateBorrowerAccount(UpdateAccountDTO dto) {
		Optional<BorrowerDetails> opt = borrowerRepo.findByBorrowerEmailAndDeletedFalse(dto.getBorrowerEmail());
		
		if(opt.isEmpty()) {
			throw new BorrowerNotFoundException("No Account exists with " + dto.getBorrowerEmail());
		}
				
		BorrowerDetails borrower = opt.get();
		AddressDetails address = new AddressDetails();
		
		ManagerDetails manager = serviceImpl.getManagerById(borrower.getManager().getManagerId());
		
		if (borrowerRepo.findByMobileNumber(dto.getMobileNumber()).isPresent()) {
			throw new BorrowerAccountUpdationException("Mobile Number Already Exists");
		}
		if (borrowerRepo.findByUserName(dto.getUserName()).isPresent()) {
			throw new BorrowerAccountUpdationException("User Name Already Exists");
		}
		
		
		address.setArea(dto.getArea());
		address.setDoorNo(dto.getDoorNo());
		address.setLandmark(dto.getLandmark());
		address.setState(dto.getState());
		address.setStreetName(dto.getStreetName());
		
		borrower.setFirstName(dto.getFirstName());
		borrower.setLastName(dto.getLastName());
		borrower.setMobileNumber(dto.getMobileNumber());
		borrower.setUserName(dto.getUserName());
		borrower.setProfileComplete(true);
		borrower.setLastVisited(LocalDateTime.now());
		borrower.setSecurityQue1(dto.getSecurityQue1());
		borrower.setSecurityQue2(dto.getSecurityQue2());
		borrower.setSecurityAns1(dto.getSecurityAns1());
		borrower.setSecurityAns2(dto.getSecurityAns2());

		borrower.setAddress(address);
		manager.getBorrowers().add(borrower);
		return borrowerRepo.save(borrower);
	}
	
	@Override
	public List<BorrowerDetails> getBorrowerList() {
		List<BorrowerDetails> borrowerList = borrowerRepo.findAll();
		
		if (borrowerList.size() < 1) {
			throw new BorrowerNotFoundException("No Borrower Exists");
		}
		return borrowerList;
	}
	
	@Override
	public String deleteBorrowerAccount(String email) {
		Optional<BorrowerDetails> opt = borrowerRepo.findByBorrowerEmailAndDeletedFalse(email);
		
		
		if(opt.isEmpty()) {
			throw new BorrowerNotFoundException("No Borrower with email " + email + "exists");
		}
		System.out.println("from delete");
		BorrowerDetails borrower = opt.get();
		//ManagerDetails manager = borrower.getManager(); // assuming borrower has a reference to its manager
//		if (manager != null) {
//		    manager.getBorrowers().remove(borrower);
//		}

		borrower.setDeleted(true);
		borrowerRepo.save(borrower);
		return "Account with email "+ email +" Deleted Successfully";
	}

	@Override
	public String findBorrowerId(Long borrowerId) {
		// TODO Auto-generated method stub
		Optional op=borrowerRepo.findByBorrowerIdAndDeletedFalse(borrowerId);
		if(op.isEmpty())
		{
			return "Not Found";
		}
		return "Found";
	}

	@Override
	public BorrowerProfileDTO getBorrowerByBorrowerId(Long borrowerId) {
		
		try {
		Optional<BorrowerDetails> opt = borrowerRepo.findByBorrowerIdAndDeletedFalse(borrowerId);
		
		if (opt.isEmpty()) {
			throw new BorrowerNotFoundException("No Borrower Found");
		}
		
		BorrowerDetails bwrObj = opt.get();
	    return new BorrowerProfileDTO(
	            bwrObj.getBorrowerId(),
	            bwrObj.getUserName(),
	            bwrObj.getFirstName(),
	            bwrObj.getLastName(),
	            bwrObj.getMobileNumber(),
	            bwrObj.getAddress().getDoorNo(),
	            bwrObj.getAddress().getStreetName(),
	            bwrObj.getAddress().getLandmark(),
	            bwrObj.getAddress().getArea(),
	            bwrObj.getAddress().getState(),
	            bwrObj.getSecurityQue1(),
	            bwrObj.getSecurityQue2(),
	            bwrObj.getSecurityAns1(),
	            bwrObj.getSecurityAns2());
		}
		catch(Exception e)
		{
			throw new BorrowerNotFoundException("No Borrower Found");
		}
	}




	@Override
	public String updateBorrowerProfile(BorrowerProfileDTO dto) {
		Optional<BorrowerDetails> opt = borrowerRepo.findByBorrowerIdAndDeletedFalse(dto.getBorrowerId());
		
		if (opt.isEmpty()) {
			throw new BorrowerNotFoundException("Borrower not found");
		}
		
		try {
			BorrowerDetails borrowerObj = opt.get();
			AddressDetails addressObj = borrowerObj.getAddress(); 
			addressObj.setArea(dto.getArea());
			addressObj.setDoorNo(dto.getDoorNo());
			addressObj.setLandmark(dto.getLandmark());
			addressObj.setState(dto.getState());
			addressObj.setStreetName(dto.getStreetName());
			
			borrowerObj.setFirstName(dto.getFirstName());
			borrowerObj.setLastName(dto.getLastName());
			borrowerObj.setAddress(addressObj);
			borrowerRepo.save(borrowerObj);
			return "Information Updated Successfully";
			
		} catch (Error e) {
			throw new RuntimeException("Error while updating Borrower Account");
		}
	}



	@Override
	public String changePassword(PasswordChangeDTO dto) {
		System.out.println("In BWR SERvice impl-------------");
		Optional<BorrowerDetails> opt = borrowerRepo.findByBorrowerIdAndDeletedFalse(dto.getBorrowerId());
		if(opt.isEmpty()) {
			throw new BorrowerNotFoundException("No Borrower with Id " + dto.getBorrowerId() + "exists");
		}
		
		try {
			BorrowerDetails borrower = opt.get();
			if (!passwordEncoder.matches(dto.getOldPwd(),borrower.getPassword())) {
				throw new InvalidPasswordException("Please check your Old Password and try again");
			} 
			borrower.setPassword(passwordEncoder.encode(dto.getNewPwd()));
			borrowerRepo.save(borrower);
			return "Password Changed Successfully";
		} catch (Error e) {
			throw new RuntimeException("Error while creating Borrower Account");
		}
		
	}

	@Override
	public BorrowerProfileDTO getSecurityCredentials(String borrowerEmail) {
		Optional<BorrowerDetails> opt = borrowerRepo.findByBorrowerEmailAndDeletedFalse(borrowerEmail);
		
		if (opt.isEmpty()) {
			throw new BorrowerNotFoundException("No Borrower with email " + borrowerEmail + "exists");
		}
		
		BorrowerProfileDTO borrower = new BorrowerProfileDTO();
		borrower.setSecurityQue1(opt.get().getSecurityQue1());
		borrower.setSecurityQue2(opt.get().getSecurityQue2());
		borrower.setSecurityAns1(opt.get().getSecurityAns1());
		borrower.setSecurityAns2(opt.get().getSecurityAns2());
		return borrower;
	}

	@Override
	public String updatePassword(PasswordUpdateDTO dto) {
		Optional<BorrowerDetails> opt = borrowerRepo.findByBorrowerEmailAndDeletedFalse(dto.getBorrowerEmail());
		
		if (opt.isEmpty()) {
			throw new BorrowerNotFoundException("No Borrower with email " + dto.getBorrowerEmail() + "exists");
		}
		
		BorrowerDetails borrower = opt.get();
		borrower.setPassword(passwordEncoder.encode(dto.getPassword()));
		borrowerRepo.save(borrower);
		return "Password Changed Successfully";
	}
	
	
}