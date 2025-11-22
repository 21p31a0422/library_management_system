import React, { useContext } from 'react';
import { Table, Spinner, Modal, Button, Form } from 'react-bootstrap';
import {useState} from "react"
import '../styles/MembersTable.css';
import { LmsContext } from '../context/LmsContext';
import axios from "axios";
import {toast} from "react-toastify"

const MembersTable = ({ managers, loading, onDeleteManager }) => {
  const {token}=useContext(LmsContext)
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [newPassword, setNewPassword] = useState('');
    const handleShowModal = (manager) => {
    setSelectedManager(manager);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewPassword('');
    setSelectedManager(null);
  };

  const handleSubmit =async () => {
    if (newPassword.trim() === '') {
      toast.error('Please enter a new password');
      return;
    }
    const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])\S{8,}$/;
    if (!newPassword || !PASSWORD_REGEX.test(newPassword)) {
      toast.error("Password must be ≥8 chars, include uppercase, lowercase, number, special char, and no spaces");
      return;
    }
    try {
    const response =await axios.post(`http://localhost:8081/lms/manager/updatePassword?managerId=${selectedManager?.managerId}&newPassword=${newPassword}`,null, {
           headers: { 
            authorization: `Bearer ${token}`
           }
    });
   
    if (response.status==200) {
      toast.success("Password Changed Successfully");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error(error.response.data.message);
  }
   // onUpdatePassword(selectedManager.managerId, newPassword);
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="managers-loading">
        <Spinner animation="border" variant="primary" className="me-2" />
        Loading managers...
      </div>
    );
  }

  return (
    <div className="table-container">
      <Table striped bordered hover className="managers-table">
        <thead>
          <tr>
            <th className="col-id">ID</th>
            <th className="col-name">Name</th>
            <th className="col-email">Email</th>
            <th className="col-role">Role</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {managers.length > 0 ? (
            managers.map((manager) => (
              <tr key={manager.managerId} className="manager-row">
                <td className="col-id">{manager.managerId}</td>
                <td className="col-name">{manager.managerName}</td>
                <td className="col-email">{manager.email}</td>
                <td className="col-role">
                  <span className="role-badge">
                    {manager.role || 'Manager'}
                  </span>
                </td>
               <td className="col-actions d-flex flex-row justify-content-evenly">
                  <button 
                    onClick={() => onDeleteManager(manager.managerId)}
                    className="action-btn delete-btn"
                    title="Delete Manager"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                  <button className="btn action-btn" onClick={() => handleShowModal(manager)} style={{backgroundColor:"#8c61b5",color:"white"}}>Update Password</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-managers">No managers found</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="managers-card-footer">
        <span className="managers-count">
          {managers.length} {managers.length === 1 ? 'manager' : 'managers'} found
        </span>
      </div>
 <Modal className='update-password' show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Manager Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Manager ID</Form.Label>
              <Form.Control type="text" value={selectedManager?.managerId || ''} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                // Use a ternary operator to toggle the input type
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Show Password"
                // The checked state is controlled by the showPassword state variable
                checked={showPassword}
                // The onChange handler toggles the showPassword state
                onChange={() => setShowPassword(!showPassword)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button className="btn" style={{backgroundColor:"#8c61b5",color:"white",border:"none"}} onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>

    </div>

    // In ManagerProfile.jsx

    );
    
};

export default MembersTable;