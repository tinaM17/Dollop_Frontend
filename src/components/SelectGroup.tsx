import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import axios from 'axios';
import Loader from './Loader';
const Base_Url = import.meta.env.VITE_BASE_URL

// Define the Meeting type
interface Meeting {
  name: string;
  meeting_id: string;
}

function SelectGroup() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`${Base_Url}/meetings`);
        setMeetings(response.data);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
      finally {
        setLoading(false); // End loading
      }
    };

    fetchMeetings();
  }, []);


  const handleButtonClick = (meeting: Meeting) => {
    navigate(`/select-group/${meeting.meeting_id}/${meeting.name.toLowerCase()}`);
  };

   // Conditional rendering based on loading state
   if (loading) {
    return (
      <Loader />
    );
  }


  return (
    <div className="container">
      <div className="row justify-content-around">
        <div className="col-md-12 pt-4">
          {/* <p>Select a group to start - </p> */}
          <p className='heroBold'>What would you like help with?</p>
          <div className='d-flex gap-3'>
            {meetings?.map((meeting) => (
              <Button 
               className='pt-3 pb-3 boldText'
                key={meeting.meeting_id} 
                text={meeting.name} 
                onClick={() => handleButtonClick(meeting)} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectGroup;
