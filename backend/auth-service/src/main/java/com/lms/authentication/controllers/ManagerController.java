//package com.lms.authentication.controllers;
//
//import jakarta.validation.Valid;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.*;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import com.lms.authentication.models.customexceptions.BorrowerEmailExistsException;
//import com.lms.authentication.models.customexceptions.DuplicateEmailException;
//import com.lms.authentication.models.dao.services.BorrowerService;
//import com.lms.authentication.models.dao.services.LoginService;
//import com.lms.authentication.models.dao.services.ManagerService;
//import com.lms.authentication.models.dto.ChangePasswordDTO;
//import com.lms.authentication.models.dto.CreateAccountDTO;
//import com.lms.authentication.models.dto.CreateManagerDTO;
//import com.lms.authentication.models.dto.LoginDTO;
//import com.lms.authentication.models.dto.ManagerLoginDTO;
//import com.lms.authentication.models.pojos.ManagerDetails;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/lms/manager")
//public class ManagerController {
//
//    @Autowired
//    private ManagerService managerService;
//    
//    @Autowired
//    private BorrowerService borrowerService;
//    
//    @Autowired
//	private LoginService loginService;
//
//
//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody ManagerLoginDTO dto) {
//        boolean isValid = managerService.login(dto);
//        return isValid ?
//                ResponseEntity.ok("Login Successful!") :
//                ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
//    }
//
//    @PostMapping("/create")
//    public ResponseEntity<?> createManager(@RequestBody CreateManagerDTO dto) {
//        try {
//            ManagerDetails created = managerService.createManager(dto);
//            return new ResponseEntity<>(created, HttpStatus.CREATED);
//        } catch (DuplicateEmailException e) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
//        }
//    }
//
//    @GetMapping("/all")
//    public ResponseEntity<List<ManagerDetails>> getAllManagers() {
//        return ResponseEntity.ok(managerService.getAllManagers());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ManagerDetails> getManagerById(@PathVariable int id) {
//        return ResponseEntity.ok(managerService.getManagerById(id));
//    }
//    
//    
//    @PostMapping("/create-borrower")
//    public ResponseEntity<?> createBorrowerAccount(@RequestBody CreateAccountDTO dto) {
//        try {
//            String result = borrowerService.createBorrowerAccount(dto);
//            return new ResponseEntity<>(result, HttpStatus.CREATED);
//        } catch (BorrowerEmailExistsException e) {
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
//        }
//    }
//    
//    @PostMapping("/Validate") 
//	 public ResponseEntity<Map<String,String>> LoginValidate(@Valid @RequestBody LoginDTO logindto) 
//	 { 
//	   return new ResponseEntity<Map<String,String>>(loginService.validateLogin(logindto),HttpStatus.OK); 
//	 } 
//    @PostMapping("/change-password")
//    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDTO dto) {
//        try {
//            boolean changed = managerService.changePassword(dto);
//            return changed ? 
//                ResponseEntity.ok("Password changed successfully") :
//                ResponseEntity.badRequest().body("Failed to change password");
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
//
//}
package com.lms.authentication.controllers;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lms.authentication.models.customexceptions.BorrowerEmailExistsException;
import com.lms.authentication.models.customexceptions.DuplicateEmailException;
import com.lms.authentication.models.dao.services.BorrowerService;
import com.lms.authentication.models.dao.services.LoginService;
import com.lms.authentication.models.dao.services.ManagerService;
import com.lms.authentication.models.dto.ChangePasswordDTO;
import com.lms.authentication.models.dto.CreateAccountDTO;
import com.lms.authentication.models.dto.CreateManagerDTO;
import com.lms.authentication.models.dto.LoginDTO;
import com.lms.authentication.models.dto.ManagerLoginDTO;
import com.lms.authentication.models.pojos.ManagerDetails;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lms/manager")
public class ManagerController {

    @Autowired
    private ManagerService managerService;
    
    @Autowired
    private BorrowerService borrowerService;
    
    @Autowired
	private LoginService loginService;


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody ManagerLoginDTO dto) {
        boolean isValid = managerService.login(dto);
        return isValid ?
                ResponseEntity.ok("Login Successful!") :
                ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
    }

    @PostMapping("/create")
    public ResponseEntity<?> createManager(@RequestBody CreateManagerDTO dto) {
        try {
            ManagerDetails created = managerService.createManager(dto);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (DuplicateEmailException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ManagerDetails>> getAllManagers() {
        return ResponseEntity.ok(managerService.getAllManagers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManagerDetails> getManagerById(@PathVariable int id) {
        return ResponseEntity.ok(managerService.getManagerById(id));
    }
    
    
    @PostMapping("/create-borrower")
    public ResponseEntity<?> createBorrowerAccount(@RequestBody CreateAccountDTO dto) {
        try {
            String result = borrowerService.createBorrowerAccount(dto);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (BorrowerEmailExistsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }
    
    @PostMapping("/Validate") 
	 public ResponseEntity<Map<String,String>> LoginValidate(@Valid @RequestBody LoginDTO logindto) 
	 { 
	   return new ResponseEntity<Map<String,String>>(loginService.validateLogin(logindto),HttpStatus.OK); 
	 } 
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDTO dto) {
        try {
            boolean changed = managerService.changePassword(dto);
            return changed ? 
                ResponseEntity.ok("Password changed successfully") :
                ResponseEntity.badRequest().body("Failed to change password");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PostMapping("/updatePassword")
    public ResponseEntity<String>updatePasssword(@RequestParam Long managerId,@RequestParam String newPassword)
    {
    	return new ResponseEntity<String>(managerService.updatePassword(managerId.intValue(),newPassword),HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteManager(@PathVariable int id) {
        try {
            managerService.softDelete(id);
            return ResponseEntity.ok("Manager deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}