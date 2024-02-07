import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { encrypt } from "../Encrypt";

import "./index.css";

function WalletAdd() {
  const [amount, setAmount] = useState(0);
  const [selectedOption, setSelectedOption] = useState("Credit Card");

  const navigate = useNavigate();

  const encryptedText = encrypt(amount);

  const handleProceed = () => {
    const encodedText = encodeURIComponent(encryptedText);
    navigate(`/payment?encrypted=${encodedText}`);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="wallet-add-main-container">
      <div className="wallet-add-sub-container">
        <h1 className="wallet-add-heading">Please Enter The Amount</h1>
        <div className="wallet-add-field-container">
          <input
            type="number"
            placeholder="Enter the Amount"
            className="wallet-add-input"
            name="amount"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        <div className="wallet-add-field-container">
          <select
            className="wallet-add-field-container"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <option className="wallet-add-input" value="Credit Card">
              Credit Card
            </option>
          </select>
        </div>
        <button className="service-add-button" onClick={handleProceed}>
          Proceed
        </button>
      </div>
    </div>
  );
}
export default WalletAdd;
