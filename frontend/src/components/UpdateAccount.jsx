import React, { useState, useContext } from 'react';
import '../styles/UpdateAccount.css';
import axios from 'axios';
import { LmsContext } from '../context/LmsContext';
import { toast } from "react-toastify";

const UpdateAccount = () => {
    const { token, setIsProfileComplete, email } = useContext(LmsContext);

    const [formData, setFormData] = useState({
        borrowerEmail: '',
        userName: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        doorNo: '',
        streetName: '',
        landmark: '',
        area: '',
        state: '',
        securityQue1: '',
        securityQue2: '',
        securityAns1: '',
        securityAns2: ''
    });

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

    const securityQuestions = [
        "What was the brand of your first computer?",
        "What was your childhood nickname?",
        "What is the name of your best childhood friend?",
        "What is your favorite holiday destination?",
        "What was the name of your first pet?",
        "What was the first car you owned?",
        "What city were you born in?",
        "What was the color of your first bicycle?",
    ];

    // Mobile validation
    const validateMobile = (mobile) => {
        const mobileRegex = /^[6-9]\d{9}$/;
        return mobileRegex.test(mobile);
    };

    // Handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Validate all fields before submit
    const validateForm = () => {
        let newErrors = {};

        if (!formData.userName.trim()) newErrors.userName = "User Name is required";
        if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
        if (!formData.mobileNumber.trim()) {
            newErrors.mobileNumber = "Mobile number is required";
        } else if (!validateMobile(formData.mobileNumber)) {
            newErrors.mobileNumber = "Enter a valid 10-digit mobile number starting with 6-9";
        }
        if (!formData.doorNo.trim()) newErrors.doorNo = "Door No is required";
        if (!formData.streetName.trim()) newErrors.streetName = "Street Name is required";
        if (!formData.landmark.trim()) newErrors.landmark = "Landmark is required";
        if (!formData.area.trim()) newErrors.area = "Area is required";
        if (!formData.state.trim()) newErrors.state = "State is required";

        if (!formData.securityQue1) newErrors.securityQue1 = "Security Question 1 is required";
        if (!formData.securityAns1.trim()) newErrors.securityAns1 = "Answer for Question 1 is required";
        if (!formData.securityQue2) newErrors.securityQue2 = "Security Question 2 is required";
        if (!formData.securityAns2.trim()) newErrors.securityAns2 = "Answer for Question 2 is required";

        if (formData.securityQue1 && formData.securityQue2 && formData.securityQue1 === formData.securityQue2) {
            newErrors.securityQue2 = "Security Question 2 cannot be same as Question 1";
        }

        return newErrors;
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            formData.borrowerEmail = email;
            const response = await axios.put(
                'http://localhost:8081/lms/borrower/updateAccount',
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Account updated successfully");
            setFormData({
                userName: '',
                firstName: '',
                lastName: '',
                mobileNumber: '',
                doorNo: '',
                streetName: '',
                landmark: '',
                area: '',
                state: '',
                securityQue1: '',
                securityQue2: '',
                securityAns1: '',
                securityAns2: ''
            });
            sessionStorage.setItem("isProfileComplete", true);
            setIsProfileComplete(true);
            setErrors({});
        } catch (error) {
            console.error('Error updating account:', error);
            toast.error(error.response?.data?.message || "Error updating account");
        }
    };

    return (
        <div className="update-account-container">
            <div className="shadow-sm p-4 form-container w-100">
                <form onSubmit={handleSubmit}>
                    
                    {/* User Name */}
                    <div className="form-floating mb-3">
                        <input type="text" name="userName" value={formData.userName} onChange={handleChange} className="form-control" id="userName" placeholder="User Name" />
                        <label htmlFor="userName">User Name</label>
                        {errors.userName && <p className="error-text">{errors.userName}</p>}
                    </div>

                    {/* First Name */}
                    <div className="form-floating mb-3">
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-control" id="firstName" placeholder="First Name" />
                        <label htmlFor="firstName">First Name</label>
                        {errors.firstName && <p className="error-text">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div className="form-floating mb-3">
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-control" id="lastName" placeholder="Last Name" />
                        <label htmlFor="lastName">Last Name</label>
                        {errors.lastName && <p className="error-text">{errors.lastName}</p>}
                    </div>

                    {/* Mobile */}
                    <div className="form-floating mb-3">
                        <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="form-control" id="mobileNumber" placeholder="Mobile Number" />
                        <label htmlFor="mobileNumber">Mobile Number</label>
                        {errors.mobileNumber && <p className="error-text">{errors.mobileNumber}</p>}
                    </div>

                    {/* Door No */}
                    <div className="form-floating mb-3">
                        <input type="text" name="doorNo" value={formData.doorNo} onChange={handleChange} className="form-control" id="doorNo" placeholder="Door No" />
                        <label htmlFor="doorNo">Door No</label>
                        {errors.doorNo && <p className="error-text">{errors.doorNo}</p>}
                    </div>

                    {/* Street Name */}
                    <div className="form-floating mb-3">
                        <input type="text" name="streetName" value={formData.streetName} onChange={handleChange} className="form-control" id="streetName" placeholder="Street Name" />
                        <label htmlFor="streetName">Street Name</label>
                        {errors.streetName && <p className="error-text">{errors.streetName}</p>}
                    </div>

                    {/* Landmark */}
                    <div className="form-floating mb-3">
                        <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="form-control" id="landmark" placeholder="Landmark" />
                        <label htmlFor="landmark">Landmark</label>
                        {errors.landmark && <p className="error-text">{errors.landmark}</p>}
                    </div>

                    {/* Area */}
                    <div className="form-floating mb-3">
                        <input type="text" name="area" value={formData.area} onChange={handleChange} className="form-control" id="area" placeholder="Area" />
                        <label htmlFor="area">Area</label>
                        {errors.area && <p className="error-text">{errors.area}</p>}
                    </div>

                    {/* State */}
                    <div className="form-floating mb-3">
                        <select name="state" value={formData.state} onChange={handleChange} className="form-control" id="state">
                            <option value="">Select State</option>
                            {indianStates.map((st, idx) => (
                                <option key={idx} value={st}>{st}</option>
                            ))}
                        </select>
                        <label htmlFor="state">State</label>
                        {errors.state && <p className="error-text">{errors.state}</p>}
                    </div>

                    {/* Security Q1 */}
                    <div className="form-floating mb-3">
                        <select name="securityQue1" value={formData.securityQue1} onChange={handleChange} className="form-control" id="securityQue1">
                            <option value="">Select Security Question 1</option>
                            {securityQuestions.map((st, idx) => (
                                <option key={idx} value={st}>{st}</option>
                            ))}
                        </select>
                        <label htmlFor="securityQue1">Security Question 1</label>
                        {errors.securityQue1 && <p className="error-text">{errors.securityQue1}</p>}
                    </div>

                    <div className="form-floating mb-3">
                        <input type="text" name="securityAns1" value={formData.securityAns1} onChange={handleChange} className="form-control" id="securityAns1" placeholder="Answer 1" />
                        <label htmlFor="securityAns1">Answer for Question 1</label>
                        {errors.securityAns1 && <p className="error-text">{errors.securityAns1}</p>}
                    </div>

                    {/* Security Q2 */}
                    <div className="form-floating mb-3">
                        <select name="securityQue2" value={formData.securityQue2} onChange={handleChange} className="form-control" id="securityQue2">
                            <option value="">Select Security Question 2</option>
                            {securityQuestions.filter(st => st !== formData.securityQue1).map((st, idx) => (
                                <option key={idx} value={st}>{st}</option>
                            ))}
                        </select>
                        <label htmlFor="securityQue2">Security Question 2</label>
                        {errors.securityQue2 && <p className="error-text">{errors.securityQue2}</p>}
                    </div>

                    <div className="form-floating mb-3">
                        <input type="text" name="securityAns2" value={formData.securityAns2} onChange={handleChange} className="form-control" id="securityAns2" placeholder="Answer 2" />
                        <label htmlFor="securityAns2">Answer for Question 2</label>
                        {errors.securityAns2 && <p className="error-text">{errors.securityAns2}</p>}
                    </div>

                    <button className="btn w-100 mt-3 rounded-pill" style={{ backgroundColor: "#8c61b5", color: "white" }}>Update</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateAccount;