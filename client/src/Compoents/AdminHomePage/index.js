import React, { Component } from "react";
import ProductList from "../adminOrders";
import AdminOrdersRejected from "./AdminOrdersRejected";
import AdminOrdersAccepted from "./AdminOrdersAccepted";
import ViewAllOrders from "../ViewAllOrders";
import "./index.css";

const tabList = [
  {
    id: "0",
    name: "Product List",
  },
  {
    id: "2",
    name: "Received",
  },
  {
    id: "1",
    name: "Declined",
  },
  {
    id: "3",
    name: "All Orders",
  },
];

class AdminHomePage extends Component {
  state = {
    activeProductTab: tabList[0].id,
  };

  onClickChangeActiveTab = (e) => {
    const selectedTabId = e.target.getAttribute("value");
    this.setState({ activeProductTab: selectedTabId });
  };

  render() {
    const { activeProductTab } = this.state;

    return (
      <>
        <div className="admin-home-page-main-container">
          <ul className="admin-home-page-product-tabs-container">
            {tabList.map((eachProduct) => {
              const activeProductTabColor =
                eachProduct.id === activeProductTab
                  ? `admin-home-page-product-tab admin-home-page-active-product-tab-color`
                  : "admin-home-page-product-tab";
              return (
                <li
                  key={eachProduct.id}
                  value={eachProduct.id}
                  onClick={this.onClickChangeActiveTab}
                  className={activeProductTabColor}
                >
                  {eachProduct.name}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          {activeProductTab === "0" && <ProductList openDetailPageComponent={this.props.openDetailPageComponent} />}
          {activeProductTab === "1" && <AdminOrdersRejected openDetailPageComponent={this.props.openDetailPageComponent} />}
          {activeProductTab === "2" && <AdminOrdersAccepted openDetailPageComponent={this.props.openDetailPageComponent} />}
          {activeProductTab === "3" && <ViewAllOrders openDetailPageComponent={this.props.openDetailPageComponent} />}
        </div>
      </>
    );
  }
}

export default AdminHomePage;
