package com.lms.authentication.models.pojos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Manager_Details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ManagerDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int managerId;

    @Column(nullable = false, length = 40)
    private String managerName;

    @Column(nullable = false, length = 40, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;
    
    @Column(name="role")
    private String role="admin";
    
    @Column(name="deleted")
    private boolean deleted = false;

    
    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonIgnore
    private List<BorrowerDetails> borrowers=new ArrayList<BorrowerDetails>();
}
