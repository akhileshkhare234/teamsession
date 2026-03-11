import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Register from "../../assets/login.jpg";
import drawerIcon from "../../assets/drawer_icon.png";
import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import "./SignUp.css";

// Validation schema
const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First Name is required")
    .min(2, "First Name must be at least 2 characters")
    .max(50, "First Name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "First Name must contain only letters"),
  lastName: Yup.string()
    .required("Last Name is required")
    .min(2, "Last Name must be at least 2 characters")
    .max(50, "Last Name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last Name must contain only letters"),
  companyName: Yup.string()
    .required("Company Name is required")
    .min(2, "Company Name must be at least 2 characters")
    .max(100, "Company Name must not exceed 100 characters"),
  website: Yup.string()
    .matches(
      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
      "Please enter a valid website URL (e.g., example.com or https://example.com)"
    )
    .nullable(),
  numEmployees: Yup.number()
    .required("Number of employees is required")
    .positive("Number of employees must be positive")
    .integer("Number of employees must be a whole number")
    .min(1, "Must have at least 1 employee")
    .max(1000000, "Number of employees seems too large"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),
  phoneNumber: Yup.string()
    .matches(
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      "Please enter a valid phone number"
    )
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .nullable(),
});

export default function SignUp() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange", // Enable live validation
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Here you would typically send the data to your backend API
      console.log("Form Data:", data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      reset(); // Clear form after successful submission
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setSubmitError("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      {/* Left Side - Image */}
      <div className="signup-image-section">
        <img
          src={Register}
          alt="Team collaboration"
          loading="lazy"
        />
      </div>

      {/* Right Side - Form */}
      <div className="signup-form-section">
        <div className="signup-form-wrapper">
          {/* Success Message */}
          {submitSuccess && (
            <div className="success-message">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Registration successful! Redirecting to login...</span>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="error-message-box">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{submitError}</span>
            </div>
          )}

          {/* Header */}
          <div className="signup-header">
           
            <h1 className="signup-title"> 
              <Link to="/" className="signup-logo-link">
              <img src={drawerIcon} alt="Team Session" className="signup-logo-img" />
            </Link> Create Account</h1>
            <p className="signup-subtitle">
              Enterprise accounts are designed to leverage APIs for integration, while Regular accounts can be used to access our product.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name and Last Name */}
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">
                  First Name <span className="required-asterisk">*</span>
                </label>
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        {...field}
                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                      />
                      {errors.firstName && (
                        <span className="error-message">{errors.firstName.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Last Name <span className="required-asterisk">*</span>
                </label>
                <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        {...field}
                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                      />
                      {errors.lastName && (
                        <span className="error-message">{errors.lastName.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Company Name, Website, Number of Employees */}
            <div className="form-row form-row-3">
              <div className="form-group">
                <label className="form-label">
                  Company Name <span className="required-asterisk">*</span>
                </label>
                <Controller
                  name="companyName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        {...field}
                        className={`form-input ${errors.companyName ? 'error' : ''}`}
                      />
                      {errors.companyName && (
                        <span className="error-message">{errors.companyName.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <Controller
                  name="website"
                  control={control}
                  defaultValue=""
                  render={({ field: { value, ...field } }) => (
                    <>
                      <input
                        type="text"
                        {...field}
                        value={value || ""}
                        className={`form-input ${errors.website ? 'error' : ''}`}
                      />
                      {errors.website && (
                        <span className="error-message">{errors.website.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Number of Employees <span className="required-asterisk">*</span>
                </label>
                <Controller
                  name="numEmployees"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <>
                      <input
                        type="number"
                        {...field}
                        className={`form-input ${errors.numEmployees ? 'error' : ''}`}
                      />
                      {errors.numEmployees && (
                        <span className="error-message">{errors.numEmployees.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Email and Phone Number */}
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required-asterisk">*</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <input
                        type="email"
                        {...field}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                      />
                      {errors.email && (
                        <span className="error-message">{errors.email.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  render={({ field: { value, ...field } }) => (
                    <>
                      <input
                        type="tel"
                        {...field}
                        value={value || ""}
                        className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                        placeholder="+1"
                      />
                      {errors.phoneNumber && (
                        <span className="error-message">{errors.phoneNumber.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="button-row">
              <button
                type="submit"
                className="signup-button"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span className="spinner"></span>
                    Signing Up...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>

            {/* Login Link */}
            <div className="login-link-wrapper">
              <span className="login-link-text">
                Already have an account?
                <Link to="/login" className="login-link">Login</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
