import './styles.css'
import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import axiosBaseUrl from '../../Axios/axios'

const socket = io('http://localhost:3001', {
  auth: {
    token: localStorage.getItem('Token')
  }
})

function Chat() {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [userId, setUserId] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const id = localStorage.getItem('UserID')
    if (id) setUserId(Number(id))

    socket.on('chatHistory', (data) => {
      setChatHistory(data)
      scrollToBottom()
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const sendMessage = () => {
    if (message.trim() && userId) {
      socket.emit('message', {
        user_id: userId,
        text: message.trim()
      })
      setMessage('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h2>Live Chat</h2>
        <div className="chat-messages">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.user_id === userId ? 'own' : 'other'}`}>
              <span className="message-user">User {msg.user_id}</span>
              <p>{msg.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Chat
