
import "./WebBox.css"
import { useState, useRef, useCallback, useEffect } from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer" 
import io from 'socket.io-client'
import Webcam from "react-webcam"
import { TextField } from "@material-ui/core"
import { TextFields } from "@material-ui/icons"

const socket = io('http://localhost:2006')

function WebcamImage() {
  const [me, setMe] = useState('')
  const [stream, setStream] = useState()
  const [receivingCall, setReceivingCall] = useState(false)
  const [caller, setCaller] = useState('')
  const [callerSignal, setCallerSignal] = useState()
  const [callAccepted, setCallAccepted] = useState(false)
  const [idToCall, setIdToCall] = useState('')
  const [callEnded, setCallEnded] = useState(false)
  const [name, setName] = useState('')
  const webRef = useRef()
  const otherWebRef = useRef()
  const connecRef = useRef()
  
  const [img, setImg] = useState(null)
  const [isShowVideo, setIsShowVideo] = useState(false)
  const [go, setGo] = useState('enabled')
  const [buttClass, setButtClass] = useState('disabled')

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream)=> {
      setStream(stream)
      webRef.current.srcObject = stream
    })
  
    socket.on('me', (id) => {
      setMe(id)
    })

    socket.on('callUser', (data) => {
      setReceivingCall(true)
      setCaller(data.from)
      setName(data.name)
      setCallerSignal(data.signal)
    })
    
  }, [])

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    })

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        name: name
      })
    })

    peer.on('stream', (stream) => {
      otherWebRef.current.srcObject = stream
    })

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })

    connecRef.current = peer
  }

  const answerCall = () => {
    
    setCallAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    })

    peer.on('signal', (data) => {
      socket.emit('answerCall', {signal: data, to: caller})
    })

    peer.on('stream', (stream) => {
      otherWebRef.current.srcObject = stream
    })

    peer.signal(callerSignal)
    connecRef.current = peer
  }

  const leaveCall = () => {
    setCallEnded(true)
    connecRef.current.destroy()
    setButtClass('disabled')
    setGo('goenabled')
  }


  
return (
  <>                  
  <div className="cont">
     <video
        playsInline muted 
        ref = {webRef}
        className = "webcam"
        autoPlay
        style={{ width: "300px" }}
      />
    
  </div>
  <div className='cont-other'>
      {callAccepted && !callEnded ? 
      <video 
        playsInline
        ref = {otherWebRef}
        autoPlay
        style={{ width: '300px' }}
        className = 'webcam-other'
      />:
      null}
  </div>
  <div className='myId'>
    <TextField
      id="filled-basic"
      label="name"
      variant='filled'
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <CopyToClipboard text={me} style={{marginBottom: '2rem'}}>
      <button className='butt'> Copy ID </button>
    </CopyToClipboard>

    <TextField
      id='filled-basic'
      label='ID to Call'
      variant='filled'
      value={idToCall}
      onChange={(e) => setIdToCall(e.target.value)}
    />
    <div className='call-button'>
      {callAccepted && !callEnded ? (
        <button className='butt'> End Call </button>
      ) : (
        <button className='butt' onClick={() => callUser(idToCall)}></button>
      )}
     {idToCall}   
    </div>
  </div>
    {receivingCall && !callAccepted ? (
      <div className='caller'>
      <h1> {name} is calling </h1>
      <button className='butt' onClick={answerCall}>Answer</button>
      </div>
      ) : null}
  </>
  )
}

export default WebcamImage;
