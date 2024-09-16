import { useState, useEffect } from "react";
import Button from "./Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from './Loader';
import "react-toastify/dist/ReactToastify.css";

const Base_Url = import.meta.env.VITE_BASE_URL;

// Define the Meeting type
interface Meeting {
  name: string;
  meeting_id: string;
}

function NewHero() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  // Array of background color gradients
  const backgroundColors = [
    'linear-gradient(150deg, #edfad6 40%, #e0f6f3 60%)',
    'linear-gradient(150deg, #daedf6 40%, #f8e7e9 60%)',
    'linear-gradient(150deg, #ffdfe1 40%, #ffebdb 60%)'
    // Add more gradients if needed
  ];

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Base_Url}/meetings`);
        setMeetings(response.data);
        if (response.data.length > 0) {
          setSelectedMeetingId(response.data[0].meeting_id); // Select the first meeting by default
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      console.log(selectedMeetingId);
      return;
    }
    console.log("Username:", username);
    console.log("Email:", email);

    try {
      const response = await axios.post(`${Base_Url}/users`, {
        username,
        email,
        meeting_id: selectedMeetingId,
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <ToastContainer position="top-center" />
      <div className="row justify-content-around">
        <div className="col-md-6 col-12">
          <p className="bold">
            Try FREE Online <span style={{ color: '#008EBE' }}>group therapy</span>
          </p>
          <p className="heroBold">What would you like help with?</p>
          <div className="heroMeeting">
            {meetings.map((meeting, index) => (
              <button
                key={meeting.meeting_id}
                className="selectButtons"
                style={{
                  background: backgroundColors[index % backgroundColors.length],
                  border: meeting.meeting_id === selectedMeetingId ? '3px solid #008EBE' : 'none',
                }}
                onClick={() => setSelectedMeetingId(meeting.meeting_id)}
              >
                {meeting.name}
              </button>
            ))}
          </div>
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
            <Button text="Try FREE group therapy" onClick={handleSubmit} />
          </div>
          <p className="heroBoldText">
            We will never ask you for more information than this!
          </p>
          <p className="heroBoldText">
            After you sign-up we will send you a link to our therapist waiting room, so that you can get immediate help and relief.
          </p>
          <p className="heroBoldText" style={{ color: '#008EBE' }}>
            You are not alone in your struggle
          </p>
        </div>
        <div className="col-md-6 col-12">
          <div className="row featured">
            <img src="./home-smile.png" className="featuredImg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewHero;
