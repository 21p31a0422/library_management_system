


// import { useEffect, useState } from "react";
// import React from "react";
// import "../styles/BorrowerProfile.css";
// import ManagerNavbar from "../components/ManagerNavbar";
// import { FaEye, FaEyeSlash } from "react-icons/fa"; // eye icons
// import axios from 'axios';
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useContext } from "react";
// import { LmsContext } from "../context/LmsContext";

// const  ManagerProfile = () => {
//     // Use the email, id, token from context 
//     // keep email, user name, mbl no seperate as they are unique in database
//     // add token from context 
//     const {token,email,id}=useContext(LmsContext);


//     const [newPassword, setNewPassword] = useState(""); 
//     const [currentPassword,setCurrentPassword]=useState("")
//     const [showPasswordOld, setShowPasswordOld] = useState(false); 
  
//     const [pwdEditable, setPwdEditable] = useState(false);
//     const [showPassword, setShowPassword] = useState(false); // toggle password visibility
//    const [manager, setManager] = useState({
//     name: "",
//     employeeId: "",
//     role: "Manager",
    
//   });
     
//  const handleCancel=()=>{
//         setCurrentPassword("");
//         setNewPassword("");
//          setPwdEditable(false);

//     }

//     const [displayName, setDisplayName] = useState(manager.name);

//    useEffect(() => {
//     const fetchManagerProfile = async () => {
//       try {
       
       

//          // Hardcoded manager ID as per requirement
//         const url = `http://localhost:8081/lms/manager/${id}`;
        
//         console.log('Fetching from URL:', url);
        
//         const response = await axios.get(url, {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           validateStatus: function (status) {
//             return status < 500; // Reject only if the status code is greater than or equal to 500
//           }
//         });
        
//         console.log('API Response:', response);
        
//         if (response.status === 200 && response.data) {
//           console.log(response.data)
//           setManager({
//             name: response.data.managerName || 'Not provided',
//             employeeId: response.data.managerId || 'Not provided',
//             role: response.data.role || 'Manager'
//           });
//           setError(null);
// setDisplayName(response.data.managerName);

//         } else {
//           throw new Error(response.data?.message || `Unexpected status code: ${response.status}`);
//         }
//       } catch (err) {
//         const errorMessage = err.response?.data?.message || 
//                            err.message || 
//                            'Failed to load manager profile';
        
//       } finally {
        
//       }
//     };

//     fetchManagerProfile();
//   }, []);

    
//     //   logic to avoid the changing of firstname when input is changed

//     const handleChangePassword = async (e) => {
//         e.preventDefault();
//         if (!newPassword.trim()) {
//         //    alert("Please enter a new password");
//            toast.error("Please enter a new password");
//         return;
//         }
//         try {
//             // API CALL - it is enough to return a string as a response from the api call
//             const response = await axios.post(`http://localhost:8081/lms/manager/change-password`, {
//               email:email,
//               currentPassword:currentPassword,
//               newPassword:newPassword,
//             }, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//             console.log("Response data", response);
//             setNewPassword("");
//             setCurrentPassword("")
//             setPwdEditable(false);
//             setShowPassword(false);
//             toast.success("Password updated successfully");
//             // alert("Password updated successfully");
//         } catch (error) {
//             toast.error("Wrong Current password");
//             // alert("Error while changing password");
//             console.log(error);
//         }
//     }

//     return (
//         <>
//              <ManagerNavbar /> 
//             <div className="bwr-container">
//                 <div className="profile-container">
//                     <div className="bwr-profile-header mb-3">
//                         <h2 className="title">Welcome {manager.name}</h2>
//                         <p className="subtitle">
//                             Manage your personal information here..
//                         </p>
//                     </div>
//                     <div className="row g-4" >
//                         <div className="col-lg-4">
//                             <div className="avatar-card mb-3"style={{height:"200px"}}>
//                                 <img
//                                     src={`https://api.dicebear.com/9.x/identicon/svg?seed=${email}`}
//                                     alt={displayName}
//                                     className="avatar-img"
//                                 />
//                                 <h4 className="bwr-name">{manager.name}</h4>
                               
//            </div>

//                             {/* Security Section */}
//                             <div className="security-card">
//                                 <div className="info-title">Security</div>
//                                 {pwdEditable && (
//                                     <div style={{ position: "relative"}}>
                                  
//                                                                               <p className="bwr-unique-data text-align-left">Enter your Current Password here</p> 
//                                                                          <input
//                                                                              type={showPasswordOld ? "text" : "password"}
//                                                                              className="info-input"
//                                                                              style={{color:"black"}}
//                                                                              value={currentPassword}
//                                                                              onChange={(e) => setCurrentPassword(e.target.value)}
//                                                                          />
//                                                                           <span
//                                                                              style={{
//                                                                                  position: "absolute",
//                                                                                  right: "10px",
//                                                                                  top: "25%",
//                                                                                  transform: "translateY(-50%)",
//                                                                                  cursor: "pointer",
//                                                                              }}
//                                                                              onClick={() => setShowPasswordOld(!showPasswordOld)}
//                                                                          >
//                                                                              {showPasswordOld ? <FaEyeSlash /> : <FaEye />}
//                                                                              </span>
//                                         <p className="bwr-unique-data text-align-left">Enter your new password here</p> 
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         className="info-input"
//                                         style={{color:"black"}}
//                                         value={newPassword}
//                                         onChange={(e) => setNewPassword(e.target.value)}
//                                     />
//                                     <span
//                                         style={{
//                                             position: "absolute",
//                                             right: "10px",
//                                             top: "70%",
//                                             transform: "translateY(-50%)",
//                                             cursor: "pointer",
//                                         }}
//                                         onClick={() => setShowPassword(!showPassword)}
//                                     >
//                                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                                     </span>
//                                 </div>
//                                 )}
//                                 {!pwdEditable ? (
//                                     <button onClick={() => setPwdEditable(true)} className="security-btn">Change Password</button>
//                                 ) : (
//                                     <button onClick={handleChangePassword} className="security-btn">Save Password</button>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Personal Info Form */}
//                         <div className="col-lg-8">
//                             <div className="info-card">
//                                 <div className="info-title">Personal Information</div>
//                                 {manager && (
//                                     <form >
//                                         <div
//                                             className="d-flex flex-column"
//                                             style={{ gap: "12px" }}
//                                         >
//                                             <div>
//                                                 <label htmlFor="name" className="info-label">
//                                                      Name
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     name="name"
//                                                     id="name"
//                                                     className="info-input form-control"
//                                                     value={manager.name}
                                                   
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <label htmlFor="managerId" className="info-label">
//                                                     Manager Id
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     name="managerId"
                                                  
//                                                     id="managerId"
//                                                     className="info-input form-control"
//                                                     value={manager.employeeId}
//                                                     readOnly
//                                                 />
//                                             </div>
// 					<div>
//                                                 <label htmlFor="managerId" className="info-label">
//                                                     Email
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     name="email"
//                                                     id="email"
//                                                     className="info-input form-control"
//                                                     value={email}
//                                                     readOnly
//                                                 />
//                                             </div>

                                           
                                           
                                           
             
//                                         </div>
//                                     </form>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
            
//         </>
//     );
// };


// export default ManagerProfile;

import { useEffect, useState } from "react";
import React from "react";
import "../styles/BorrowerProfile.css";
import ManagerNavbar from "../components/ManagerNavbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { LmsContext } from "../context/LmsContext";
import { Modal, Button } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import ManagersTable from '../components/MembersTable';
import ManagerForm from "../components/ManagerForm";

const  ManagerProfile = () => {
    // Use the email, id, token from context 
    // keep email, user name, mbl no seperate as they are unique in database
    // add token from context 
    const {token,email,id}=useContext(LmsContext);


    const [newPassword, setNewPassword] = useState(""); 
    const [currentPassword,setCurrentPassword]=useState("")
    const [showPasswordOld, setShowPasswordOld] = useState(false); 
  
    const [pwdEditable, setPwdEditable] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // toggle password visibility
   const [manager, setManager] = useState({
    name: "",
    employeeId: "",
    role: "Manager",
    
  });
     
    const handleCancel = () => {
        setCurrentPassword("");
        setNewPassword("");
        setPwdEditable(false);
        setIsModalOpen(false);
    }

    const fetchAllManagers = async () => {
        try {
            setLoadingManagers(true);
            const response = await axios.get('http://localhost:8081/lms/manager/all', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setManagers(response.data);
        } catch (error) {
            console.error('Error fetching managers:', error);
            toast.error('Failed to fetch managers');
        } finally {
            setLoadingManagers(false);
        }
    };

    const [displayName, setDisplayName] = useState(manager.name);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('addManager'); // 'addManager' or 'viewManagers'
    const [managers, setManagers] = useState([]);
    const [loadingManagers, setLoadingManagers] = useState(false);

   useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
       
       

         // Hardcoded manager ID as per requirement
        const url = `http://localhost:8081/lms/manager/${id}`;
        
        console.log('Fetching from URL:', url);
        
        const response = await axios.get(url, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          validateStatus: function (status) {
            return status < 500; // Reject only if the status code is greater than or equal to 500
          }
        });
        
        console.log('API Response:', response);
        
        if (response.status === 200 && response.data) {
          console.log(response.data)
          setManager({
            name: response.data.managerName || 'Not provided',
            employeeId: response.data.managerId || 'Not provided',
            role: response.data.role || 'Manager'
          });
          setError(null);
setDisplayName(response.data.managerName);

        } else {
          throw new Error(response.data?.message || `Unexpected status code: ${response.status}`);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           'Failed to load manager profile';
        
      } finally {
        
      }
    };

    fetchManagerProfile();
  }, []);

    
    //   logic to avoid the changing of firstname when input is changed

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!newPassword.trim()) {
        
           toast.error("Please enter a new password");
        return;
        }
        // Put this at the top of your file
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])\S{8,}$/;

// Use it wherever you validate (login / change password)
if (!newPassword || !PASSWORD_REGEX.test(newPassword)) {
  toast.error("Password must be ≥8 chars, include uppercase, lowercase, number, special char, and no spaces");
  return;
}

        try {
            // API CALL - it is enough to return a string as a response from the api call
            console.log(currentPassword);
            const response = await axios.post(`http://localhost:8081/lms/manager/change-password`, {
              email:email,
              currentPassword:currentPassword,
              newPassword:newPassword,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("Response data", response);
            setNewPassword("");
            setCurrentPassword("")
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

    const handleAddManager = () => {
        setModalContent('addManager');
        setIsModalOpen(true);
    };

    const handleViewManagers = async () => {
        setModalContent('viewManagers');
        await fetchAllManagers();
        setIsModalOpen(true);
    };



    const handleSubmitNewManager = async (formData) => {
        try {
            const response = await axios.post('http://localhost:8081/lms/manager/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 201) {
                toast.success('Manager added successfully');
                fetchAllManagers(); // Refresh the managers list
                setModalContent('viewManagers'); // Switch to view mode
            }
        } catch (error) {
            console.error('Error adding manager:', error);
            toast.error(error.response?.data?.message || 'Failed to add manager');
        }
    };

    const handleDeleteManager = async (managerId) => {
        if (window.confirm('Are you sure you want to delete this manager?')) {
            try {
                setLoadingManagers(true);
                if(managerId === 1){
                    toast.error('Manager cannot be deleted');
                    return;
                }
                const response = await axios.delete(`http://localhost:8081/lms/manager/${managerId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.status === 200) {
                    toast.success('Manager deleted successfully');
                    fetchAllManagers(); // Refresh the managers list
                }
            } catch (error) {
                console.error('Error deleting manager:', error);
                toast.error(error.response?.data?.message || 'Failed to delete manager');
            } finally {
                setLoadingManagers(false);
            }
        }
    };

    return (
        <>
             <ManagerNavbar /> 
            <div className="bwr-container">
                <div className="profile-container">
                    <div className="bwr-profile-header mb-3">
                        <h2 className="title">Welcome {manager.name}</h2>
                        <p className="subtitle">
                            Manage your personal information here..
                        </p>
                    </div>
                    <div className="row g-4" >
                        <div className="col-lg-4">
                            <div className="avatar-card mb-3"style={{height:"200px"}}>
                                <img
                                    src={`https://api.dicebear.com/9.x/identicon/svg?seed=${email}`}
                                    alt={displayName}
                                    className="avatar-img"
                                />
                                <h4 className="bwr-name">{manager.name}</h4>
                               
           </div>

                            {/* Security Section */}
                            <div className="security-card">
                                <div className="info-title">Security</div>
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
                                            top: "64%",
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
                                {manager && (
                                    <form >
                                        <div
                                            className="d-flex flex-column"
                                            style={{ gap: "12px" }}
                                        >
                                            <div>
                                                <label htmlFor="name" className="info-label">
                                                     Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="info-input form-control"
                                                    value={manager.name}
                                                   
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="managerId" className="info-label">
                                                    Manager Id
                                                </label>
                                                <input
                                                    type="text"
                                                    name="managerId"
                                                  
                                                    id="managerId"
                                                    className="info-input form-control"
                                                    value={manager.employeeId}
                                                    readOnly
                                                />
                                            </div>
                    <div>
                                                <label htmlFor="managerId" className="info-label">
                                                    Email
                                                </label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    className="info-input form-control"
                                                    value={email}
                                                    readOnly
                                                />
                                                
                                            </div>     
                                            {sessionStorage.getItem('id') === '1' && (
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                    <button type="button" className="security-btn" onClick={() => handleAddManager()}>
                                                        Add New Manager
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="security-btn" 
                                                        onClick={handleViewManagers}
                                                        disabled={loadingManagers}
                                                    >
                                                        {loadingManagers ? 'Loading...' : 'View all Managers'}
                                                    </button>
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
            
            {/* Managers Table Modal */}
            <Modal 
                show={isModalOpen && modalContent === 'viewManagers'}
                onHide={handleCancel}
                size="xl"
                centered
            >
                <Modal.Header closeButton style={{ color: 'black' }}>
                    <Modal.Title>All Managers</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <ManagersTable 
                        managers={managers} 
                        loading={loadingManagers}
                        onDeleteManager={handleDeleteManager}
                    />
                </Modal.Body>
            </Modal>

            {/* Add Manager Modal */}
            <Modal
                show={isModalOpen && modalContent === 'addManager'}
                onHide={handleCancel}
                centered
            >
                <Modal.Header closeButton>
                    {/* <Modal.Title>Add New Manager</Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                    <ManagerForm
                        onSubmit={handleSubmitNewManager}
                        onCancel={handleCancel}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ManagerProfile;