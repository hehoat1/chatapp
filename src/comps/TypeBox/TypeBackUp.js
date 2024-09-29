import "./TypeBox.css"
import React, { useEffect, useState } from "react"
import io from 'socket.io-client'

const socket = io('http://localhost:2006')

const TypeBox = ({messageArray, setMessageArray, user, otherUser}) => {
  const [flag, setFlag] = useState(false)
  const [randomMessage, setRandomMessage] = useState(null)
  let [oldTime, setOldTime] = useState('')
  const [oldMin, setOldMin] = useState(0)
  const [oldHour, setOldHour] = useState(0)
  let time = ''
  const [nope, setNope] = useState(1)
  
  useEffect(() => {
    fetch('http://localhost:2006/uhh')
    .then((res) => res.json())
    .then((json) => setRandomMessage(json.word))
  }, [flag] )

  useEffect(() => { 
        socket.on('otherMessage', (msg) => {
      setMessageArray((currentArray) => [...currentArray, msg])
    })

    socket.on('message', (msg) => {
      setMessageArray((currentArray) => [...currentArray, msg])
    })
  },[setMessageArray])
  
    function getTime() {
    let date = new Date()
    let hour = date.getHours()
    let min = date.getMinutes()
      if (min < 10) {
    min = '0' + min
    }
    time = (hour + ':' + min)
    console.log('time test:' + time)
    console.log('oldMin test:' + oldMin)
    console.log('min test:' + min)
    console.log('diff test:' + (min-oldMin))
    console.log('oldTime test:' + oldTime)
    if ((min - oldMin >= 5 && oldMin !== 0) || (hour - oldHour >= 1 && oldHour !== 0 && oldMin !== 59)) {
      setOldTime(time)
      setOldMin(min)
      setOldHour(hour)
      console.log ('if')
      setNope(2)
    } else if ( oldTime === time ) {
      setOldTime(time)
      setOldMin(min)
      setOldHour(hour)
      time = ''
      console.log ('equal')
      setNope(2)
    } else if (nope === 1){
      setOldTime(time)
      setOldMin(min)
      setOldHour(hour)
      console.log('???')
      setNope(2)
    } else if ((min - oldMin < 5)){
      time = ''
      console.log('waiting')
    }
    }
    
  function handleSubmit(e) {
    e.preventDefault()
    if (message === '') {
      return null
    } else {
    getTime()

    socket.emit('message', { text: message, date: new Date(), user: user, position: 'left'})
        
    setMessageArray([...messageArray, 
      {text: message, date: new Date(), user: user, position: 'left', time: time, oldTime: oldTime}])

    
    document.getElementsByClassName("input")[0].value=""
    setMessage("")

    setTimeout(() => {
      
    setMessageArray((currentArray) => [...currentArray,
      {text: randomMessage, date: new Date(), user: otherUser, position: 'right'}])

    socket.emit('otherMessage', { text: randomMessage, date: new Date(), user: otherUser, position: 'right'})
    
    setFlag(!flag)
    
    }, Math.floor(Math.random())+1000)

    }
    }

    function deleteLog() {
      setNope(1)
      setOldTime('')
      time = ''
      setMessageArray([])
      
      console.log(messageArray)
    }
    
    const [message, setMessage] = useState()
    return (
    <>
    <button
       className="bye" 
       onClick={deleteLog}
       type="button"
       >clear chat
    </button> 

    <form className="form" onSubmit={handleSubmit}>
      <input
       className="input" 
       value={message} 
       onChange={e => setMessage(e.target.value)} 
      />
    </form>
    </>
    )
}

export default TypeBox
