import React, { useState } from "react";
import Toast from "../utlis/toast";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import "./CustomerOtp.css";
import signup from '../utlis/signup-img-2.png'


const CustomerOtpVerification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const email = localStorage.getItem("email");

  const resendCustomerOtp = async () => {
    try {
      const response = await fetch(`${FETCH_URL}resendCustomerOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await response.json();
      Toast.fire({
        icon: "success",
        title: data.message,
      });
    } catch (error) {
    }
  };

  const handleVerifyClick = async (e) => {
    e.preventDefault();
    if(otp !== ""){
    try {
      const response = await fetch(`${FETCH_URL}customerotpverfiy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: parseInt(otp),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: data.message,
        });
        navigate("/");
      } else {
        Toast.fire({
          icon: "error",
          title: data.message,
        });
      }
    } catch (error) {
    }
  }
  };

  return (
    <div className="otp-input-background-container">
    <div className="otp-input-form-container">
    <div className="login-image-container">
        <img
          src={signup}
          className="Login-image"
          alt=""
        />
      </div>
      <div className="otp-input-sub-container">
        <div className="otp-input-display-container">
          <p>
            Enter the 4-digit OTP sent to your email address to verify your
            account.
          </p>
          <p>{email}</p>
          <h1 className="enter-your-otp-heading">Enter Your OTP</h1>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span></span>}
            shouldAutoFocus={true}
            renderInput={(props) => <input {...props} />}
            inputStyle="otp-input-field"
          />
          <button onClick={handleVerifyClick} className="verify-otp-button">
            Verify OTP
          </button>
          <p style={{ cursor: "pointer" }} onClick={resendCustomerOtp}>
            Didn't get the OTP? Resend
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CustomerOtpVerification;
