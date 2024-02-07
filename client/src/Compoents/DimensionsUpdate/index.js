import React, { useState } from "react";
import "./index.css";
import Toast from "../utlis/toast";
const DimensionsUpdate = ({
  id,
  fetchProducts,
  fetchData1,
  handleDimensions,
}) => {
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
    itemNo: "",
    boxBy: "prep",
  });

  const [unitOptions] = useState({
    length: ["cm", "inches", "feet", "meters"],
    width: ["cm", "inches", "feet", "meters"],
    height: ["cm", "inches", "feet", "meters"],
    weight: ["g", "kg", "lb"],
  });

  const [selectedUnits, setSelectedUnits] = useState({
    length: "inches",
    width: "inches",
    height: "inches",
    weight: "lb",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDimensions({
      ...dimensions,
      [name]: value,
    });
  };

  const handleUnitChange = (e, dimension) => {
    const selectedUnit = e.target.value;
    setSelectedUnits({
      ...selectedUnits,
      [dimension]: selectedUnit,
    });
  };

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dimensions.length > 25) {
      Toast.fire({
        icon: "error",
        title: "Length is greater than 25. Enter a value below 25",
      });
      return;
    }
    if (dimensions.width > 25) {
      Toast.fire({
        icon: "error",
        title: "Width is greater than 25. Enter a value below 25",
      });
      return;
    }
    if (dimensions.height > 25) {
      Toast.fire({
        icon: "error",
        title: "Height is greater than 25. Enter a value below 25",
      });
      return;
    }
    if (dimensions.weight > 50) {
      Toast.fire({
        icon: "error",
        title: "Weight is greater than 50. Enter a value below 50",
      });
      return;
    }
    try {
      const dimensionsWithUnits = {
        length: dimensions.length + selectedUnits.length,
        width: dimensions.width + selectedUnits.width,
        height: dimensions.height + selectedUnits.height,
        weight: dimensions.weight + selectedUnits.weight,
        itemNo: dimensions.itemNo,
        boxBy: dimensions.boxBy,
      };
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${FETCH_URL}CreateDimension/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dimensionsWithUnits),
      });
      if (response.ok) {
        response.json().then((data) => {
          Toast.fire({
            icon: "success",
            title: data.message,
          });
        });
        setDimensions({
          length: "",
          width: "",
          height: "",
          weight: "",
          itemNo: "",
          boxBy: "prep",
        });

        setSelectedUnits({
          length: "inches",
          width: "inches",
          height: "inches",
          weight: "lb",
        });

        fetchData1();

        handleDimensions();
        fetchProducts();
      } else {
        response.json().then((data) => {
          Toast.fire({
            icon: "error",
            title: data.message,
          });
        });
        fetchProducts();
      }
    } catch {}
  };
  const handleBoxBy = (e) => {
    setDimensions({ ...dimensions, boxBy: e.target.value });
  };

  return (
    <div className="dimensions-main-container">
      <form className="dimensions-form-container" onSubmit={handleSubmit}>
        <div className="dimension-flex-container">
          {["length", "width", "height", "weight"].map((dimension) => (
            <div key={dimension} className="dimensions-input-container">
              <label className="dimensions-label-text">
                {dimension.charAt(0).toUpperCase() + dimension.slice(1)}:
              </label>
              <div className="dimension-select-container">
                <input
                  className="dimensions-input"
                  type="number"
                  name={dimension}
                  value={dimensions[dimension]}
                  onChange={handleInputChange}
                  required
                />
                <select
                  className="dimensions-select"
                  value={selectedUnits[dimension]}
                  onChange={(e) => handleUnitChange(e, dimension)}
                >
                  {unitOptions[dimension].map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        <div className="dimension-flex-container">
          <div className="dimension-input-container-1">
            <label className="dimensions-label-text">Quantity</label>
            <input
              type="number"
              value={dimensions.itemNo}
              name="itemNo"
              required
              onChange={handleInputChange}
              placeholder="Enter the quantity"
              className="dimensions-input"
            />
          </div>
          <div className="dimension-input-container-1">
            <label className="dimensions-label-text">Box By</label>
            <select
              className="dimensions-input"
              value={dimensions.boxBy}
              onChange={handleBoxBy}
            >
              <option value="prep">Prep</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
        <center>
          <button className="dimensions-button" type="submit">
            Update
          </button>
        </center>
      </form>
    </div>
  );
};

export default DimensionsUpdate;
