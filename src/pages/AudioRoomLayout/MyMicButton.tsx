// import {useState} from 'react'
import { useCallStateHooks } from '@stream-io/video-react-sdk';

function MyMicButton() {
    const { useMicrophoneState } = useCallStateHooks();
    const { microphone, isMute } = useMicrophoneState();

  return (
    <div className='bottom-bar'>
      <div className='profilesOne mb-5 audio'>
       {isMute ? <>
              <button className='mute'
              onClick={async () => {
                if (isMute) {
                  await microphone.enable();
                } else {
                  await microphone.disable();
                }
              }}>
            <img src='/mute.png' className='profilePic' />
            </button>
            <div>
            <p>You are muted</p>
            <span>Tap, to join the conversation</span>
            </div>
            </> :
            <>
            <button className='mute'
            onClick={async () => {
                if (isMute) {
                  await microphone.enable();
                } else {
                  await microphone.disable();
                }
              }}>
            <img src='/unmuted_icon.png' className='profilePic' />
            </button>
            <div>
            <p>You are unmuted</p>
            <span>Tap, to mute yourself</span>
            </div>
            </>}
            </div>
    </div>
  )
}

export default MyMicButton
