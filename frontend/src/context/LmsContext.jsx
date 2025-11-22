


import { createContext, useState ,useEffect} from "react";
import jwtDecode from 'jwt-decode';
export const LmsContext = createContext();

export const LmsProvider = ({ children }) => {
  const [reload, setReload] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem("token")||'');
  const [role, setRole] = useState(sessionStorage.getItem("role")||'');
  const [email, setUserEmail] = useState(sessionStorage.getItem("email")||'');
  const [id,setId]=useState(sessionStorage.getItem("id") || '')
   const [loginTime, setLoginTime] = useState(sessionStorage.getItem('loginTime') || null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(sessionStorage.getItem("isProfileComplete")||false);
 useEffect(() => {
    if (!token || !loginTime) return;

    const interval = setInterval(() => {
       const decoded = jwtDecode(token);
        
          const isExpired = decoded.exp * 1000 < Date.now();
      const elapsed = Date.now() - parseInt(loginTime, 10);
      console.log(elapsed)
      if (isExpired) { // 1 hour
        setSessionExpired(true); 
        clearInterval(interval)// Show popup instead of logging out instantly
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [token, loginTime]);

 
  

  return (
    <LmsContext.Provider value={{ reload, setReload, token, setToken, role, setRole, email, setUserEmail, isProfileComplete, setIsProfileComplete ,id,setId, sessionExpired, setSessionExpired,loginTime,setLoginTime }}>
      {children}
    </LmsContext.Provider>
  );
};