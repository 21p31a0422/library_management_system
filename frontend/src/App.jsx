import { useState,useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {BrowserRouter,Routes,Route} from 'react-router-dom'

import ProtectedRoute from './auth/ProtectedRoute.jsx'
import { ToastContainer } from 'react-toastify';

import { LmsContext } from './context/LmsContext.jsx'

import { Button, Alert } from 'react-bootstrap';

import BookManagement from './pages/BookManagement.jsx'
import AddBook from './components/AddBook.jsx'
import AddCopy from './components/AddCopy.jsx'
import EditBook from './components/EditBook.jsx'
import Bookdescription from './components/Bookdescription.jsx'
import Explore from './pages/Explore.jsx'
import LandingPage from './pages/LandingPage.jsx'
import NewReleases from './components/NewReleases.jsx'
import HomePage from './pages/HomePage.jsx'
import WishList from './pages/WishList.jsx'
import BorrowHistory from './pages/BorrowHistory.jsx'
import ReturnBooks from './pages/ReturnBooks.jsx'
import ManagerNavbar from './components/ManagerNavbar';
import Dashboard from './pages/Dashboard';
import Books from './components/Books.jsx';
import Members from './pages/Members';
import IssueBook from './pages/IssueBook.jsx';
import ManagerProfile from './pages/ManagerProfile';
import LoginPage from './pages/LoginPage.jsx'
import MemberForm from './components/MemberForm.jsx'
import BorrowerProfile from './pages/BorrowerProfile.jsx'
import BorrowerProtectedRoute from './auth/BorrowerProtectedRoute.jsx'

import SessionExpiredModal from './components/SessionExpiredModal';
function App() {
    const { sessionExpired } = useContext(LmsContext);
  return (
    
   <BrowserRouter>
   {sessionExpired && <SessionExpiredModal />}
    <ToastContainer position="top-right" autoClose={3000} />
   <Routes>
   
   <Route path="/login" element={ <LoginPage/>}/>
     <Route path="/" element={<LandingPage />}></Route>

    
   

<Route path="/explore" element={<BorrowerProtectedRoute><Explore /></BorrowerProtectedRoute>} />
<Route path="/homepage" element={<BorrowerProtectedRoute><HomePage /></BorrowerProtectedRoute>} />
<Route path="/wishlist" element={<BorrowerProtectedRoute><WishList /></BorrowerProtectedRoute>} />
<Route path="/history" element={<BorrowerProtectedRoute><BorrowHistory /></BorrowerProtectedRoute>} />
<Route path="/borrowerprofile" element={<BorrowerProtectedRoute><BorrowerProfile /></BorrowerProtectedRoute>} />


  
    <Route path="/issue" element={<ProtectedRoute><IssueBook /></ProtectedRoute>} />
<Route path="/bookmanagement" element={<ProtectedRoute><BookManagement /></ProtectedRoute>} />
<Route path="/return" element={<ProtectedRoute><ReturnBooks /></ProtectedRoute>} />
<Route path="/profile" element={<ProtectedRoute><ManagerProfile /></ProtectedRoute>} />
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />

        
   </Routes>
   </BrowserRouter>
  )
}

export default App;
