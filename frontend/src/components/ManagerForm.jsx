import React, { useState } from 'react';
import '../styles/MemberForm.css';

const ManagerForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [view, setView] = useState('password');
  const [errors, setErrors] = useState({});

  // Validation rules
  const validate = () => {
    const validationErrors = {};

    // Name Validation
    if (!formData.name.trim()) {
      validationErrors.name = 'Full Name is required';
    } else if (!/^[a-zA-Z ]+$/.test(formData.name)) {
      validationErrors.name = 'Name can only contain letters and spaces';
    }

    // Email Validation
    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = 'Invalid email format';
    }
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])\S{8,}$/;
    // Password Validation
    if (!formData.password.trim()) {
      validationErrors.password = 'Password is required';
    } else if (!formData.password || !PASSWORD_REGEX.test(formData.password)) { 
      validationErrors.password =
        'Password must be at least 8 chars, include uppercase, lowercase, number & special char';
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formattedData = {
      managerName: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'MANAGER'
    };
    console.log('Submitting manager data:', formattedData);
    onSubmit(formattedData);
  };

  return (
    <div className="member-form">
      <div className="card shadow-sm p-4 form-container">
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-floating mb-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Full Name"
            />
            <label htmlFor="name">Full Name</label>
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Email"
            />
            <label htmlFor="email">Email</label>
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-floating mb-3">
            <input
              type={view}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Password"
            />
            <label htmlFor="password">Password</label>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* Show Password Toggle */}
          <div className="mb-3">
            <input
              type="checkbox"
              className="password-toggle me-2"
              onChange={() => setView(view === 'password' ? 'text' : 'password')}
              checked={view === 'text'}
            />
            <label htmlFor="password">Show Password</label>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary w-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-50"
              style={{ backgroundColor: '#8c61b5', color: 'white' }}
            >
              Add Manager
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerForm;