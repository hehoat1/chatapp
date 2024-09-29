import "./WebBoxOther.css"
import { useState, useRef, useCallback } from 'react'
import Webcam from "react-webcam"

function OtherWebcamImage() {
  const [img, setImg] = useState(null)
  const webcamRef = useRef(null)
  const [isShowVideo, setIsShowVideo] = useState(false)
  const [go, setGo] = useState('goenabled-o')
  const [buttClass, setButtClass] = useState('disabled-o')
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImg(imageSrc)

  }, {webcamRef})

  const startCam = () => {
    setIsShowVideo(true)
    setButtClass('enabled-o')
    setGo('godisabled-o')
  }

  const stopCam = () => {
    let stream = webcamRef.current.stream
    const tracks = stream.getTracks()
    tracks.forEach(track => track.stop())
    setIsShowVideo(false)
    setButtClass('disabled-o')
    setGo('goenabled-o')
    }
  
return (
                       
  <div className="cont-other">

    {img === null ? (
    <>
     {isShowVideo && <Webcam 
        audio = {true}
        mirrored = {true}
        height = {300}
        width = {400}
        ref = {webcamRef}
        screenshotFormat="image/png"
        className = "webcam-other"
      /> }
    <button className="butt-other" id={go} onClick={startCam}> Show Stream </button>
    <button className="butt-other" id={buttClass} onClick={stopCam}> Hide Stream </button>
    <button className="butt-other" id={buttClass} onClick={capture}> Capture Photo </button>

    </>
  ) : (
    <>
      <img src={img} alt="screenshot" />
      <button className="butt-other" id="retake-other" onClick={ () => setImg(null)}>Retake</button>
    </>  
  )}
  </div>
  )
}

export default OtherWebcamImage;

