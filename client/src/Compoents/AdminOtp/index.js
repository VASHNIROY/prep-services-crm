import React, { useState } from "react";
import Toast from "../utlis/toast";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import signup from '../utlis/signup-img-2.png'

const AdminOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const email = localStorage.getItem("email");
  const staffresendotp = async () => {
    try {
      const response = await fetch(`${FETCH_URL}staffforgetpassword`, {
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
    if(otp){
    try {
      const response = await fetch(`${FETCH_URL}staffcustomerotpverfiysend`, {
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
        navigate("/AdminResetPassword");
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
          // src="https://www.ascarii.com/hubfs/Optimised-Customer-Service-v4.png"
          src={signup}
          className="Login-image"
          alt=""
        />
      </div>
      <div className="otp-input-sub-container">
        <div className="otp-input-display-container">
          <p className="otp-input-label-name">
            Enter the 4-digit OTP sent to your email address to verify your
            account.
          </p>
          <p className="otp-input-label-name">{email}</p>
          <h1 className="enter-your-otp-heading">Enter Your OTP</h1>
          <OtpInput
            value={otp}
            required
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span></span>}
            shouldAutoFocus={true}
            renderInput={(props) => <input {...props} />}
            inputStyle="otp-input-field"
          />
          {otp.length>3 && <button onClick={handleVerifyClick} className="verify-otp-button">
            Verify OTP
          </button>
}
          <p style={{ cursor: "pointer" }} onClick={staffresendotp}>
            Didn't get the OTP? Resend
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminOtp;

