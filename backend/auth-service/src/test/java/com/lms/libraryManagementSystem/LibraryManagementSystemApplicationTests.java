package com.lms.libraryManagementSystem;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.List;
import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.lms.authentication.models.customexceptions.BorrowerEmailExistsException;
import com.lms.authentication.models.customexceptions.BorrowerNotFoundException;
import com.lms.authentication.models.customexceptions.InvalidPasswordException;
import com.lms.authentication.models.dao.serviceimpl.BorrowerServiceImpl;
import com.lms.authentication.models.dao.serviceimpl.ManagerServiceImpl;
import com.lms.authentication.models.dto.CreateAccountDTO;
import com.lms.authentication.models.dto.PasswordChangeDTO;
import com.lms.authentication.models.dto.UpdateAccountDTO;
import com.lms.authentication.models.pojos.BorrowerDetails;
import com.lms.authentication.models.pojos.ManagerDetails;
import com.lms.authentication.models.repositories.BorrowerRepo;
import com.lms.authentication.models.repositories.ManagerRepo;


class LibraryManagementSystemApplicationTests {

    @Mock
    private BorrowerRepo borrowerRepo;

    @Mock
    private ManagerRepo managerRepo;

    @Mock
    private ManagerServiceImpl managerServiceImpl;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private BorrowerServiceImpl borrowerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ---------- createBorrowerAccount ----------
    @Test
    void testCreateBorrowerAccount_Success() {
        CreateAccountDTO dto = new CreateAccountDTO();
        dto.setBorrowerEmail("test@example.com");
        dto.setPassword("pass123");
        dto.setManagerId(1);

        when(borrowerRepo.findByBorrowerEmail(dto.getBorrowerEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encodedPass");
        when(managerRepo.findById(dto.getManagerId())).thenReturn(Optional.of(new ManagerDetails()));

        String result = borrowerService.createBorrowerAccount(dto);

        assertEquals("Account Created Successfully", result);
        verify(borrowerRepo, times(1)).save(any(BorrowerDetails.class));
    }

    @Test
    void testCreateBorrowerAccount_EmailExists() {
        CreateAccountDTO dto = new CreateAccountDTO();
        dto.setBorrowerEmail("test@example.com");

        when(borrowerRepo.findByBorrowerEmail(dto.getBorrowerEmail())).thenReturn(Optional.of(new BorrowerDetails()));

        assertThrows(BorrowerEmailExistsException.class, () -> borrowerService.createBorrowerAccount(dto));
    }

    // ---------- getBorrowerList ----------
    @Test
    void testGetBorrowerList_Success() {
        BorrowerDetails borrower = new BorrowerDetails();
        borrower.setBorrowerEmail("abc@test.com");

        when(borrowerRepo.findAll()).thenReturn(Arrays.asList(borrower));

        List<BorrowerDetails> result = borrowerService.getBorrowerList();

        assertEquals(1, result.size());
        assertEquals("abc@test.com", result.get(0).getBorrowerEmail());
    }

    @Test
    void testGetBorrowerList_NoBorrowers() {
        when(borrowerRepo.findAll()).thenReturn(List.of());

        assertThrows(BorrowerNotFoundException.class, () -> borrowerService.getBorrowerList());
    }

    // ---------- changePassword ----------
    @Test
    void testChangePassword_Success() {
        PasswordChangeDTO dto = new PasswordChangeDTO();
        dto.setBorrowerId(1L);
        dto.setOldPwd("oldPass");
        dto.setNewPwd("newPass");

        BorrowerDetails borrower = new BorrowerDetails();
        borrower.setPassword("encodedOldPass");

        when(borrowerRepo.findByBorrowerIdAndDeletedFalse(dto.getBorrowerId())).thenReturn(Optional.of(borrower));
        when(passwordEncoder.matches(dto.getOldPwd(), borrower.getPassword())).thenReturn(true);
        when(passwordEncoder.encode(dto.getNewPwd())).thenReturn("encodedNewPass");

        String result = borrowerService.changePassword(dto);

        assertEquals("Password Changed Successfully", result);
        verify(borrowerRepo, times(1)).save(borrower);
    }

    @Test
    void testChangePassword_InvalidOldPassword() {
        PasswordChangeDTO dto = new PasswordChangeDTO();
        dto.setBorrowerId(1L);
        dto.setOldPwd("wrongPass");

        BorrowerDetails borrower = new BorrowerDetails();
        borrower.setPassword("encodedOldPass");

        when(borrowerRepo.findByBorrowerIdAndDeletedFalse(dto.getBorrowerId())).thenReturn(Optional.of(borrower));
        when(passwordEncoder.matches(dto.getOldPwd(), borrower.getPassword())).thenReturn(false);

        assertThrows(InvalidPasswordException.class, () -> borrowerService.changePassword(dto));
    }

    @Test
    void testChangePassword_BorrowerNotFound() {
        PasswordChangeDTO dto = new PasswordChangeDTO();
        dto.setBorrowerId(1L);

        when(borrowerRepo.findByBorrowerIdAndDeletedFalse(dto.getBorrowerId())).thenReturn(Optional.empty());

        assertThrows(BorrowerNotFoundException.class, () -> borrowerService.changePassword(dto));
    }

    // ---------- deleteBorrowerAccount ----------
    @Test
    void testDeleteBorrowerAccount_Success() {
        BorrowerDetails borrower = new BorrowerDetails();
        borrower.setBorrowerEmail("abc@test.com");

        when(borrowerRepo.findByBorrowerEmailAndDeletedFalse("abc@test.com")).thenReturn(Optional.of(borrower));

        String result = borrowerService.deleteBorrowerAccount("abc@test.com");

        assertEquals("Account with email abc@test.com Deleted Successfully", result);
        assertTrue(borrower.isDeleted());
        verify(borrowerRepo, times(1)).save(borrower);
    }

    @Test
    void testDeleteBorrowerAccount_NotFound() {
        when(borrowerRepo.findByBorrowerEmailAndDeletedFalse("abc@test.com")).thenReturn(Optional.empty());

        assertThrows(BorrowerNotFoundException.class, () -> borrowerService.deleteBorrowerAccount("abc@test.com"));
    }
}
