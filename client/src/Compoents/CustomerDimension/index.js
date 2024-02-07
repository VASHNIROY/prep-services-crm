function CustomerDimension({ dimensionData, index }) {
  return (
    <div className="dimensions-main-container">
      <form className="dimensions-details-form-container">
        <h3>Box No: {index + 1}</h3>
        <div className="dimension-flex">
          {["length", "width", "height", "weight"].map((dimension) => (
            <div key={dimension} className="dimensions-details-input-container">
              <label className="dimensions-label-text">
                {dimension.charAt(0).toUpperCase() + dimension.slice(1)}:
              </label>
              <div className="dimension-detail-select-container">
                <p className={`customer-dimension-${dimension}`}>
                  {dimensionData[dimension]}
                </p>
              </div>
            </div>
          ))}
          <div className="dimension-details-input-container-1">
            <label className="dimensions-label-text">Quantity</label>
            <input
              type="number"
              placeholder="Enter the quantity"
              className="dimensions-details-input-1"
              value={dimensionData.itemNo}
              readOnly
            />
          </div>
          <div className="dimension-details-input-container-1">
            <label className="dimensions-label-text">Box By</label>
            <select
              className="dimensions-details-input-1"
              value={dimensionData.boxBy}
              readOnly
            >
              <option value="prep">Prep</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}
export default CustomerDimension;
