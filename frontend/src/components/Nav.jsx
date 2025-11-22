import React from 'react';
import { NavLink } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { DropdownToggle } from 'react-bootstrap';
import { useContext,useNavigate } from 'react';
import { LmsContext } from '../context/LmsContext';
import '../styles/Nav.css';

const Nav = () => {
  
   const {setToken,email,setRole,setUserEmail, setIsProfileComplete ,setId, setSessionExpired,setLoginTime }=useContext(LmsContext)
   const logout=()=>{
     sessionStorage.clear(); 
    setToken('')
    setRole('');
    setUserEmail('');
    setIsProfileComplete(false);
    setId('');
    setSessionExpired(false);
    setLoginTime(null)

   }

  return (
    <div className="borrower-nav">
      <div className="nav-container">
        <nav className="navbar navbar-expand-md navbar-light ">
          <div className="container-fluid">
            <img src="library-icon.png" className='profile-image' />
            <a className="navbar-brand fs-3" href="/homepage">BookWise</a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse custom-nav" id="navbarNav">
              <ul className="navbar-nav ms-auto me-auto">
                <li className="nav-item">
                  <NavLink to="/homepage" className={({ isActive }) =>
                    isActive ? "nav-link activeLink" : "nav-link"
                  }>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/explore" className={({ isActive }) =>
                    isActive ? "nav-link activeLink" : "nav-link"
                  }>
                    Explore
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/history" className={({ isActive }) =>
                    isActive ? "nav-link activeLink" : "nav-link"
                  }>
                    My Books
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/wishlist" className={({ isActive }) =>
                    isActive ? "nav-link activeLink" : "nav-link"
                  }>
                    Wishlist
                  </NavLink>
                </li>
              </ul>

              <ul className="navbar-nav">
                <li className="nav-item">
                  <Dropdown align="end" >
                    <DropdownToggle as="a" className="nav-link dropdown no-caret">
                      
                      <img src={`https://api.dicebear.com/9.x/identicon/svg?seed=${email}`} style={{border:"1px solid black"}} alt="Profile" className="profile-image" />
                    </DropdownToggle>
                    <Dropdown.Menu className='drop-down-menu'>
                      <Dropdown.Item href="/borrowerprofile" className='drop-down-menu-item'>My Profile</Dropdown.Item>
                      <hr className='m-0' style={{color:"black"}}/>
                      <Dropdown.Item href="/" className='drop-down-menu-item' onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Nav;
