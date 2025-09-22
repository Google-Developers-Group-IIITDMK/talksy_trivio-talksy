import React, { useState } from 'react';
import './UserInfoForm.css';

const UserInfoForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.trim().length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onFormSubmit(formData);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="user-info-screen">
      {/* Background */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 absolute inset-0">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="form-container">
        {/* Assistant Hologram */}
        <div className="hologram-container">
          <div className="hologram-circle">
            <div className="hologram-avatar">
              <div className="avatar-inner">
                <span className="text-4xl">🤖</span>
              </div>
            </div>
            <div className="hologram-rings"></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <div className="form-header">
            <h1 className="form-title">Welcome to TalkSie</h1>
            <p className="form-subtitle">Tell us about yourself to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="form-body">
            {/* Name Input */}
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className={`floating-input ${errors.name ? 'error' : ''}`}
                />
                <label className="floating-label">Name</label>
              </div>
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Bio Input */}
            <div className="input-group">
              <div className="input-wrapper">
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us a bit about yourself..."
                  rows={4}
                  className={`floating-input resize-none ${errors.bio ? 'error' : ''}`}
                />
                <label className="floating-label">Short Bio</label>
              </div>
              {errors.bio && <span className="error-message">{errors.bio}</span>}
            </div>

            {/* Password Input */}
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className={`floating-input ${errors.password ? 'error' : ''}`}
                />
                <label className="floating-label">Password</label>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating Profile...
                </>
              ) : (
                'Start Talking'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;