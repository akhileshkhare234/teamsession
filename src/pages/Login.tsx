import { useForm } from "react-hook-form";//→ Imports useForm for form handling (register fields, validate, manage errors).
import { yupResolver } from "@hookform/resolvers/yup";//Connects Yup schema validation with React Hook Form.
import * as yup from "yup";//Schema-based validation library (used to define form rulesllike required).
import { useNavigate, Link } from "react-router-dom";// used for navigating the page, Allows programmatic navigation after successful login.
import localStorageUtil from "../utility/localStorageUtil";//Custom utility to store token in local storage.
import { useState } from "react";//Standard React hooks and import.
import React from "react";
import Corporate from "../assets/login.jpg";//background image
import drawerIcon from "../assets/drawer_icon.png";//logo image
import "./Login.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";//Icons for password visibility toggle and login check.
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "components/firebase/firebase";
import NotificationSetup from "./NotificationSetup";//Component shown after successful login.
// import { AuthResult } from "services/auth/AuthManager";

export interface LoginProps {//Defines the login data structure.
  email: string;
  password: string;
}
//Validation
const schema = yup
  .object({
    email: yup.string().required("Please enter your Email"),
    password: yup.string().required("Please enter your Password"),
  })
  .required();

export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");//Stores global login failure messages (wrong username/password).
  // const [passWord, setPassWord] = useState("");
  const [showPassword, setShowPassword] = useState(false);//Controls eye toggle for password.
  const [loginSuccess, setLoginSuccess] = useState(false);//Displays NotificationSetup component when true.

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Example function to manually set errors
  const validateManually = () => {
    setError("email", {
      type: "manual",
      message: "",
    });

    setError("password", {
      type: "manual",
      message: "",
    });
  };
  const toggle = () => {
    setShowPassword(!showPassword);//password visibility show/hide
    // setPassWord("");
  };

  const handleLogin = (data: LoginProps) => {
    signInWithEmailAndPassword(auth, data.email, data.password)//tries to login with firebase
      .then(async (userCredential: any) => {
        // console.log(userCredential);
        if (userCredential && userCredential.user) {
          const id_token = (userCredential as any)._tokenResponse.idToken;
          localStorageUtil.setLocalStorage("accessToken", id_token);

          localStorageUtil.setLocalStorage("accessToken", id_token);

          setLoginSuccess(true);//notification
          
          localStorage.getItem("accessToken") && navigate("/admin/dashboard");
         
          navigate("/admin/dashboard");//navigates
        }
      })
      .catch((err: any) => {
        setErrorMessage("Login failed. Please check your credentials.");
        console.log(err);
        validateManually();//handle failure and message displayed
      })
  };

  const onSubmit = (//Prevents default form submission.
    data: LoginProps,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    handleLogin(data);
  };

  return (
    <div className="login-container">
      {/* Left Side - Image */}
      <div className="login-image-section">
        <img
          src={Corporate}
          alt="Professional workspace"
          loading="lazy"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          {/* Header with Logo */}
          <div className="login-header">
            <h1 className="login-title">
              <Link to="/" className="login-logo-link">
                <img src={drawerIcon} alt="Team Session" className="login-logo-img" />
              </Link>
              Sign in to your account
            </h1>
          </div>

          {/* Login Form */}
          <form
            onSubmit={(e) => handleSubmit((data) => onSubmit(data, e))(e)}
            className="login-form"
          >
            {/* Error Message */}
            {errorMessage && (
              <div className="error-message-box">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="login-form-group">
              <label htmlFor="email" className="login-label">
                Email Address
              </label>
              <input
                id="email"
                {...register("email")}
                type="email"
                className={`login-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && (
                <span className="login-error-message">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="login-form-group">
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <div className="login-input-wrapper">
                <input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`login-input ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="password-toggle"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && (
                <span className="login-error-message">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="login-button"
            >
              Sign in
            </button>

            {/* Forgot Password Link */}
            <div className="forgot-password-wrapper">
              <a href="#" className="forgot-password-link">
                Forgot password?
              </a>
            </div>

            {/* Register Link */}
            <div className="register-link-wrapper">
              <span className="register-link-text">
                Don't have an account?
                <Link to="/signup" className="register-link">Register now</Link>
              </span>
            </div>
          </form>
        </div>
        {loginSuccess && <NotificationSetup />}
      </div>
    </div>
  );
}
