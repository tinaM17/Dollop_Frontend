import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Base_Url = import.meta.env.VITE_BASE_URL

interface Meeting {
  name: string;
  meeting_id: string;
}

const Dropdown = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`${Base_Url}/meetings`);
        setMeetings(response.data);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div>
      <div onClick={() => setShowOptions(!showOptions)}>
        <p className='select'>Select Group <span>►</span></p>
      </div>
      {showOptions && (
        <div className='drop'>
          {meetings.map((meeting) => (
            <div key={meeting.meeting_id}>
              <Link to={`/select-group/${meeting.meeting_id}/${meeting.name.toLowerCase()}`}>
                {meeting.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
