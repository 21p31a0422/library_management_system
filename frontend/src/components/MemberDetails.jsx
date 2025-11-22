import React from 'react';
import '../styles/MemberDetails.css';

const MemberDetails = ({ member, onClose }) => {
  if (!member) return null;
  console.log(member);

  return (
    <div className='all-details'>
    <div className="form-content">
      <div className="form-group">
        <label className="form-label">Email</label>
        <div className="form-control-plaintext">
          {member.borrowerEmail || 'N/A'}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Name</label>
        <div className="form-control-plaintext">
          {member.firstName || 'N/A'}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Mobile</label>
        <div className="form-control-plaintext">
          {member.mobileNumber || 'N/A'}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Last Visited</label>
        <div className="form-control-plaintext">
          {member.lastVisited || 'N/A'}
        </div>
      </div>

     
       <div className="form-group">
        <label className="form-label">Area</label>
        <div className="form-control-plaintext">
          {member.address?.area|| 'N/A'}
        </div>
      </div>
       <div className="form-group">
        <label className="form-label">Door No</label>
        <div className="form-control-plaintext">
          {member.address?.doorNo || 'N/A'}
        </div>
      </div>
       <div className="form-group">
        <label className="form-label">Landmark</label>
        <div className="form-control-plaintext">
          {member.address?.landmark || 'N/A'}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Street Name</label>
        <div className="form-control-plaintext">
          {member.address?.streetName || 'N/A'}
        </div>
      </div>
       <div className="form-group">
        <label className="form-label">State</label>
        <div className="form-control-plaintext">
          {member.address?.state || 'N/A'}
        </div>

        <div className="form-group">
        <label className="form-label">Created by</label>
        <div className="form-control-plaintext">
          {member.manager.managerName || 'N/A'}
        </div>
      </div>
      </div>

      <div className="form-group">
        <label className="form-label">Profile Status</label>
        <div className="form-control-plaintext">
          {member.profileComplete ? (
            <span className="badge bg-success">Complete</span>
          ) : (
            <span className="badge bg-warning text-dark">Incomplete</span>
          )}
        </div>
      </div>

    </div>
    </div>
  );
};

export default MemberDetails;
