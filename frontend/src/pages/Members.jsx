import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../components/Modal';
import MemberForm from '../components/MemberForm';
import MemberDetails from '../components/MemberDetails';
import ManagerNavbar from '../components/ManagerNavbar';
import { useContext } from 'react';
import { LmsContext } from '../context/LmsContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

import '../styles/Members.css';

// Action button styles
const actionButtonStyles = `
  .action-btn.view-btn {
    background-color: #4a6da7;
    color: white;
  }
  
  .action-btn.view-btn:hover {
    background-color: #3a5a8f;
  }
`;

// Add styles to the document
const styleElement = document.createElement('style');
styleElement.textContent = actionButtonStyles;
document.head.appendChild(styleElement);

const Members = () => {
  // State for members data and UI
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
   const {token,id}=useContext(LmsContext)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(5);
  
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // const token = localStorage.getItem('token');
        // if (!token) {
        //   throw new Error('Authentication required. Please log in.');
        // }

        const response = await axios.get(`http://localhost:8081/lms/borrower/fetchBorrowers`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200 && response.data) {
          
          setMembers(response.data);
        } else {
          throw new Error('Failed to load members data');
        }
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch members');
        
        if (err.response?.status === 401) {
          // Optionally redirect to login or show login modal
          console.error('Authentication required - redirecting to login');
          // You might want to add: navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {

    fetchMembers();
  }, []);

  // Handle search
  const filteredMembers = members
    .filter(member => member) // Filter out any null/undefined members
    .filter(member => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (member.userName?.toLowerCase() || '').includes(searchLower) ||
        (member.borrowerEmail?.toLowerCase() || '').includes(searchLower) ||
        (member.mobileNumber || '').includes(searchTerm) ||
        (String(member.borrowerId) || '').includes(searchTerm)
      );
    });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  

  const [emailError, setEmailError] = useState('');

  const handleAddMember = async (formData) => {
    try {
      setEmailError(''); // Reset email error
      
      // Structure the data according to CreateAccountDTO in the backend
      const requestData = {
        borrowerEmail: formData.email,
        password: formData.password,
        managerId:id
      };
      
      console.log('Sending data to server:', requestData);

      const response = await axios.post(
        'http://localhost:8081/lms/manager/create-borrower', 
        requestData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh the members list after successful addition
      const updatedResponse = await axios.get('http://localhost:8081/lms/borrower/fetchBorrowers', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setMembers(updatedResponse.data);
      setIsModalOpen(false);
      setEditingMember(null);
      toast.success('Member added successfully!');
      window.location.reload(); // Refresh the page
    } catch (err) {
      console.error('Error adding member:', err);
      
      if (err.response?.status === 409) {
        // Handle email already exists error (409 Conflict)
        setEmailError(err.response.data || 'This email is already registered. Please use a different email.');
      } else {
        const errorMessage = err.response?.data?.message || 'Failed to add member. Please try again.';
        toast.error(errorMessage);
      }
      
      if (err.response?.status === 401) {
        console.error('Authentication required - redirecting to login');
      }
    }
  };

  // Handle edit button click
  const handleEdit = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  // Function to handle member deletion by email
  const handleDelete = async (id) => {
    // Find the member to get their email
    const memberToDelete = members.find(member => member.borrowerId === id);
    
    if (!memberToDelete || !memberToDelete.borrowerEmail) {
      toast.error('Could not find member email');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the account for ${memberToDelete.borrowerEmail}?`)) {
      try {
        console.log('Attempting to delete member:', memberToDelete.borrowerEmail);
        // const token = localStorage.getItem('token');
        // if (!token) {
        //   throw new Error('Authentication required. Please log in.');
        // }
        console.log(memberToDelete);
        const response = await axios.delete(
          `http://localhost:8081/lms/borrower/deleteAccount?email=${memberToDelete.borrowerEmail}`,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('Delete response:', response);
        
        if (response.status === 200) {
          // Update the UI by removing the deleted member
          // setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
          
          // // Adjust current page if needed after deletion
          // const updatedMembers = members.filter(member => member.id !== id);
          // const maxPage = Math.ceil(updatedMembers.length / membersPerPage);
          // if (currentPage > maxPage && maxPage > 0) {
          //   setCurrentPage(maxPage);
          // }
          fetchMembers();
          toast.success('Member deleted successfully!');
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error deleting member:', {
          error: err,
          response: err.response?.data,
          status: err.response?.status
        });
        toast.error(`Failed to delete member: ${err.response?.data?.message || err.message}`);
      }
    }
  };
  
  // Get current members for the current page
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = (filteredMembers || []).slice(indexOfFirstMember, indexOfLastMember);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Cancel form editing
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };


  // if (error) {
  //   return <div className="error">{error}</div>;
  // }

  return (
    <div className='borrower'>
      <ManagerNavbar/>
    <div className="members-container p-5 mt-5">
      
      <div className="members-header">
        <h1>Library Members</h1>
        <div className="members-actions">
          <div className="search-container">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value);}}
              className="search-input"
            />
          </div>
          <button 
            className="add-member-btn" 
            onClick={() => {
              setEditingMember(null);
              setIsModalOpen(true);
            }}
          >
             Add Member +
          </button>
        </div>
      </div>

      {/* Member Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="Add New Member"
      >
        <MemberForm
          initialData={editingMember || {}}
          onSubmit={handleAddMember}
          onCancel={handleCancel}
          emailError={emailError}
        />
      </Modal>

      {/* View Member Details Modal */}
      <Modal
        isOpen={!!viewingMember}
        onClose={() => setViewingMember(null)}
        title="Member Details"
      >
        <MemberDetails 
          member={viewingMember} 
          onClose={() => setViewingMember(null)} 
        />
      </Modal>

      <div className="table-container">
          <div>
            <table className="members-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Member</th>
                  <th>Contact</th>
                  
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((member) => (
                  <tr key={member.borrowerId} className="member-row">
                    <td className="member-id">#{member.borrowerId}</td>
                    <td className="member-name">
                      <div className="member-avatar">
                        {member.userName ? 
                          member.userName
                            .split(' ')
                            .map(n => n[0] || '')
                            .join('')
                            .toUpperCase()
                            .substring(0, 2)
                          : '--'}
                      </div>
                      <div>
                        <div className="name">{member.userName}</div>
                        <div className="email">{member.borrowerEmail}</div>
                      </div>
                    </td>
                    <td className="member-contact">
                      <div><i className="fas fa-phone"></i> {member.mobileNumber}</div>
                    </td>
                    {/* <td className="member-address">
                      <i className="fas fa-map-marker-alt"></i> {member.address}
                    </td> */}
                    <td className="member-join-date">
                      <i className="far fa-calendar-alt"></i> {member.lastVisited || 'N/A'}
                    </td>
                  <td style={{ color: member.deleted ? "red" : "green", fontWeight: "bold" }}>
  {member.deleted ? "Suspended" : "Active"}
</td>

                    <td className="member-actions">
                      <button 
                        className="action-btn view-btn"
                         
                        title="View Details"
                        onClick={() => setViewingMember(member)}
                      >
                        <i className="fas fa-eye" color='white'></i>
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Delete"
                        onClick={() => handleDelete(member.borrowerId)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredMembers.length > membersPerPage && (
              <div className="pagination-container">
                <nav className="pagination-nav">
                  <button 
                    onClick={() => paginate(Math.max(1, currentPage - 1))} 
                    disabled={currentPage === 1}
                    className="pagination-button"
                    aria-label="Previous page"
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))} 
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                    aria-label="Next page"
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>
       
      </div>
    </div>
    </div>
  );
}

export default Members;
