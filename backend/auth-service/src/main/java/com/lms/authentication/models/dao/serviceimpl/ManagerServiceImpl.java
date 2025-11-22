//package com.lms.authentication.models.dao.serviceimpl;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import com.lms.authentication.models.customexceptions.DuplicateEmailException;
//import com.lms.authentication.models.dao.services.ManagerService;
//import com.lms.authentication.models.dto.ChangePasswordDTO;
//import com.lms.authentication.models.dto.CreateManagerDTO;
//import com.lms.authentication.models.dto.ManagerLoginDTO;
//import com.lms.authentication.models.pojos.ManagerDetails;
//import com.lms.authentication.models.repositories.ManagerRepo;
//
//import jakarta.validation.Valid;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class ManagerServiceImpl implements ManagerService {
//
//    @Autowired
//    private ManagerRepo managerRepo;
//    @Autowired
//	private PasswordEncoder passwordEncoder;
//
//    @Override
//    public boolean login(ManagerLoginDTO dto) {
//        Optional<ManagerDetails> manager = managerRepo.findByEmail(dto.getEmail());
//        return manager.isPresent() && manager.get().getPassword().equals(dto.getPassword());
//    }
//
//    @Override
//    public ManagerDetails createManager(CreateManagerDTO dto) {
//        Optional<ManagerDetails> existingManager = managerRepo.findByEmail(dto.getEmail());
//        if (existingManager.isPresent()) {
//            throw new DuplicateEmailException("Email already registered: " + dto.getEmail());
//        }
//
//        ManagerDetails manager = new ManagerDetails();
//        manager.setManagerName(dto.getManagerName());
//        manager.setEmail(dto.getEmail());
//        manager.setPassword(passwordEncoder.encode(dto.getPassword())); // Consider encoding here
//
//        return managerRepo.save(manager);
//    }
//
//    @Override
//    public List<ManagerDetails> getAllManagers() {
//        return managerRepo.findAll();
//    }
//
//    @Override
//    public ManagerDetails getManagerById(int id) {
//        return managerRepo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Manager not found with id " + id));
//    }
//
//    @Override
//    public boolean changePassword(ChangePasswordDTO dto) {
//        ManagerDetails manager = managerRepo.findByEmail(dto.getEmail())
//                .orElseThrow(() -> new RuntimeException("Manager not found with email: " + dto.getEmail()));
//                
//        
//        if (!passwordEncoder.matches(dto.getCurrentPassword(), manager.getPassword())) {
//            throw new RuntimeException("Current password is incorrect");
//        }
//        
//        manager.setPassword(passwordEncoder.encode(dto.getNewPassword()));
//        managerRepo.save(manager);
//        
//        return true;
//    }
//}
package com.lms.authentication.models.dao.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lms.authentication.models.customexceptions.DuplicateEmailException;
import com.lms.authentication.models.dao.services.ManagerService;
import com.lms.authentication.models.dto.ChangePasswordDTO;
import com.lms.authentication.models.dto.CreateManagerDTO;
import com.lms.authentication.models.dto.ManagerLoginDTO;
import com.lms.authentication.models.pojos.ManagerDetails;
import com.lms.authentication.models.repositories.ManagerRepo;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@Service
public class ManagerServiceImpl implements ManagerService {

	@Autowired
	private ManagerRepo managerRepo;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public boolean login(ManagerLoginDTO dto) {
		Optional<ManagerDetails> manager = managerRepo.findByEmailAndDeletedFalse(dto.getEmail());
		return manager.isPresent() && manager.get().getPassword().equals(dto.getPassword());
	}

	@Override
	public ManagerDetails createManager(CreateManagerDTO dto) {
		Optional<ManagerDetails> existingManager = managerRepo.findByEmailAndDeletedFalse(dto.getEmail());
		if (existingManager.isPresent()) {
			throw new DuplicateEmailException("Email already registered: " + dto.getEmail());
		}

		ManagerDetails manager = new ManagerDetails();
		manager.setManagerName(dto.getManagerName());
		manager.setEmail(dto.getEmail());
		manager.setPassword(passwordEncoder.encode(dto.getPassword())); // Consider encoding here

		return managerRepo.save(manager);
	}

	@Override
	public List<ManagerDetails> getAllManagers() {
		return managerRepo.findByDeletedFalse();
	}

	@Override
	public ManagerDetails getManagerById(int id) {
		return managerRepo.findByManagerIdAndDeletedFalse(id).orElseThrow(() -> new RuntimeException("Manager not found with id " + id));
	}

	@Override
	public boolean changePassword(ChangePasswordDTO dto) {
		ManagerDetails manager = managerRepo.findByEmailAndDeletedFalse(dto.getEmail())
				.orElseThrow(() -> new RuntimeException("Manager not found with email: " + dto.getEmail()));

		System.out.println(dto.getCurrentPassword());
		if (!passwordEncoder.matches(dto.getCurrentPassword(), manager.getPassword())) {
			throw new RuntimeException("Current password is incorrect");
		}

		manager.setPassword(passwordEncoder.encode(dto.getNewPassword()));
		managerRepo.save(manager);

		return true;
	}

	@Override
	public void softDelete(int id) {
		if (id == 1) {
			throw new RuntimeException("Cannot delete the primary administrator (ID: 1)");
		}

		ManagerDetails manager = managerRepo.findByManagerIdAndDeletedFalse(id)
				.orElseThrow(() -> new RuntimeException("Manager not found with id: " + id));

		if (manager.isDeleted()) {
			throw new RuntimeException("Manager is already deleted");
		}

		managerRepo.softDelete(id);
	}

	@Override
	public String updatePassword(int managerId, String newPassword) {
		// TODO Auto-generated method stub
		ManagerDetails manager = managerRepo.findByManagerIdAndDeletedFalse(managerId)
				.orElseThrow(() -> new RuntimeException("Manager not found with Id: " + managerId));
		try {

				manager.setPassword(passwordEncoder.encode(newPassword));
				managerRepo.save(manager);

				return "Password Changed Successfully";
		}
		catch(Exception e)
		{
			throw new RuntimeException("Error in Updating Password");
		}
	}
}
