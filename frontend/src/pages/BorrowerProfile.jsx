import { useEffect, useState } from "react";
import React from "react";
import "../styles/BorrowerProfile.css";
import Nav from "../components/Nav";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // eye icons
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { LmsContext } from "../context/LmsContext";

const BorrowerProfile = () => {
    // Use the email, id, token from context 
    // keep email, user name, mbl no seperate as they are unique in database
    // add token from context 
    const {token,email,id}=useContext(LmsContext);

    const [currentPassword,setCurrentPassword]=useState("")
    const [newPassword, setNewPassword] = useState(""); 
    const [isEditable, setIsEditable] = useState(false); // toggle edit mode
    const [pwdEditable, setPwdEditable] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // toggle password visibility
    const [showPasswordOld, setShowPasswordOld] = useState(false); 
    const [errors, setErrors] = useState({});
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];
    const [borrowerData, setBorrowerData] = useState({
        borrowerId: 0, // Fetch from context, then use
        userName: "",
        firstName: "",
        lastName: "",
        mobileNumber: "",
        doorNo: "",
        streetName: "",
        landmark: "",
        area: "",
        state: "",
        securityQue1: '',
        securityQue2: '',
        securityAns1: '',
        securityAns2: ''
    });
    
    const [originalBorrowerData, setOriginalBorrowerData] = useState(borrowerData);
    const [displayName, setDisplayName] = useState(borrowerData.firstName);

    useEffect(() => {
        const fetchBorrowerData = async () => {
            borrowerData.borrowerId=id;
            try {
                const response = await axios.get(`http://localhost:8081/lms/borrower/getBorrowerByBorrowerId?borrowerId=${borrowerData.borrowerId}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                console.log(response);
                setBorrowerData(response.data);
                setOriginalBorrowerData(response.data);
                setDisplayName(response.data.firstName)

            } catch (error) {
                // console.log("Error while retrieving Borrower Data", error);
                toast.error("Error while retrieving Borrower Data");
            }
        }
        fetchBorrowerData();
    }, [])

     const handleCancelEdit = () => {
        setBorrowerData(originalBorrowerData); // Reset form data
        setIsEditable(false);
        
    };
    const handleCancel=()=>{
        setCurrentPassword("");
        setNewPassword("");
         setPwdEditable(false);

    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested address fields
        
            
            setBorrowerData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        
    };

    //   logic to avoid the changing of firstname when input is changed

    const validateForm = () => {
        let newErrors = {};

        if (!borrowerData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }
        if (!borrowerData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }
        if (!borrowerData.mobileNumber.trim()) {
            newErrors.mobileNumber = "Mobile number is required";
        } else if (!/^[6-9]\d{9}$/.test(borrowerData.mobileNumber)) {
            newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
        }
        if (!borrowerData.doorNo.trim()) {
            newErrors.doorNo = "Door number is required";
        }
        if (!borrowerData.streetName.trim()) {
            newErrors.streetName = "Street name is required";
        }
        if (!borrowerData.landmark.trim()) {
            newErrors.landmark = "Landmark is required";
        }
        if (!borrowerData.area.trim()) {
            newErrors.area = "Area is required";
        }
        if (!borrowerData.state.trim()) {
            newErrors.state = "State is required";
        }

        return newErrors; // ✅ return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            if (isEditable) {
                // Save logic here
                console.log("Saving data:", borrowerData);

                const response = await axios.put('http://localhost:8081/lms/borrower/updateBorrowerProfile', borrowerData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Response Data", response.data);
                setDisplayName(borrowerData.firstName);
                // alert("Information updated successfully");
                toast.success("Information updated successfully");
                setIsEditable(false); // disable editing after save
                setErrors({});
            } else {
                setIsEditable(true); // enable editing
            }

        } catch (error) {
            toast.error("Error while updating information");
            // alert("Error while updating information")
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!newPassword.trim()) {
        //    alert("Please enter a new password");
           toast.error("Please enter a new password");
        return;
        }
        try {
            // API CALL - it is enough to return a string as a response from the api call
            const response = await axios.put("http://localhost:8081/lms/borrower/changePassword",  {
              borrowerId:id,
              newPwd:newPassword,
              oldPwd:currentPassword,
             
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("Response data", response);
            setNewPassword("");
            setPwdEditable(false);
            setShowPassword(false);
            toast.success("Password updated successfully");
            // alert("Password updated successfully");
        } catch (error) {
            toast.error(error.response.data.message);
            // alert("Error while changing password");
            console.log(error);
        }
    }

    return (
        <>
             <Nav /> 
            <div className="bwr-container">
                <div className="profile-container">
                    <div className="bwr-profile-header mb-3">
                        <h2 className="title">Welcome {displayName.charAt(0).toUpperCase() + displayName.slice(1).toLowerCase()}</h2>
                        <p className="subtitle">
                            Manage your personal information here..
                        </p>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div className="avatar-card mb-3">
                                <img
                                    src={`https://api.dicebear.com/9.x/identicon/svg?seed=${email}`}
                                    alt={borrowerData.displayName}
                                    className="avatar-img"
                                />
                                <h4 className="bwr-name">{displayName.charAt(0).toUpperCase() + displayName.slice(1).toLowerCase()}</h4>
                                 <p className="bwr-unique-data">
                                    Borrower Id : {id}
                                </p>
                                <p className="bwr-unique-data">
                                    User Name : {borrowerData.userName}
                                </p>
                                <p className="bwr-unique-data">
                                    Email : {email}
                                </p>
                                <p className="bwr-unique-data">
                                    Mobile Number : {borrowerData.mobileNumber}
                                </p>
                            </div>

                            {/* Security Section */}
                            <div className="security-card">
                                <div className="info-title">Security</div>
                                <div>
                                    <label htmlFor="securityQue1" className="info-label" style={{textAlign:"left"}}>Security Question 1</label>
                                    <input type="text" name="securityQue1" onChange={handleChange} id="securityQue1" className="info-input form-control" 
                                        value={borrowerData.securityQue1} readOnly
                                    />
                                </div>
                                <div>
                                    <label htmlFor="securityAns1" className="info-label" style={{textAlign:"left"}}>Security Answer 1</label>
                                    <input type="text" name="securityAns1" onChange={handleChange} id="securityAns1" className="info-input form-control" 
                                        value={borrowerData.securityAns1} readOnly
                                    />
                                </div>
                                <div>
                                    <label htmlFor="securityQue2" className="info-label" style={{textAlign:"left"}}>Security Question 2</label>
                                    <input type="text" name="securityQue2" onChange={handleChange} id="securityQue2" className="info-input form-control" 
                                        value={borrowerData.securityQue2} readOnly
                                    />
                                </div>
                                <div>
                                    <label htmlFor="securityAns2" className="info-label" style={{textAlign:"left"}}>Security answer 2</label>
                                    <input type="text" name="securityAns2" onChange={handleChange} id="securityAns2" className="info-input form-control" 
                                        value={borrowerData.securityAns2} readOnly
                                    />
                                </div>
                                {pwdEditable && (
                                    <div style={{ position: "relative"}}>
                                         <p className="bwr-unique-data text-align-left">Enter your Current Password here</p> 
                                    <input
                                        type={showPasswordOld ? "text" : "password"}
                                        className="info-input"
                                        style={{color:"black"}}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                     <span
                                        style={{
                                            position: "absolute",
                                            right: "10px",
                                            top: "25%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => setShowPasswordOld(!showPasswordOld)}
                                    >
                                        {showPasswordOld ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    
                                        <p className="bwr-unique-data text-align-left">Enter your new password here</p> 
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="info-input"
                                        style={{color:"black"}}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <span
                                        style={{
                                            position: "absolute",
                                            right: "10px",
                                            top: "65%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                     <button onClick={handleCancel} className="security-btn">Cancel</button>
                                </div>
                                )}
                                {!pwdEditable ? (
                                    <button onClick={() => setPwdEditable(true)} className="security-btn">Change Password</button>
                                ) : (
                                    <button onClick={handleChangePassword} className="security-btn">Save Password</button>
                                )}
                            </div>
                        </div>

                        {/* Personal Info Form */}
                        <div className="col-lg-8">
                            <div className="info-card">
                                <div className="info-title">Personal Information</div>
                                {borrowerData && (
                                    <form onSubmit={handleSubmit}>
                                        <div
                                            className="d-flex flex-column"
                                            style={{ gap: "12px" }}
                                        >
                                            <div>
                                                <label htmlFor="firstName" className="info-label">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    onChange={handleChange}
                                                    id="firstName"
                                                    className="info-input form-control"
                                                    value={borrowerData.firstName}
                                                    readOnly={!isEditable}
                                                />
                                                 {errors.firstName && <p className="error-text">{errors.firstName}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="lastName" className="info-label">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    onChange={handleChange}
                                                    id="lastName"
                                                    className="info-input form-control"
                                                    value={borrowerData.lastName}
                                                    readOnly={!isEditable}
                                                />
                                                 {errors.lastName && <p className="error-text">{errors.lastName}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="doorNo" className="info-label">
                                                    Door No
                                                </label>
                                                <input
                                                    type="text"
                                                    name="doorNo"
                                                    onChange={handleChange}
                                                    id="doorNo"
                                                    className="info-input form-control"
                                                    value={borrowerData.doorNo}
                                                    readOnly={!isEditable}
                                                />
                                                 {errors.doorNo && <p className="error-text">{errors.doorNo}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="streetName" className="info-label">
                                                    Street Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="streetName"
                                                    onChange={handleChange}
                                                    id="streetName"
                                                    className="info-input form-control"
                                                    value={borrowerData.streetName}
                                                    readOnly={!isEditable}
                                                />
                                                 {errors.streetName && <p className="error-text">{errors.streetName}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="landmark" className="info-label">
                                                    Landmark
                                                </label>
                                                <input
                                                    type="text"
                                                    name="landmark"
                                                    onChange={handleChange}
                                                    id="landmark"
                                                    className="info-input form-control"
                                                    value={borrowerData.landmark}
                                                    readOnly={!isEditable}
                                                />
                                                 {errors.landmark && <p className="error-text">{errors.landmark}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="area" className="info-label">
                                                    Area
                                                </label>
                                                <input
                                                    type="text"
                                                    name="area"
                                                    onChange={handleChange}
                                                    id="area"
                                                    className="info-input form-control"
                                                    value={borrowerData.area}
                                                    readOnly={!isEditable}
                                                />
                                                 {errors.area && <p className="error-text">{errors.area}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="state" className="info-label">
                                                    State
                                                </label>
                                                <select name="state" value={borrowerData.state} onChange={handleChange} className="info-input form-control" id="state" readOnly={!isEditable}>
                                                    <option value="">Select State</option>
                                                    {indianStates.map((st, idx) => (
                                                        <option key={idx} value={st}>{st}</option>
                                                    ))}
                                                </select>
                                                {errors.state && <p className="error-text">{errors.state}</p>}
                                            </div>

                                             {!isEditable ? (
                                                <button type="submit" className="info-btn">Update Information</button>
                                            ) : (
                                                <div style={{ display: "flex", gap: "10px" }}>
                                                    <button type="submit" className="info-btn">Save Information</button>
                                                    <button type="button" onClick={handleCancelEdit} className="info-btn btn-cancel">Cancel</button>
                                                </div>
                                            )}

                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BorrowerProfile;