import React, { useState, useContext, useEffect } from 'react';
import '../styles/LoginPage.css';
import purpleImg from '../assets/purple.png';
import { LmsContext } from '../context/LmsContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

const LoginPage = () => {
  const [loginType] = useState('Login');
  const [view, setView] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPwd, setIsForgotPwd] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [securityDataVerified, setSecurityDataVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [answers, setAnswers] = useState({
    answer1: '',
    answer2: ''
  })
  const [securityData, setSecurityData] = useState({
    securityQue1: '',
    securityQue2: '',
    securityAns1: '',
    securityAns2: ''
  })
  const navigate = useNavigate();

  const { setToken, setUserEmail, setIsProfileComplete ,role,setRole,id,setId,loginTime,setLoginTime} = useContext(LmsContext);
 
  
  
  const fetchSecurityQuestions = async (e) => {
    e.preventDefault();
     if (!email || email.trim() === "") {
    toast.error("Email should not be empty");
    return;
  }
    try {
      const response = await axios.get(`http://localhost:8081/lms/borrower/getSecurityCredentials?borrowerEmail=${email}`);
      console.log("Security Data Fetched");
      toast.success("Email verfied");
      setSecurityData(response.data);
      setEmailVerified(true);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  const verifySecurityData = async (e) => {
     e.preventDefault();
     if (!answers.answer1|| answers.answer1.trim() === "" || !answers.answer2 || answers.answer2.trim() === "") {
    toast.error("Answers should not be empty");
    return;
     }

   
    if (answers.answer1 === securityData.securityAns1 && answers.answer2 === securityData.securityAns2) {
      setSecurityDataVerified(true);
      toast.success("Security Check Completed");
    } else {
      toast.error("Check your security answers and try again!!");
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    // Put this at the top of your file
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])\S{8,}$/;

// Use it wherever you validate (login / change password)
if (!newPassword || !PASSWORD_REGEX.test(newPassword)) {
  toast.error("Password must be ≥8 chars, include uppercase, lowercase, number, special char, and no spaces");
  return;
}

    try {
      const response = await axios.put("http://localhost:8081/lms/borrower/updatePassword", { borrowerEmail : email, password : newPassword });
      console.log("Password changed Successfully", response);
      toast.success(response.data + " Login to access your account");
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }

  }

  const handleLogin = async (e) => {

e.preventDefault();
   if (!email || email.trim() === "") {
    toast.error("Email should not be empty");
    return;
  }
  if (!password || password.trim() === "") {
    toast.error("Password should not be empty");
    return;
  }
    setView('password');

    try {
      const response = await axios.post('http://localhost:8081/lms/manager/Validate', { email, password, role });

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
       toast.success("Login Successful")
      sessionStorage.setItem("email",email);
      sessionStorage.setItem("token",response.data.token);
      sessionStorage.setItem("id",parseInt(response.data.id),10);
      sessionStorage.setItem("loginTime",Date.now())
      // sessionStorage.setItem("alertShown",false);


      setLoginTime(Date.now());
      setUserEmail(email);
      setToken(response.data.token);
      setId(parseInt(response.data.id),10)
      
      setPassword('');
      setEmail('');

      setIsProfileComplete(response.data.isProfileComplete === "false" ? false : true);
      sessionStorage.setItem("isProfileComplete",response.data.isProfileComplete === "false" ? false : true)
      
      if (role === "MANAGER") {
        navigate('/dashboard');
      
      } else {
        navigate("/homepage");
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(
  "Login Failed: " + (error?.response?.data?.message ?? "Server connection Lost")
);

    }
  }

  return (
 
    <div className="login-page-scope">
      <button className="back-button" onClick={() => navigate("/")}><i className="bi bi-arrow-left" style={{fontSize:"23px"}} ></i></button>
         {!role?<h1>Go back and select the role</h1>:
      <div className="login-container">
        <div className='bubble-top'></div>
        <div className='bubble-bottom'></div>
        <div className='login-card'>
          <div className='login-left'>
            <img src={purpleImg} alt="Login Image" className="login-image" />
          </div>
          <div style={{background:"none"}} className='login-right'>
          { isForgotPwd ? (
            <form className="form-container new" onSubmit={emailVerified ? (securityDataVerified ? handleChangePassword : verifySecurityData) : fetchSecurityQuestions}>
              <h1 className="fs-3"><b>Recover your Password</b></h1>
              <p className="subtitle mb-2">Follow the steps below</p>

              {/* Step 1 - Email */}
              {!emailVerified && (
                <>
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    
                  />
                  <button type="submit" className="btn w-100 mt-3 rounded-btn">Verify Email</button>
                </>
              )}

              {/* Step 2 - Security Questions */}
              {emailVerified && !securityDataVerified && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Security Question 1</label>
                    <input
                      className="form-control"
                      value={securityData.securityQue1}
                      readOnly

                    />
                    {/* <p>{securityData.securityQue1}</p> */}

                    <input
                      type="text"
                      className="form-control mt-2"
                      placeholder="Your Answer"
                      // style={{ height: '25px' }}
                      value={answers.answer1}
                      onChange={(e) => setAnswers({ ...answers, answer1: e.target.value })}
                    
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Security Question 2</label>
                    <input
                      className="form-control"
                      value={securityData.securityQue2}
                      readOnly

                    />

                    <input
                      type="text"
                      className="form-control mt-2"
                      placeholder="Your Answer"
                      value={answers.answer2}
                      onChange={(e) => setAnswers({ ...answers, answer2: e.target.value })}
                      
                    />
                  </div>

                  <button type="submit" className="btn w-100 rounded-btn">Continue</button>
                </>
              )}

              {/* Step 3 - Reset Password */}
              {securityDataVerified && (
                <>
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <div className="input-group">
                        <input
                            // Dynamically change the input type based on the state
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="showPassword"
                            // The checkbox's checked status is controlled by the state
                            checked={showPassword}
                            // Toggle the state when the checkbox is clicked
                            onChange={() => setShowPassword(!showPassword)}
                        />
                        <label className="form-check-label" htmlFor="showPassword">
                            Show Password
                        </label>
                    </div>
                    <button type="submit" className="btn w-100 mt-5 rounded-btn">Change Password</button>
                </>
            )}
            </form>
          ) : 
          <form className="form-container new" onSubmit={handleLogin}>
            <h1 className="fs-2"><b>Welcome {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}</b></h1>
            <p className='subtitle mb-5'>Fill in your details here</p>
            <div className='mt-5 mb-4'>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              
              />
            </div>
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="password" className="form-label">Password</label> { role === "BORROWER" && (<span className='forgot-password-text' onClick={() => setIsForgotPwd(!isForgotPwd)}>Forgot Password</span>)}
              </div>
              <input
                type={view}
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
               
              />
              <input
                type='checkbox'
                className="password-toggle"
                onChange={() => setView(view === 'password' ? 'text' : 'password')}
                checked={view === 'text'}
              />
              <span className='password-toggle-text'>Click to view Password</span>
            </div>
            <button type="submit" className="btn w-100 mt-3 rounded-btn">Login</button>
          </form>
          }
        </div>
      </div>
    </div>
  }
  </div>
  );
}

export default LoginPage;