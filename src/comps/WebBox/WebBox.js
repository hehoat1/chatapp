import "./WebBox.css"
import { useState, useRef, useCallback } from 'react'
import Webcam from "react-webcam"

function WebcamImage() {
  const [img, setImg] = useState(null)
  const webcamRef = useRef(null)
  const [isShowVideo, setIsShowVideo] = useState(false)
  const [go, setGo] = useState('enabled')
  const [buttClass, setButtClass] = useState('disabled')
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImg(imageSrc)

  }, {webcamRef})

  const startCam = () => {
    setIsShowVideo(true)
    setButtClass('enabled')
    setGo('godisabled')
  }

  const stopCam = () => {
    let stream = webcamRef.current.stream
    const tracks = stream.getTracks()
    tracks.forEach(track => track.stop())
    setIsShowVideo(false)
    setButtClass('disabled')
    setGo('goenabled')
    }
  
return (
                       
  <div className="cont">

    {img === null ? (
    <>
     {isShowVideo && <Webcam 
        audio = {true}
        mirrored = {true}
        height = {300}
        width = {400}
        ref = {webcamRef}
        screenshotFormat="image/png"
        className = "webcam"
      /> }
    <button className="butt" id={go} onClick={startCam}> Start Camera </button>
    <button className="butt" id={buttClass} onClick={stopCam}> Stop Camera </button>
    <button className="butt" id={buttClass} onClick={capture}> Capture Photo </button>

    </>
  ) : (
    <>
      <img src={img} alt="screenshot" />
      <button className="butt" id="retake" onClick={ () => setImg(null)}>Retake</button>
    </>  
  )}
  </div>
  )
}

export default WebcamImage;
