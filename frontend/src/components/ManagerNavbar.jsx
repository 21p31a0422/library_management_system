import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import '../styles/ManagerNavbar.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { DropdownToggle } from 'react-bootstrap';
import { useContext } from 'react';
import { LmsContext } from '../context/LmsContext';

const Navbar = () => {
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
    <div className="manager-nav">
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
                  <NavLink to="/dashboard" className={({ isActive }) =>
                    isActive ? "nav-link activeLink" : "nav-link"
                  }>
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/bookmanagement" className={({ isActive }) =>
                    isActive ? "nav-link activeLink" : "nav-link"
                  }>
                    Books
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/members" className={({ isActive }) =>
                    isActive ? "nav-link activeLink" : "nav-link"
                  }>
                    Members
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/return" className={({ isActive }) =>
                    isActive ? "nav-link activeLink" : "nav-link"
                  }>
                    Returns
                  </NavLink>
                </li>
                 <li className="nav-item">
                  <NavLink to="/issue" className={({ isActive }) =>
                    isActive ? "nav-link activeLink" : "nav-link"
                  }>
                    Issue Books
                  </NavLink>
                </li>
              </ul>

              <ul className="navbar-nav">
                <li className="nav-item">
                  <Dropdown align="end" >
                    <DropdownToggle as="a" className="nav-link dropdown no-caret">
                      <img src={`https://api.dicebear.com/9.x/identicon/svg?seed=${email}`}  style={{border:"1px solid black"}} alt="Profile" className="profile-image" />
                    </DropdownToggle>
                    <Dropdown.Menu className='drop-down-menu'>
                      <Dropdown.Item href="/profile" className='drop-down-menu-item'>My Profile</Dropdown.Item>
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
export default Navbar;
