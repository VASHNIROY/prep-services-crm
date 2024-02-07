import Toast from "../utlis/toast";
const CustomerButton = ({
  id,
  discounted_amount,
  fetchProducts,
  fetchTotalAmount,
  orderIds,
}) => {
 
  const token = sessionStorage.getItem("token");
  const handleSubmit = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to reject this Invoice?"
    );

    if (!isConfirmed) {
      return;
    }
    const requestData = {
      status: 7,
      orderIds: orderIds,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_FETCH_URL}declineOrder/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData), // Stringify the data
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchProducts();
        
        Toast.fire({
          icon: "success",
          title: data.message,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: data.message,
        });
      }
    } catch (error) {}
  };

  const handleSubmit1 = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to accept this Invoice?"
    );

    if (!isConfirmed) {
      return;
    }
    try {
      const amount2 = {
        amount: discounted_amount,
        orderIds: orderIds,
        status: 6,
      };
      const response = await fetch(
        `${process.env.REACT_APP_FETCH_URL}acceptOrder/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(amount2),
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchProducts();
        fetchTotalAmount();
        Toast.fire({
          icon: "success",
          title: data.message,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: data.message,
        });
      }
    } catch (error) {}
  };

  const onClickDecline = (e) => {
    const status = "1"; // Set the status here
    handleSubmit(e.target.value, status);
    // window.location.reload();
  };

  const onClickReceived = (e) => {
    const status = "2"; // Set the status here
    handleSubmit1(e.target.value, status);
    // window.location.reload();
  };

  return (
    <>
      <button
        value={id}
        onClick={onClickReceived}
        className="admin-order-accepted-received-button"
      >
        Accept
      </button>
      <button
        value={id}
        onClick={onClickDecline}
        className="admin-order-accepted-declined-button"
      >
        Decline
      </button>
    </>
  );
};

export default CustomerButton;
