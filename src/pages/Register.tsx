import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useParams } from "react-router-dom";
import { getTimeUntilNextMeeting,formatMeetingTime } from "../utils/timeUtils";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

const Base_Url = import.meta.env.VITE_BASE_URL;

interface Meeting {
  name: string;
  meeting_id: string;
  time: string;
}

function Register() {
  // Extract meeting ID and type from URL parameters
  const { id, type } = useParams<{ id: string; type: string }>();
  const [meeting, setMeeting] = useState<Meeting>();
  const [countdown, setCountdown] = useState<{
    hours: number;
    minutes: number;
  }>({ hours: 0, minutes: 0 });
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // const [date, setDate] = useState(new Date());

  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchMeetingById = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`${Base_Url}/meetings/${id}`);
        setMeeting(response.data);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchMeetingById();
  }, [id]);

  useEffect(() => {
    if (meeting?.time) {
      const updateCountdown = () => {
        setCountdown(getTimeUntilNextMeeting(meeting.time));
      };

      updateCountdown();
      const intervalId = setInterval(updateCountdown, 60000); // Update every minute

      return () => clearInterval(intervalId);
    }
  }, [meeting?.time]);

  // useEffect(() => {
  //   if (meeting?.time) {
  //     const now = new Date();
  //     const meetingTime = parseMeetingTime(meeting.time);

  //     // Check if the countdown is less than 30 minutes and the meeting is scheduled for tomorrow
  //     if (
  //       meetingTime.getHours() <= now.getHours() ||
  //       (countdown.hours == 0 && countdown.minutes <= 15)
  //     ) {
  //       console.log(now);

  //       // Check if it's past midnight (after 12:00 AM)
  //       const tomorrow = new Date();
  //       tomorrow.setDate(tomorrow.getDate() + 1);
  //       console.log(tomorrow);

  //       setDate(tomorrow); // Allow registration for tomorrow's session
  //       console.log(date);
  //     } else {
  //       //    meetingTime.setHours(0, 0, 0, 0); // Set time to midnight
  //       setDate(meetingTime); // Allow registration for the scheduled meeting date
  //     }
  //   }
  // }, [countdown, meeting?.time]);

  // Function to parse meeting time into a Date object
  // const parseMeetingTime = (timeString: any) => {
  //   const [time, period] = timeString.split(" ");
  //   let [hours, minutes] = time.split(":");
  //   hours = parseInt(hours);
  //   minutes = parseInt(minutes);

  //   // Adjust hours for PM time
  //   if (period === "PM" && hours !== 12) {
  //     hours += 12;
  //   } else if (period === "AM" && hours === 12) {
  //     // Adjust hours for 12:00 AM (midnight)
  //     hours = 0;
  //   }

  //   const meetingTime = new Date();
  //   meetingTime.setHours(hours, minutes, 0, 0);

  //   return meetingTime;
  // };

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
        "meeting_id": id,
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

  // Provide a default value or handle undefined type
  const topic = type ? type : "Unknown";

  // Conditional rendering based on loading state
  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="container">
      <Header isAudioRoom={false} />
      <div className="container">
        <ToastContainer position="top-center" />
        <div className="header">
          <h1 className="title">
            {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </h1>
        </div>
        <div className="subHeader">
          <h4>
            Next group therapy session in{" "}
            <span className="timeDetails reg">
              {countdown.hours} Hours {countdown.minutes} Minutes
            </span>
          </h4>
        </div>
        <div className="details">
          <p>
            Our group therapy session with limited spaces starts everyday at{" "}
            {meeting ? formatMeetingTime(meeting.time) : ""}
          </p>
          <p className="timeDetails">We would love you to join our session!</p>
        </div>
        <div className="register d-flex flex-column gap-2">
          <p className="note">
            <span>Note: </span>We will never require more personal information
            than your first name and email!
          </p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Please enter your email"
            className="registerBox"
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="First Name"
            className="registerBox"
          />
        </div>
        <div className="mt-4 invite">
          <Button text="Send my invite" onClick={handleSubmit} />
        </div>

        <div className="subFooter">
          <p>
            <span>This service is FREE and completely anonymous, </span>we need
            your email to send your invite to this session. Your email will be
            hidden to other members and only used for our messaging.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
