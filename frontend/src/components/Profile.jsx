import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = ({ name, role, employeeId, avatar, contact, email }) => {
  return (
    <div className="d-flex flex-column align-items-center p-4 bg-white rounded shadow-sm" style={{ minWidth: 260 }}>
      <img
        src={avatar}
        alt="Profile"
        className="rounded-circle mb-3"
        style={{ width: 100, height: 100, objectFit: 'cover', border: '2px solid #e0e0e0' }}
      />
      <h5 className="mb-1">{name}</h5>
      <span className="text-muted" style={{ fontSize: '0.95rem' }}>{role}</span>
      <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Employee ID: {employeeId}</span>

      {email && <span className="text-secondary mt-1" style={{ fontSize: '0.9rem' }}>{email}</span>}
    </div>
  );
};

Profile.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  employeeId: PropTypes.string.isRequired,
  avatar: PropTypes.string,

  email: PropTypes.string,
};

Profile.defaultProps = {
  avatar: 'https://ui-avatars.com/api/?name=Manager&background=random',

  email: '',
};

export default Profile;
