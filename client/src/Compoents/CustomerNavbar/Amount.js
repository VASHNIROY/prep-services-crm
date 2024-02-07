import React from "react";

const TransactionSummary = ({ totalAmount }) => {
  return (
    <p className="navbar-nav-item-name">
      Balance: <strong>$: {totalAmount}</strong>
    </p>
  );
};

export default TransactionSummary;
