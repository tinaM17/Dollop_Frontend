import { useState } from "react";
import Button from "./Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Base_Url = import.meta.env.VITE_BASE_URL;

function Hero() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const isValidEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    console.log("Username:", username);
    console.log("Email:", email);
    // console.log("Date:", date);
    // Create a new Date object to set the time to midnight

    try {
      const response = await axios.post(`${Base_Url}/users`, {
        username,
        email,
        // date: date, // Ensure date is sent as UTC string
        "meeting_id": 1,
      });

      // Show success message from backend
      toast.success(response.data.message);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Show error message from backend
        toast.error(error.response.data.message);
      } else {
        // Show generic error message
        toast.error("An error occurred while registering.");
      }
    }
    setUsername('');
    setEmail('');
  };

  return (
    <div className="container">
      <ToastContainer position="top-center" />
      <div
        className="row
  justify-content-around"
      >
        <div className="col-md-6 col-12">
          <p className='bold'>Kill Anxiety <span style={{color:'#008EBE'}}>NOW</span></p>
          <p className="heroBoldText">Speak to an anxiety busting therapist immediately <p className="heroBold"> When you need it</p> </p>
          <div className="heroRegister d-flex flex-column gap-2">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="First Name"
            className="heroRegisterBox"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="heroRegisterBox"
          />
        </div>
        <div className="mt-4 invite">
          <Button text="Lets get rid of this anxiety" onClick={handleSubmit} />
        </div>
        <p className="heroBoldText">We will never ask you for more information than this!</p>
        <p className="heroBoldText">After you sign-up we will send you a link to our therapist waiting room,
          so that you can get immediate help and relief.
        </p>
        <p className="heroBoldText" style={{color:'#008EBE'}}>You are not alone in your struggle</p>
        </div>
        <div className="col-md-6 col-12">
          <div className="row featured">
           
              <img src='./home_header.png' className='featuredImg' />
            </div>
           
            
          </div>
        </div>
      </div>
      )
}

      export default Hero



// function Hero() {
//   return (
//     <div className="container">
//       <div
//         className="row
//   justify-content-around"
//       >
//         <div className="col-md-6 col-12">
//           <h1 className='headline'>"Hearing others with the same problems as me, gave me such relief... You are not alone!"</h1>
//           <p className='bold'>Try FREE Online <span>group therapy</span></p>

//         </div>
//         <div className="col-md-6 col-12">
//           <div className="row featured">
           
//               <img src='./featured.png' className='featuredImg' />
//             </div>
           
            
//           </div>
//         </div>
//       </div>
//       )
// }

//       export default Hero
