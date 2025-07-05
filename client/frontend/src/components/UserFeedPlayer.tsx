import { useEffect, useRef } from "react"

const UserFeedPlayer=({stream}:{stream:MediaStream})=>{

    const videoRef=useRef<HTMLVideoElement>(null);

    useEffect(()=>{
        if(videoRef.current && stream){
            videoRef.current.srcObject=stream
        }
    },[stream])
    return (

       <video 
        ref={videoRef}
        style={{width:'300px',height:'200px'}}
        muted={false}
       autoPlay
       />
    )
}

export default UserFeedPlayer