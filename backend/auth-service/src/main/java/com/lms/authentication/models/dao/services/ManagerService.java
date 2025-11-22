//package com.lms.authentication.models.dao.services;
//
//import java.util.List;
//
//import com.lms.authentication.models.dto.ChangePasswordDTO;
//import com.lms.authentication.models.dto.CreateManagerDTO;
//import com.lms.authentication.models.dto.ManagerLoginDTO;
//import com.lms.authentication.models.pojos.ManagerDetails;
//
//import jakarta.validation.Valid;
//
//public interface ManagerService {
//    boolean login(ManagerLoginDTO dto);
//    ManagerDetails createManager(CreateManagerDTO dto);
//    List<ManagerDetails> getAllManagers();
//    ManagerDetails getManagerById(int id);
//	boolean changePassword(@Valid ChangePasswordDTO dto);
//}
package com.lms.authentication.models.dao.services;

import java.util.List;

import org.springframework.http.HttpStatusCode;

import com.lms.authentication.models.dto.ChangePasswordDTO;
import com.lms.authentication.models.dto.CreateManagerDTO;
import com.lms.authentication.models.dto.ManagerLoginDTO;
import com.lms.authentication.models.pojos.ManagerDetails;

import jakarta.validation.Valid;

public interface ManagerService {
    boolean login(ManagerLoginDTO dto);
    ManagerDetails createManager(CreateManagerDTO dto);
    List<ManagerDetails> getAllManagers();
    ManagerDetails getManagerById(int id);
    boolean changePassword(@Valid ChangePasswordDTO dto);
    void softDelete(int id);
	String updatePassword(int managerId, String newPassword);
}