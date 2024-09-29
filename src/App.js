import './App.css'
import TypeBox from './comps/TypeBox/TypeBox.js'
import MessageList from './comps/MessageList/MessageList.js'
import WebBox from './comps/WebBox/WebBox.js'
import WebBoxOther from './comps/WebBox/WebBoxOther.js'
//import Geolocation from './comps/LocBox/LocBox.js'
//import City from './comps/LocBox/City.js'
import React, { useState, useRef } from "react"

function App() {
  const [messageArray, setMessageArray] = useState([])
  const bottomOfList = useRef(null)
  const [user, setUser] = useState('user')
  const [otherUser, setOtherUser] = useState('...')
  if (bottomOfList.current) {
    bottomOfList.current.scrollIntoView({})
    //console.log(bottomOfList.current)
    //console.log({city})
  }

  async function fetchUser() {
    try {
      const response = await fetch('http://localhost:2006/fetchUser')
      const data = await response.json()
      console.log(data.name)
      console.log(user)
      if (data.name !== user) {
        setOtherUser(data.name)
      }
    } catch (error) {
      console.log('error')
    }
  }
  return (
    
    <>
    <div className="TopBar">
      <h1> Chatting with <span id='userText'>{otherUser}</span> </h1>
    </div>
     <div className="wrapper-2">
     <WebBox />
     <WebBoxOther />
     </div>
      <div className="wrapper-1">
      <div className="autoscrollable-container">
        <MessageList
        messageArray={messageArray}
        user={user}
        />
      <div ref={bottomOfList} className='huh'></div> 
      </div>
      <div className="TypeBox">
        <TypeBox
         messageArray={messageArray}
         setMessageArray={setMessageArray}
         user={user}
         />
      </div>
      </div>
      <div className='wrapper-3'>
      <div className="userPrompt">
      <input 
      id='prompt-box'
      value={user}
      onChange={e => setUser(e.target.value)}
      />
    </div>
    <div className="otherUserPrompt">
      <button
      className='butt'
      value={otherUser}
      onClick={() => fetchUser()}> Fetch UserName </button>
    </div>
    </div>
    </>
  )
}

export default App
