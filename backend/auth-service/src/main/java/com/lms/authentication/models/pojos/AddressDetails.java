package com.lms.authentication.models.pojos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "address_details")
public class AddressDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "address_id")
	private Long addressId;
	
    @Column(name = "door_no", length = 20)
    private String doorNo;
	
    @Column(name = "street_name", length = 100)
    private String streetName;
	
    @Column(name = "landmark", length = 100)
    private String landmark; 
	
    @Column(name = "area", length = 100)
    private String area;
	
    @Column(name = "state", length = 50)
    private String state;
	 
}
