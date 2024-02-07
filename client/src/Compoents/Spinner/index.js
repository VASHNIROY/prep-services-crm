
import RingLoader from "react-spinners/RingLoader";

import './index.css'

function Spinner(){
    return(
        <div className="spinner-loader">
            <RingLoader
        size={60}
        aria-label="Loading Spinner"
        data-testid="loader"
        margin={2}
        color="#124577"
        fontWeight={900}

      />
        </div>
    )
}
export default Spinner