import './index.css'
import banner from "../images/banner.png"
function Banner(){
    return(
        <div className="banner-container">
            <img src={banner} alt="" className="banner-image"/> 
        </div>
    )
}
export default Banner