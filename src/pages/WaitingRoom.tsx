import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from "../components/Button";
import * as changeCase from "change-case";
import moment from "moment-timezone";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {formatMeetingTime} from '../utils/timeUtils'

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const Base_Url = import.meta.env.VITE_BASE_URL;
const timeZone = import.meta.env.VITE_TIME_ZONE;

interface MeetingDetails {
  meeting_id: string;
  time: string;
  date: Date;
  callId: string;
}

interface Meeting {
  name: string;
}

// interface User {
//   username: string;
//   email: string;
// }

function WaitingRoom() {
  const { meeting_details_id, user_id } = useParams<{ meeting_details_id: string, user_id:string }>();
  const [meeting_details, set_meeting_details] = useState<MeetingDetails>();
  const [meeting, setMeeting] = useState<Meeting>();
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number }>({ hours: 0, minutes: 0 });
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [callId, setCallId] = useState('');
  const [error, setError] = useState('');
  const [meetingStatus, setMeetingStatus] = useState<'notStarted' | 'ongoing' | 'ended'>('notStarted');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // New loading state
  // const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchMeetingDetailsById = async () => {
      try {
        const response = await axios.get(`${Base_Url}/meeting-details/${meeting_details_id}`);
        if (response.data) {
          set_meeting_details(response.data);
          setCallId(response.data.callId);
        } else {
          setError('Invalid meeting details ID.');
        }
      } catch (error) {
        console.error('Error fetching meeting details:', error);
        setError('Invalid meeting details ID.');
      }
      finally {
        setLoading(false); // End loading
      }
    };

    fetchMeetingDetailsById();
  }, [meeting_details_id]);

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await axios.get(`${Base_Url}/users/${user_id}`);
        if (response.data) {
          // setUser(response.data);
          setUsername(response.data.username);
        } else {
          setError('Invalid User ID.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Invalid User ID.');
      }
      finally {
        setLoading(false); // End loading
      }
    };

    fetchUserById();
  }, [user_id]);


  useEffect(() => {
    if (meeting_details?.meeting_id) {
      const fetchMeetingById = async () => {
        try {
          setLoading(true); // Start loading
          const response = await axios.get(`${Base_Url}/meetings/${meeting_details.meeting_id}`);
          if (response.data) {
            setMeeting(response.data);
          } else {
            setError('Meeting not found.');
          }
        } catch (error) {
          console.error('Error fetching meeting:', error);
          setError('Meeting not found.');
        }
        finally {
          setLoading(false); // End loading
        }
      };

      fetchMeetingById();
    }
  }, [meeting_details]);

  useEffect(() => {
    if (meeting_details?.time) {
      const updateCountdown = () => {
        const now = moment().tz(timeZone);
        const meetingStartTime = moment.tz(`${meeting_details.date} ${meeting_details.time}`, 'YYYY-MM-DD HH:mm', timeZone);
        const meetingEndTime = meetingStartTime.clone().add(1, 'hour');

        if (now.isBefore(meetingStartTime)) {
          setMeetingStatus('notStarted');
          const duration = moment.duration(meetingStartTime.diff(now));
          setCountdown({ hours: Math.floor(duration.asHours()), minutes: duration.minutes() });
        } else if (now.isBetween(meetingStartTime, meetingEndTime)) {
          setMeetingStatus('ongoing');
          const duration = moment.duration(meetingEndTime.diff(now));
          setCountdown({ hours: Math.floor(duration.asHours()), minutes: duration.minutes() });
        } else {
          setMeetingStatus('ended');
        }
      };

      updateCountdown();
      const intervalId = setInterval(updateCountdown, 60000); // Update every minute

      return () => clearInterval(intervalId);
    }
  }, [meeting_details?.time, meeting_details?.date]);

  useEffect(() => {
    if (userId && token && callId && username) {
      navigate(`/audio-room/${meeting_details?.meeting_id}/${meeting_details_id}`, {
        state: {
          userId,
          username,
          apiKey,
          token,
          callId
        }
      });
    }
  }, [userId, token, callId, username, navigate, meeting_details?.meeting_id, meeting_details_id]);

  const handleSubmit = async () => {
    if (!username) {
      toast.error('Username is mandatory to join the meeting.');
      return;
    }
    const uid = changeCase.kebabCase(username);
    setUserId(uid);
    try {
      const token = await tokenProvider(uid);
      if (!token) {
        return;
      }
      setToken(token);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unexpected error occured');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container">
        <Header isAudioRoom={false} />
        <div className="container center">
          <ToastContainer position="top-center"/>
          <div className="row justify-content-center">
            <div className="col">
              <div className="header">
                <img src="/warning.png" className="logo" />
              </div>
              <div className="waiting">
                <p className="boldText pb-4">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header isAudioRoom={false} />
      <ToastContainer position="top-center"/>
      <div className="container middle">
        <div className="row justify-content-center">
          <div className="col">
            <div className="header">
              <p className="title">{meeting?.name}</p>
              <span className="gray">Chat</span>
            </div>
            <div className="waiting">
              <p className="boldText pb-4">
                Free group therapy starts at{" "}
                <span className="timeDetails">{meeting_details ? formatMeetingTime(meeting_details.time) : ""}</span>
              </p>
              <p>You will automatically join, with the name:</p>
              <div className="wait">
                <input 
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  // placeholder="David" 
                  className="registerBox rounded-2" 
                />
                {meetingStatus === 'ongoing' && 
                  <Button className='joinButton' text="Join" onClick={handleSubmit} />
                } 
              </div>
            </div>
            <div className="subSection">
              {meetingStatus === 'ended' ? (
                <p className="timeDetails" style={{color:'red'}}>The meeting has ended.</p>
              ) : meetingStatus === 'notStarted' ? (
                <>
                  <p className="smallText p-0">Come back to this page in:</p>
                  <p className="timeDetails">{countdown.hours} Hours {countdown.minutes} minutes</p>
                </>
              ) : (
                <p className="smallText pb-2">The meeting is ongoing, please join using the join button.</p>
              )}
              <p className="smallText pb-5">We look forward to hearing from you!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;

const tokenProvider = async (userId: string) => {
  try {
    const response = await axios.get(`${Base_Url}/generate-token`, {
      params: { user_id: userId }
    });
    return response.data.token;
  } catch (error: any) {
    console.error('Error generating token:', error);
    throw error;
  }
};
