import { Avatar, StreamVideoParticipant } from '@stream-io/video-react-sdk';

export const MyParticipant = ({ participant, isSpeaker }: { participant: StreamVideoParticipant, isSpeaker: boolean }) => {
  // `isSpeaking` information is available on the participant object,
  // and it is automatically detected by our system and updated by our SDK.
  const { isSpeaking } = participant;
  return (
    <div className={`participant ${isSpeaking ? 'speaking' : ''}`}>
      <Avatar imageSrc={participant.image} name={participant.name} style={{borderRadius:'50%',padding:'5px',width:'70px',height:'70px'}} />
      <div className='name' style={{ display: 'flex', alignItems: 'center',justifyContent:'center' }}>
        {isSpeaker && (
          <img src='/speaking_icon.png' alt='Speaking Icon' style={{ marginRight: '5px', width: '20px', height: '20px' }} />
        )}
        {participant.name}
      </div>
    </div>
  );
};
