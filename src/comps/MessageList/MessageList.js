import './MessageList.css'
import "react-chat-elements/dist/main.css"
import ReactTimeAgo from 'react-time-ago'

function MessageList({setMessageArray, messageArray, otherUser, user, time}) {
  //console.log(messageArray)
  
  localStorage.setItem(messageArray, messageArray)
   return (
    <> 
  {messageArray.map((message) => {
    const floatClass = message.position === 'left' ? 'float-left' : 
                       message.position === 'right' ? 'float-right' : '' 
    return (
    <>
    <div className='wrapper'>
    <p id='timePassed'> {message.time} </p>
    <div className={`messageBox ${floatClass}`}> 
    <p id='user'> {message.user} </p>
    <p id='text'> {message.text} </p>
    <ReactTimeAgo id='date' date={message.date} locale="en-US"/>
    </div>
    </div>
    </>
    )} 
    )}
    </> 
)}


export default MessageList
