import { useNavigate } from "react-router-dom"

import './index.css'
function AdminMainPage(){
    const navigate = useNavigate()
    const addCustomer=()=>{
        navigate("/Customersignup")
    }
    const addStaff=()=>{
        navigate("/staffsignup")
    }
    const viewOrder=()=>{
        navigate("/adminhomepage")
    }
    return(
        <div className="admin-main-page-button-container">
            <button onClick={addCustomer} className="admin-main-page-button">
                Add Customer
            </button>
            <button onClick={addStaff} className="admin-main-page-button">
                Add Staff
            </button>
            <button onClick={viewOrder} className="admin-main-page-button">View Order</button>
        </div>
    )
}
export default AdminMainPage