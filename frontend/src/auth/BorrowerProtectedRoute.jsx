// // Instead of: import jwtDecode from 'jwt-decode';
// import jwtDecode from 'jwt-decode';

// import { useContext, useEffect } from 'react';

// import { Navigate, useNavigate } from 'react-router-dom';
// import { LmsContext } from '../context/LmsContext';

// const BorrowerProtectedRoute = ({ children }) => {
 
//    const { setSessionExpired}=useContext(LmsContext);
//   const token =sessionStorage.getItem("token");
  
//   console.log("hii");
//    try {
    
//     if (!token) {
//       return <Navigate to="/" replace />;
//     }

//     const decoded = jwtDecode(token);
//     const userRole = decoded.usertype;
//     const isExpired = decoded.exp * 1000 < Date.now();
//        if(userRole!=="USER")
//        {
//          return <Navigate to="/" replace />;
//        }

//     if (isExpired) {
//       setSessionExpired(true);
//       console.log("fromisexpired");
//       return ;
//     }
//   }catch (error) {
//     // Invalid token

//     console.log("from catch");
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };
// export default BorrowerProtectedRoute;
import jwtDecode from 'jwt-decode';
import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LmsContext } from '../context/LmsContext';

const BorrowerProtectedRoute = ({ children }) => {
  const { setSessionExpired } = useContext(LmsContext);
  const token = sessionStorage.getItem("token");

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    try {
      if (!token) {
        setRedirect(true);
        return;
      }

      const decoded = jwtDecode(token);
      const userRole = decoded.usertype;
      const isExpired = decoded.exp * 1000 < Date.now();

      if (userRole !== "USER") {
        setRedirect(true);
        return;
      }

      if (isExpired) {
        setSessionExpired(true);
        setRedirect(true);
      }
    } catch (error) {
      console.log("Invalid token");
      setRedirect(true);
    }
  }, [token, setSessionExpired]);

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default BorrowerProtectedRoute;
