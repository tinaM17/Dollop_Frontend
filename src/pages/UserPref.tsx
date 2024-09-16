import { useState,useEffect } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import { useParams } from "react-router-dom";
import axios from "axios";

const Base_Url = import.meta.env.VITE_BASE_URL;

// Define the Meeting type
interface Meeting {
  name: string;
  meeting_id: string;
}

// Define the User type
interface User {
  username: string;
  email: string;
  meeting_ids: string[];
}

export default function UserPref() {
  const [username, setUsername] = useState("");
  const [user,setUser] = useState<User | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [toggle, setToggle] = useState(false);
  const {user_id} = useParams<{user_id:string}>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Base_Url}/meetings`);
        setMeetings(response.data);
        if (response.data.length > 0) {
      //    setSelectedMeetingId(response.data[0].meeting_id); // Select the first meeting by default
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await axios.get(`${Base_Url}/users/${user_id}`);
        if (response.data) {
          setUser(response.data);
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

  const handleSubmit = () => {
    // Add form submission logic here
    console.log("Form submitted:", { username, toggle });
  };

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="container">
      <Header isAudioRoom={false} />
      <div className="container center">
        <div className="row">
          <div className="col-12">
            <div className="prefHeader">
              <h1 className="heroBold">Your preferences</h1>
            </div>
            <div className="register">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="First Name"
                className="prefBox"
              />
            </div>
            <div className="preferences">
              <p className="prefText">
                Select all the topics you are interested in talking or listening
                about.
              </p>
            </div>
            <div className="mt-4 d-flex gap-2 flex-wrap">
            {meetings.map((meeting) => {
                const isRegistered = user?.meeting_ids?.includes(meeting.meeting_id);
                return (
                  <Button
                    text={meeting.name}
                    key={meeting.meeting_id}
                    className="groups"
                    onClick={handleSubmit}
                    backgroundColor={isRegistered ? "gray" : "#0084b4"}
                  />
                );
              })}
            </div>
            <div className="toggle">
              <div
                className={`toggle-switch ${toggle ? "on" : "off"}`}
                onClick={handleToggle}
              >
                <div className="toggle-button"></div>
              </div>
              <p className="prefText">{toggle ? "Send me email" : "Don't send me email"}</p>
            </div>
            <div className="save-changes mt-4">
              <Button
                text="Save Changes"
                className="groups"
                backgroundColor="#ed070b"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
