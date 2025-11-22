import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import { DropdownToggle } from 'react-bootstrap';
import { FaBook, FaExchangeAlt, FaChartBar } from 'react-icons/fa';
import '../styles/LandingPage.css'
import Books from '../components/Books';
import Footer from '../components/Footer';
import { useContext } from 'react';
import { LmsContext } from '../context/LmsContext';
import { useNavigate } from 'react-router-dom';
import UpdateAccount from "../components/UpdateAccount"

const LandingPage = (props) => {

    const { setRole,isProfileComplete } = useContext(LmsContext);
    const navigate = useNavigate();
    const handleClick=(role)=>{
      sessionStorage.setItem("role",role);
      setRole(role);
      useEffect(() => {
  if (!role) {
    navigate("/login");  // fires every render until role is set
  }
}, [role, navigate]);
    }
  return (
      <div className="landing-page-scope">
    <div className='landing'>
      {!props.loggedIn ?
      <div className="nav-container">
    <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
      <div className="container-fluid"> 
        <img src="library-icon.png" className='profile-image' />
        <a className="navbar-brand fs-3" href="#homepage">BookWise</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse custom-nav" id="navbarNav">
            <ul className="navbar-nav ms-auto me-auto">
                <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#home">Home</a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="#books-card">Books</a>
                </li>
               
            </ul>
            <ul className="navbar-nav">
                <li className="nav-item">
                  <Dropdown align="end">
                    <DropdownToggle
                      as="a"
                      className="nav-link dropdown no-caret"
                      id="dropdown-profile"
                    >
                     <button className='btn'>Login</button>
                    </DropdownToggle>
                    <Dropdown.Menu className='drop-down-menu'>
                      <Dropdown.Item className='drop-down-menu-item' href="/login" onClick={()=>handleClick("MANAGER")}>Manager</Dropdown.Item> 
                      <hr style={{ margin: "0" ,color:"black"}}/>
                      <Dropdown.Item href="/login" className='drop-down-menu-item'  onClick={()=>handleClick("BORROWER")}>Borrower</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
            </ul>
        </div>
      </div>
    </nav>
</div>
:  !isProfileComplete && (
      <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Account</h5>
            </div>
            <div className="modal-body p-0 m-0">
              <UpdateAccount />
            </div>
          </div>
        </div>
      </div>
    )
}




<div className='home' id="home">
    <div className='title'>
<h1>Manage your Library with Ease</h1>
<p>Streamline your library operations with our intuitive interface.Catalog,</p>
<p>Borrow, and manage your books effortlessly.</p>
</div>
</div>

<div className='features' id="features">
      <section className="features-section">
        <h2 className="features-title">Features</h2>
        <p className="features-subtitle">
          Our system offers a comprehensive suite of tools to manage your library efficiently.
        </p>

        <div className="features-container ">
          <div className="feature-card">
            <div className="feature-icon"><FaBook /></div>
            <h3>Cataloging</h3>
            <p>Easily catalog books with detailed information and cover images.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><FaExchangeAlt /></div>
            <h3>Circulation</h3>
            <p>Manage borrowing and returns also access issue history with overdue tracking.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><FaChartBar /></div>
            <h3>Reporting</h3>
            <p>Generate insightful reports on library usage, recent books, and more.</p>
          </div>
        </div>
      </section>
    </div>
    <div className='books-card p-0' id="books-card">
      <div className='books h-100 w-100 margin-0 padding-0' style={{backgroundColor: "rgba(34, 40, 42, 0.46)",color:"white"}}>
        <div className='container-fluid px-5'>
        <Books/ >
        </div>
        </div>
    </div>

 <Footer />
    </div>
    </div>
  )
}

export default LandingPage
