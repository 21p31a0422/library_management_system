import React, { useState } from 'react';
import '../styles/MemberForm.css';

const MemberForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [view, setView] = useState('password');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' })); // clear error while typing
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])\S{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number & special char';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="member-form">
      <div className="card shadow-sm p-4 form-container">
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              placeholder="Email"
            />
            <label htmlFor="email">Email</label>
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-floating mb-3">
            <input
              type={view}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              placeholder="Password"
            />
            <label htmlFor="password">Password</label>
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {/* Show password */}
          <div className="mb-3">
            <input
              type="checkbox"
              id="showPassword"
              className="form-check-input me-2"
              onChange={() => setView(view === 'password' ? 'text' : 'password')}
              checked={view === 'text'}
            />
            <label htmlFor="showPassword" className="form-check-label">Show Password</label>
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-pill"
            style={{ backgroundColor: '#8c61b5', color: 'white' }}
          >
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;