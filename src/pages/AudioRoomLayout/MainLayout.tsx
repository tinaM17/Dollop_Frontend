import { useState, useEffect } from "react";
import Header from "../../components/Header";
import MyParticipantsPanel from "./MyParticipantsPanel";
import { useParams, useNavigate } from 'react-router-dom';
import MyMicButton from "./MyMicButton";
import { useCallStateHooks, useCall } from "@stream-io/video-react-sdk";
import moment from "moment-timezone";

const timeZone = import.meta.env.VITE_TIME_ZONE;

interface MeetingDetails {
  meeting_id: string;
  time: string;
  date: Date;
  callId: string;
}

interface MainLayoutProps {
  title: string | undefined;
  meeting_details: MeetingDetails | undefined;
}

function MainLayout({ title, meeting_details }: MainLayoutProps) {
  const { useParticipants } = useCallStateHooks();
  const { meeting_details_id } = useParams();
  const participants = useParticipants();
  const [remainingTime, setRemainingTime] = useState<{ minutes: number; seconds: number }>({ minutes: 0, seconds: 0 });
  const navigate = useNavigate();
  const call = useCall();

  useEffect(() => {
    if (meeting_details?.time) {
      const calculateRemainingTime = async () => {
        const now = moment().tz(timeZone);
        const meetingStartTime = moment.tz(`${meeting_details.date} ${meeting_details.time}`, 'YYYY-MM-DD HH:mm', timeZone);
        const meetingEndTime = meetingStartTime.clone().add(1, 'hour'); // Assuming meeting duration is 1 hour

        if (now.isAfter(meetingEndTime)) {
          setRemainingTime({ minutes: 0, seconds: 0 });
          if (call) {
            await call.endCall();
            setTimeout(() => {
              navigate(`/waiting-room/${meeting_details_id}/join`);
            }, 1000);
          } else {
            console.error("Call object not available"); // Or handle it gracefully
          }
        } else {
          const duration = moment.duration(meetingEndTime.diff(now));
          const minutes = Math.floor(duration.asMinutes());
          const seconds = duration.seconds();
          setRemainingTime({ minutes, seconds });
        }
      };

      calculateRemainingTime();
      const intervalId = setInterval(calculateRemainingTime, 1000); // Update every second

      return () => clearInterval(intervalId);
    }
  }, [meeting_details, call, navigate, meeting_details_id]);

  return (
    <div className="main-content">
      <Header isAudioRoom={true} />
      <div className="container center">
        <div className="row justify-content-center">
          <div className="col-md-6 col-12">
            <div className="header">
              <p className="title">{title}</p>
              <span className="gray">Group Chat</span>
            </div>
          </div>
          <div className="col-md-6 col-12 listen">
            <img src="/listeners_icon.png" alt="listeners" />
            <p>{participants.length} listening</p>
          </div>
        </div>
        <div className="row justify-content-center slider">
          <div className="col-12">
            <p className="fs-5 textP">
              <span className="gray">Part 1/3 </span> Introductions
            </p>
            <img src="/time_icon.png" className="timeLeft" alt="Time icon" />
            <span className="session-timer timeDetails">
              {remainingTime.minutes} minutes {remainingTime.seconds} seconds left
            </span>
            <p className="smallText">
              Say hello, or just listen in! No need to go too in-depth, we will do
              that in the next part{" "}
            </p>
            <p className="smallTextGray">Next part: Personal experiences</p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 profiles">
            <MyParticipantsPanel />
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="container center">
          <div className="row justify-content-center">
            <div className="col-12">
              <MyMicButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
