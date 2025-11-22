package com.lms.libraryManagementSystem;


import com.lms.authentication.controllers.ManagerController;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ManagerControllerTest {

    @Mock
    private ManagerService managerService;

    @Mock
    private BorrowerService borrowerService;

    @Mock
    private LoginService loginService;

    @InjectMocks
    private ManagerController managerController;

    private ManagerDetails testManager;
    private CreateManagerDTO createManagerDTO;
    private ManagerLoginDTO loginDTO;
    private ChangePasswordDTO changePasswordDTO;
    private CreateAccountDTO createAccountDTO;
    private LoginDTO validateLoginDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Initialize test data
        testManager = new ManagerDetails();
        testManager.setManagerId(1);
        testManager.setEmail("test@example.com");
        testManager.setManagerName("Test Manager");
        
        createManagerDTO = new CreateManagerDTO();
        createManagerDTO.setEmail("test@example.com");
        createManagerDTO.setManagerName("Test Manager");
        createManagerDTO.setPassword("password123");
        
        loginDTO = new ManagerLoginDTO();
        loginDTO.setEmail("test@example.com");
        loginDTO.setPassword("password123");
        
        changePasswordDTO = new ChangePasswordDTO();
        changePasswordDTO.setEmail("test@example.com");
        changePasswordDTO.setCurrentPassword("oldPass123");
        changePasswordDTO.setNewPassword("newPass123");
        
        
        validateLoginDTO = new LoginDTO();
        validateLoginDTO.setEmail("test@example.com");
        validateLoginDTO.setPassword("password123");
    }

    @Test
    void login_Success() {
        when(managerService.login(any(ManagerLoginDTO.class))).thenReturn(true);
        
        ResponseEntity<String> response = managerController.login(loginDTO);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Login Successful!", response.getBody());
        verify(managerService, times(1)).login(loginDTO);
    }

    @Test
    void login_Failure() {
        when(managerService.login(any(ManagerLoginDTO.class))).thenReturn(false);
        
        ResponseEntity<String> response = managerController.login(loginDTO);
        
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid credentials!", response.getBody());
    }

    @Test
    void createManager_Success() throws DuplicateEmailException {
        when(managerService.createManager(any(CreateManagerDTO.class))).thenReturn(testManager);
        
        ResponseEntity<?> response = managerController.createManager(createManagerDTO);
        
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(testManager, response.getBody());
    }

    @Test
    void getAllManagers() {
        List<ManagerDetails> managers = Arrays.asList(testManager, new ManagerDetails());
        when(managerService.getAllManagers()).thenReturn(managers);
        
        ResponseEntity<List<ManagerDetails>> response = managerController.getAllManagers();
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(managerService, times(1)).getAllManagers();
    }

    @Test
    void getManagerById() {
        when(managerService.getManagerById(1)).thenReturn(testManager);
        
        ResponseEntity<ManagerDetails> response = managerController.getManagerById(1);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testManager, response.getBody());
        verify(managerService, times(1)).getManagerById(1);
    }
 

    @Test
    void loginValidate() {
        Map<String, String> expectedResponse = new HashMap<>();
        expectedResponse.put("token", "testToken123");
        when(loginService.validateLogin(any(LoginDTO.class))).thenReturn(expectedResponse);
        
        ResponseEntity<Map<String, String>> response = managerController.LoginValidate(validateLoginDTO);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("testToken123", response.getBody().get("token"));
        verify(loginService, times(1)).validateLogin(validateLoginDTO);
    }

    @Test
    void changePassword_Success() {
        when(managerService.changePassword(any(ChangePasswordDTO.class))).thenReturn(true);
        
        ResponseEntity<?> response = managerController.changePassword(changePasswordDTO);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password changed successfully", response.getBody());
    }

    @Test
    void changePassword_Failure() {
        when(managerService.changePassword(any(ChangePasswordDTO.class))).thenReturn(false);
        
        ResponseEntity<?> response = managerController.changePassword(changePasswordDTO);
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Failed to change password", response.getBody());
    }

    @Test
    void changePassword_Exception() {
        when(managerService.changePassword(any(ChangePasswordDTO.class)))
            .thenThrow(new RuntimeException("Invalid old password"));
        
        ResponseEntity<?> response = managerController.changePassword(changePasswordDTO);
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid old password", response.getBody());
    }

    @Test
    void updatePassword() {
        when(managerService.updatePassword(1, "newPassword123"))
            .thenReturn("Password updated successfully");
        
        ResponseEntity<String> response = managerController.updatePasssword(1L, "newPassword123");
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password updated successfully", response.getBody());
        verify(managerService, times(1)).updatePassword(1, "newPassword123");
    }

    @Test
    void deleteManager_Success() {
        doNothing().when(managerService).softDelete(1);
        
        ResponseEntity<?> response = managerController.deleteManager(1);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Manager deleted successfully", response.getBody());
        verify(managerService, times(1)).softDelete(1);
    }

    @Test
    void deleteManager_NotFound() {
        doThrow(new RuntimeException("Manager not found"))
            .when(managerService).softDelete(999);
        
        ResponseEntity<?> response = managerController.deleteManager(999);
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Manager not found", response.getBody());
    }
}
