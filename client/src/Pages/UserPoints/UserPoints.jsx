import React,{useEffect } from 'react'
import './UserPoints.css'
import { useDispatch,useSelector } from 'react-redux';
import { getUserPoints } from '../../action/userpoints.js';
const Displayuserpoints = ({dispuserpoints})=>{
    const dispatch = useDispatch();
    const currentuser=useSelector(state => state.currentuserreducer);
    const points = useSelector(state => state.pointsReducer);

    useEffect(() => {
      if (currentuser?.result._id) {
        dispatch(getUserPoints(currentuser?.result._id))
      }
    }, [currentuser, dispatch]);

    return(
        <div className="container_displaypoints">
            <input type="submit" name='text' value={'X'} className="ibtn_x" onClick={()=>dispuserpoints(false)}/>
            <div className="container2_displaypoints">
                <h1>Watch Points</h1>
                <p>Your Watched Video Points: {points.points}</p>
            </div>

        </div>
    )
}

export default Displayuserpoints;
