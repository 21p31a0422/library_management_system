//package com.lms.authentication.models.repositories;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.lms.authentication.models.pojos.ManagerDetails;
//
//import java.util.Optional;
//
//public interface ManagerRepo extends JpaRepository<ManagerDetails, Integer> {
//    Optional<ManagerDetails> findByEmail(String email);
//}
package com.lms.authentication.models.repositories;

import com.lms.authentication.models.pojos.ManagerDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ManagerRepo extends JpaRepository<ManagerDetails, Integer> {
	Optional<ManagerDetails> findByEmailAndDeletedFalse(String email);

    List<ManagerDetails> findByDeletedFalse();
    
    @Modifying
    @Query("UPDATE ManagerDetails m SET m.deleted = true WHERE m.managerId = :id")
    @Transactional
    void softDelete(@Param("id") int id);

	

	Optional<ManagerDetails> findByManagerIdAndDeletedFalse(int id);
}