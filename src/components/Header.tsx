// import {useEffect, useState} from "react";
// import Dropdown from "./Dropdown";
import { useParams,useNavigate } from "react-router-dom";
import { useCall } from '@stream-io/video-react-sdk';

// import axios from "axios";
// const Base_Url = import.meta.env.VITE_BASE_URL

function Header({isAudioRoom}:{isAudioRoom:boolean}) {
  const { meeting_details_id } = useParams(); // Extract callId from route parameters
  // const location = useLocation();
  // this utility hook returns the call object from the <StreamCall /> context
  const call = useCall();
  // const [meeting,setMeeting] = useState();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // const isWaitingRoom = location.pathname.includes('/waiting-room/');
    // if (!isAudioRoom && !isWaitingRoom) {
    //   navigate('/');
    // }
    if (!isAudioRoom) {
      navigate('/');
    }
  };

  return (
    <div className="container-sm mt-4 mb-2 p-2">
      <div className="row justify-content-between align-items-center">
        <div className="col-6 col-md-6 col-sm-8 d-flex justify-content-start">
          <a className="text-primary" onClick={handleLogoClick}>
            <img src="/dollop_logo_blue.png" className="logo" alt="Logo" />
          </a>
        </div>
        <div className="col-6 col-md-6 col-sm-4 d-flex justify-content-end">
         {/* Conditional rendering based on callId */}
         {isAudioRoom && (
            <div className="d-flex gap-2 justify-content-center align-items-center pt-2 pt-md-4">
              <button className="report btn">
                <img src="/report_icon.png" alt="Report" />
                Report
              </button>
              <button className="exit btn" onClick={async () => {
                // Error handling (optional): Check if call exists before stopLive()
                if (call) {
                  await call.leave();
                  setTimeout(()=>{
                    navigate(`/waiting-room/${meeting_details_id}/join`)
                  },2000)
                } else {
                  console.error("Call object not available"); // Or handle it gracefully
                }
              }}>
                <img src="/exit-icon.png" className="icon" alt="Exit" />
                Exit
              </button>
            </div>
          )}
          {/* {location.pathname=="/" ? (<div className="d-flex justify-content-center align-items-center pt-2 pt-md-4">
          <Dropdown />
        </div>):
        null }  */}
        </div>
      </div>
    </div>
  );
}

export default Header;
