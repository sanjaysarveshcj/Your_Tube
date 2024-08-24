import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react"
import Navbar from './Component/Navbar/Navbar';
import { useDispatch } from 'react-redux';
import Allroutes from "../src/Allroutes"
import { BrowserRouter as Router } from 'react-router-dom';
import Drawersliderbar from '../src/Component/Leftsidebar/Drawersliderbar'
import Createeditchannel from './Pages/Channel/Createeditchannel';
import Videoupload from './Pages/Videoupload/Videoupload';
import Displayuserpoints from './Pages/UserPoints/UserPoints';
//import VideoCall from './Pages/VideoCall/videocall';
//import Videopage from './Pages/Videopage/Videopage';
import { getUserPoints } from './action/userpoints';
import { fetchallchannel } from './action/channeluser';
import { getallvideo } from './action/video';
import { getallcomment } from './action/comment';
import { getallhistory } from './action/history';
import { getalllikedvideo } from './action/likedvideo';
import { getallwatchlater } from './action/watchlater';
function App() {
  const [toggledrawersidebar, settogledrawersidebar] = useState({
    display: "none"
  })


  const dispatch = useDispatch()

  
  useEffect(() => {
    dispatch(fetchallchannel())
    dispatch(getallvideo())
    dispatch(getallcomment())
    dispatch(getallhistory())
    dispatch(getalllikedvideo())
    dispatch(getallwatchlater())
    dispatch(getUserPoints())
  }, [dispatch])



  const toggledrawer = () => {
    if (toggledrawersidebar.display === "none") {
      settogledrawersidebar({
        display: "flex",
      });
    } else {
      settogledrawersidebar({
        display: "none",
      });
    }
  }
  const [editcreatechanelbtn, seteditcreatechanelbtn] = useState(false);
  const [videouploadpage, setvideouploadpage] = useState(false);
  const [displayUserPoints, dispuserpoints] = useState(false);

  return (
    <Router>
      {
        videouploadpage && <Videoupload setvideouploadpage={setvideouploadpage} />
      }
      {editcreatechanelbtn && (
        <Createeditchannel seteditcreatechanelbtn={seteditcreatechanelbtn} />
      )}
      {displayUserPoints && (
        <Displayuserpoints dispuserpoints={dispuserpoints} />
      )}
      <Navbar seteditcreatechanelbtn={seteditcreatechanelbtn} toggledrawer={toggledrawer} dispuserpoints={dispuserpoints} />
      <Drawersliderbar toggledraw={toggledrawer} toggledrawersidebar={toggledrawersidebar} />
      <Allroutes seteditcreatechanelbtn={seteditcreatechanelbtn} setvideouploadpage={setvideouploadpage}/>
    </Router>
  );
}

export default App;
