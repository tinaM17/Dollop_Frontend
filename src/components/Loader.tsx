
import { Circles } from 'react-loader-spinner'

function Loader() {
  return (
    <div className="container">
        <div className="loading-container">
        <Circles color="#00BFFF" height={80} width={80} /> {/* Add your spinner here */}
      </div>
      </div>
  )
}

export default Loader
