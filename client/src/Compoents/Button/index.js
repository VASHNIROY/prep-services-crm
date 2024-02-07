import { ReactComponent as Loader } from "./loader.svg"
import "./index.css"
const Button = ({ onSubmit, text, loading = false, disabled }) => {
  return (
    <button className="loader-spinner-button " onClick={onSubmit} disabled={disabled}>
      {!loading ? text : <Loader className="spinner-button" />}
    </button>
  )
}

export default Button