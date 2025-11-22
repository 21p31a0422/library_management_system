// // Instead of: import jwtDecode from 'jwt-decode';
// import jwtDecode from 'jwt-decode';

// import { useContext, useEffect } from 'react';

// import { Navigate, useNavigate } from 'react-router-dom';
// import { LmsContext } from '../context/LmsContext';

// const ProtectedRoute = ({ children }) => {
 
   
//   const token =sessionStorage.getItem("token");
//   const { setSessionExpired}=useContext(LmsContext);
  
//   useEffect(()=>{
//    try {
    
//     if (!token) {
//       return <Navigate to="/" replace />;
//     }

//     const decoded = jwtDecode(token);
//     const userRole = decoded.usertype;
//     const isExpired = decoded.exp * 1000 < Date.now();
//        if(userRole!=="ADMIN")
//        {
//          <Navigate to="/" replace />;
//        }

//     if (isExpired) {
//       setSessionExpired(true);
//       console.log("fromisexpired");
      
//     }
//   } catch (error) {
//     // Invalid token

//     console.log("from catch");
//      <Navigate to="/" replace />;
//   }
// },[token])

//   return children;
// };
// export default ProtectedRoute;
import jwtDecode from 'jwt-decode';
import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LmsContext } from '../context/LmsContext';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const { setSessionExpired } = useContext(LmsContext);

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    try {
      if (!token) {
        setRedirect(true);
        console.log("first if")
        return;
      }

      const decoded = jwtDecode(token);
      const userRole = decoded.usertype;
      const isExpired = decoded.exp * 1000 < Date.now();
      console.log(userRole)
      if (userRole != "ADMIN") {
        setRedirect(true);
        console.log("second if")
        return;
      }

      if (isExpired) {

        setSessionExpired(true);
        setRedirect(true);
      }
    } catch (error) {
      console.log("Invalid token");
      console.log("from catch")
      setRedirect(true);
    }
  }, [token, setSessionExpired]);

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
