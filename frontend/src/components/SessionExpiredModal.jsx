import React, { useContext } from 'react';
import { LmsContext } from '../context/LmsContext';
import '../styles/SessionExpiredModal.css'; // style this to cover whole screen
import { useNavigate } from 'react-router-dom';

const SessionExpiredModal = () => {
  const navigate=useNavigate();
    const {setToken,email,setRole,setUserEmail, setIsProfileComplete ,setId, setSessionExpired,setLoginTime }=useContext(LmsContext)
  const logout =()=>{

   
       sessionStorage.clear(); 
      setToken('')
      setRole('');
      setUserEmail('');
      setIsProfileComplete(false);
      setId('');
      setSessionExpired(false);
      setLoginTime(null)
  navigate("/");
     
    
    
  }

  return (
    <div className="session-expired-overlay">
      <div className="session-expired-content">
        <h2>Session Expired</h2>
        <p>Your session has expired. Please log in again to continue.</p>
        <button onClick={logout}>Login</button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;