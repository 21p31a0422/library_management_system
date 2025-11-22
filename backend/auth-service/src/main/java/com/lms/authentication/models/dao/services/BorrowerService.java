// BorowerService
package com.lms.authentication.models.dao.services;

import java.util.List;
import java.util.Map;

import com.lms.authentication.models.dto.BorrowerProfileDTO;
import com.lms.authentication.models.dto.CreateAccountDTO;
import com.lms.authentication.models.dto.LoginDTO;
import com.lms.authentication.models.dto.PasswordChangeDTO;
import com.lms.authentication.models.dto.PasswordUpdateDTO;
import com.lms.authentication.models.dto.UpdateAccountDTO;
import com.lms.authentication.models.pojos.BorrowerDetails;

public interface BorrowerService {
	BorrowerDetails updateBorrowerAccount(UpdateAccountDTO dto);
	String createBorrowerAccount(CreateAccountDTO dto);
	List<BorrowerDetails> getBorrowerList();
	String deleteBorrowerAccount(String email);
	String findBorrowerId(Long borrowerId);
	BorrowerProfileDTO getBorrowerByBorrowerId(Long borrowerId);
	String updateBorrowerProfile(BorrowerProfileDTO dto);
	String changePassword(PasswordChangeDTO dto);
	BorrowerProfileDTO getSecurityCredentials(String borrowerEmail);
	String updatePassword(PasswordUpdateDTO dto); 
}