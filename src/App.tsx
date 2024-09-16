
import './App.css'
import Home from './pages/Home'
import { Routes, Route} from "react-router-dom";
import Register from './pages/Register';
import WaitingRoom from './pages/WaitingRoom';
import AudioRoom from './pages/AudioRoom';
import Resources from './pages/Resources';
import UserPref from './pages/UserPref';
import NewHome from './pages/NewHome';

function App() {

  return (
    <Routes>
        <Route path="/" element= {<NewHome/>}></Route>
        <Route path="/anxietypromo" element= {<Home />}>
        </Route>
        <Route path="/select-group/:id/:type" element= {<Register />}>
        </Route>
        <Route path="/waiting-room/:meeting_details_id/:user_id/join" element= {<WaitingRoom />}>
        </Route>
        <Route path="/audio-room/:meeting_id/:meeting_details_id" element= {<AudioRoom />}>
        </Route>
        <Route path="/resources" element= {<Resources />}>
        </Route>
        <Route path="/user-preferences/:user_id" element= {<UserPref />}>
        </Route>
    </Routes>
  )
}

export default App
