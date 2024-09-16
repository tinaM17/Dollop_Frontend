
import { useState, useEffect } from 'react';
import { useLocation,useParams } from 'react-router-dom';
import { StreamVideoClient, User, StreamCall, StreamVideo, Call, CallingState } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import MainLayout from './AudioRoomLayout/MainLayout';
import axios from 'axios';
import Loader from '../components/Loader'; // Import the Loader component

const Base_Url = import.meta.env.VITE_BASE_URL


interface MeetingDetails {
  meeting_id: string;
  time: string;
  date: Date;
  callId: string
}
interface Meeting {
  name: string;
}


function AudioRoom() {
  const location = useLocation();
  const {meeting_id,meeting_details_id} = useParams();
  const { username, userId, token, callId, apiKey } = location.state || {};
  // console.log(userId);
  // console.log(token);

  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();
  const [meeting_details, set_meeting_details] = useState<MeetingDetails>();
  const [meeting, setMeeting] = useState<Meeting>();
  const [loading, setLoading] = useState(true); // New loading state
  
  useEffect(()=>{
    const fetchMeetingDetailsById = async () => {
      try {
        const response = await axios.get(`${Base_Url}/meeting-details/${meeting_details_id}`);
        set_meeting_details(response.data);
      } catch (error) {
        console.error('Error fetching meeting details:', error);
      }
      finally {
        setLoading(false); // End loading
      }
    };

    fetchMeetingDetailsById();
  },[meeting_details_id])
  
  useEffect(() => {
    if (meeting_id) {
      const fetchMeetingById = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${Base_Url}/meetings/${meeting_id}`);
          setMeeting(response.data);
        } catch (error) {
          console.error('Error fetching meeting:', error);
        }
        finally {
          setLoading(false); // End loading
        }
      };

      fetchMeetingById();
    }
  }, [meeting_details]);

  useEffect(()=>{
    const user: User = {
        id: userId,
        name: username,
        type: 'authenticated',
        image: `https://getstream.io/random_svg/?id=${userId}&name=${username}`,
      };
      const client = new StreamVideoClient({ apiKey, user, token });
      setClient(client);
  
      return () => {
        client.disconnectUser();
        setClient(undefined);
      };
 },[token,userId,username,callId])

//  useEffect(()=>{
//   if (!client) {
//       return;
//     }
//     const call = client.call("audio_room", callId);
//     call.getOrCreate({
//       data: {
//           members: [{ user_id: userId,role:'user' }],
//       }
//     })
//     .then(response => {
//       // Handle the response here
//       console.log('Call created or retrieved successfully:', response);
//   })
//   .catch(error => {
//       // Handle the error here
//       console.error('Error creating or retrieving call:', error);
//   });
//     call.microphone
//       .enable()
//       .catch((err) => {
//         console.error(`Error enabling microphone`, err);
//       })
//       .then(() => {
//         console.log(`Successfully enabled microphone`);
//       });
//     call.updateCallMembers({
//       update_members: [{ user_id: userId, role: 'user' }],
//     })
//     .then((response)=>{
//       console.log(`User added to the call successfully`,response);
//     })
//     .catch(error => {
//       // Handle the error here
//       console.error('Error updating the member:', error);
//   });
//     call
//       .join()
//       .catch((err) => {
//         console.error(`Error joining the call`, err);
//       })
//       .then(() => {
//         console.log(`Successfully joined the call`);
//       });
//       setCall(call);
//     // @ts-expect-error useful for debugging
//     window.call = call;
//     return () => {
//       if (call.state.callingState !== CallingState.LEFT) {
//         call.leave();
//       }
//       setCall(undefined);
//     };
// },[callId, client, userId])

// useEffect(() => {
//   if (client && callId) {
//     const call = client.call('audio_room', callId);
//     call
//       .getOrCreate({
//         data: {
//           members: [{ user_id: userId, role: 'user' }],
//         },
//       })
//       .then((response) => {
//         console.log('Call created or retrieved successfully:', response);
//       })
//       .catch((error) => {
//         console.error('Error creating or retrieving call:', error);
//       });

//     call.microphone
//       .enable()
//       .then(() => {
//         console.log('Successfully enabled microphone');
//       })
//       .catch((err) => {
//         console.error('Error enabling microphone', err);
//       });

//     call
//       .updateCallMembers({
//         update_members: [{ user_id: userId, role: 'user' }],
//       })
//       .then((response) => {
//         console.log('User added to the call successfully', response);
//       })
//       .catch((error) => {
//         console.error('Error updating the member:', error);
//       });

//     call
//       .join()
//       .then(() => {
//         console.log('Successfully joined the call');
//       })
//       .catch((err) => {
//         console.error('Error joining the call', err);
//       });

//     setCall(call);

//     // @ts-expect-error useful for debugging
//     window.call = call;

//     return () => {
//       if (call.state.callingState !== CallingState.LEFT) {
//         call.leave();
//       }
//       setCall(undefined);
//     };
//   }
// }, [client, callId, userId]);

 useEffect(() => {
    const joinCall = async () => {
      if (!client) {
        return;
      }
      const call = client.call("audio_room", callId);
      try {
        await call.getOrCreate({
          data: {
            members: [{ user_id: userId, role: 'user' }],
          },
        });

        await call.microphone.enable();
        console.log('Successfully enabled microphone');

        await call.updateCallMembers({
          update_members: [{ user_id: userId, role: 'user' }],
        });
        console.log('User added to the call successfully');

        await call.join();
        console.log('Successfully joined the call');
      } catch (error) {
        console.error('Error joining the call', error);
      }

      setCall(call);

      // @ts-expect-error useful for debugging
      window.call = call;
    };

    joinCall();
    return () => {
      if (call && call.state.callingState !== CallingState.LEFT) {
        call.leave();
      }
      setCall(undefined);
    };
  }, [callId, client, userId]);

  if (!client || !call) {
    return <Loader />;
  }

  if (loading) {
    return <Loader />;
  }
  return (
    <StreamVideo client={client}>
    <StreamCall call={call}>
    <MainLayout title={meeting?.name} meeting_details={meeting_details} />
  </StreamCall>
  </StreamVideo>
  )
}

export default AudioRoom
