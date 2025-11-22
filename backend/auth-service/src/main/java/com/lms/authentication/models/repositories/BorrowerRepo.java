package com.lms.authentication.models.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lms.authentication.models.pojos.BorrowerDetails;

@Repository
public interface BorrowerRepo extends JpaRepository<BorrowerDetails, Long> {
	Optional<BorrowerDetails> findByBorrowerEmail(String borrowerEmail);
	Optional<BorrowerDetails> findByMobileNumber(String mobileNumber);
	Optional<BorrowerDetails> findByUserName(String userName);
//	Optional<BorrowerDetails> findByBorrowerId(Long borrowerId);
	Optional<BorrowerDetails> findByBorrowerEmailAndDeletedFalse(String borrowerEmail);

	Optional<BorrowerDetails> findByMobileNumberAndDeletedFalse(String mobileNumber);

	Optional<BorrowerDetails> findByUserNameAndDeletedFalse(String userName);

	Optional findByBorrowerIdAndDeletedFalse(Long borrowerId);
	
}
