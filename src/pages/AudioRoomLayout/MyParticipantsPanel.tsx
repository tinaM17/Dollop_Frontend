
import { 
    ParticipantsAudio, 
    SfuModels,
    StreamVideoParticipant,
    useCallStateHooks,
  } from '@stream-io/video-react-sdk';
  import { MyParticipant } from './MyParticipant';

function MyParticipantsPanel() {
    const hasAudio = (p: StreamVideoParticipant) => 
        p.publishedTracks.includes(SfuModels.TrackType.AUDIO);
    
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();

    return (
      <div className='profiles'>
        <ParticipantsAudio participants={participants.filter(hasAudio)} />
        <div className='participants-panel' style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap',gap:'10px' }}>
          {participants.map((p) => (
            <MyParticipant participant={p} isSpeaker={hasAudio(p)} key={p.sessionId} />
          ))}
        </div>
      </div>
    )
}

export default MyParticipantsPanel;
