import React, { useEffect,useState } from 'react'
import "./Videopage.css"
import moment from 'moment'
import Likewatchlatersavebtns from './Likewatchlatersavebtns'
import { useParams, Link } from 'react-router-dom'
import Comment from '../../Component/Comment/Comment'
// import vidd from "../../Component/Video/vid.mp4"
import { viewvideo } from '../../action/video'
import { addtohistory } from '../../action/history'
import { useSelector,useDispatch } from 'react-redux'
import VideoPlayer from '../../Component/Videoplayer/videoplayer'
const Videopage = () => {
    const { vid } = useParams();
    //console.log(vid)
    const dispatch=useDispatch()
    const vids=useSelector((state)=>state.videoreducer)
    const currentuser = useSelector(state => state.currentuserreducer)


    
    // const vids = [
    //     {
    //         _id: 1,
    //         video_src: vidd,
    //         chanel: "wvjwenfj3njfwef",
    //         title: "video 1",
    //         uploader: "abc",
    //         description: "description of video 1"
    //     },
    //     {
    //         _id: 1,
    //         video_src: vidd,
    //         chanel: "wvjwenfj3njfwef",
    //         title: "video 1",
    //         uploader: "abc",
    //         description: "description of video 1"
    //     },
    //     {
    //         _id: 2,
    //         video_src: vidd,
    //         chanel: "wvjwenfj3njfwef",
    //         title: "video 2",
    //         uploader: "abc",
    //         description: "description of video 2"
    //     },
    //     {
    //         _id: 3,
    //         video_src: vidd,
    //         chanel: "wvjwenfj3njfwef",
    //         title: "video 3",
    //         uploader: "abc",
    //         description: "description of video 3"
    //     },
    //     {
    //         _id: 4,
    //         video_src: vidd,
    //         chanel: "wvjwenfj3njfwef",
    //         title: "video 4",
    //         uploader: "abc",
    //         description: "description of video 4"
    //     },
    // ]
    // console.log( vids)
    
   
    const handleviews=()=>{
        dispatch(viewvideo({id:vid}))
    }
    const handlehistory=()=>{
        console.log( vid );
        dispatch(addtohistory({
            videoid:vid,
            viewer:currentuser?.result._id,
        }))
    }

    useEffect(()=>{
        if(currentuser && vid){
            handlehistory();
        }
        handleviews();
    },[currentuser,vid])

    

    const vv = vids?.data.filter((q) => q._id === vid)[0]
    

    const handleShowComments = () => {
        document.querySelector('.comments_VideoPage').scrollIntoView({ behavior: 'smooth' });
    }

    const handleNextVideo = () => {
        const currentIndex = vids?.data.findIndex((video) => video._id === vid);
        const nextIndex = (currentIndex + 1) % vids?.data.length;
        const nextVideo = vids?.data[nextIndex];
        window.location.href = `/videopage/${nextVideo._id}`;
    };
    return (
        <>
            <div className="container_videoPage">
                <div className="container2_videoPage">
                    <div className="video_display_screen_videoPage">
                        <VideoPlayer src={`http://localhost:5000/${vv?.filepath}`} className="video_ShowVideo_videoPage" onShowComments={handleShowComments} onNextVideo={handleNextVideo} /> 
                        <div className="video_details_videoPage">
                            <div className="video_btns_title_VideoPage_cont">
                                <p className="video_title_VideoPage">{vv?.title}</p>
                                <div className="views_date_btns_VideoPage">
                                    <div className="views_videoPage">
                                        {vv?.views} views <div className="dot"></div>{" "}
                                        {moment(vv?.createdat).fromNow()}
                                    </div>
                                    <Likewatchlatersavebtns vv={vv} vid={vid} />
                                </div>
                            </div>
                            <Link to={'/'} className='chanel_details_videoPage'>
                                <b className="chanel_logo_videoPage">
                                    <p>{vv?.uploader.charAt(0).toUpperCase()}</p>
                                </b>
                                <p className="chanel_name_videoPage">{vv?.uploader}</p>
                            </Link>
                            <div className="comments_VideoPage">
                                <h2>
                                    <u>Comments</u>
                                </h2>
                                <Comment videoid={vv?._id}/>
                            </div>
                        </div>
                    </div>
                    <div className="moreVideoBar">More videos</div>
                </div>
            </div>
        </>
    )
}

export default Videopage

