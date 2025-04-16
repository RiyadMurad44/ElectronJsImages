import './styles.css'
import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { format } from 'date-fns'

let socketInstance = null

function Chat() {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [userId, setUserId] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const id = localStorage.getItem('UserID')
    if (id) {
      setUserId(Number(id))

      if (!socketInstance) {
        socketInstance = io('http://localhost:3001', {
          auth: {
            token: localStorage.getItem('Token')
          }
        })
        console.log('Socket connected')
      }

      const handleChatHistory = (data) => {
        console.log('Received chatHistory:', data)
        const reversedHistory = [...data.data].reverse()
        setChatHistory(reversedHistory)
        scrollToBottom()
      }

      if (socketInstance) {
        socketInstance.on('chatHistory', handleChatHistory)
      }

      return () => {
        if (socketInstance) {
          socketInstance.off('chatHistory', handleChatHistory)
          socketInstance.disconnect()
          socketInstance = null
          console.log('Socket listener removed (component unmounted)')
        }
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const sendMessage = () => {
    if (message.trim() && userId && socketInstance) {
      socketInstance.emit('message', {
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

  const formatTimestamp = (isoDate) => {
    try {
      const date = new Date(isoDate)
      return format(date, 'h:mm a')
    } catch (error) {
      console.error('Error formatting timestamp:', error)
      return ''
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h2 className="chat-header">Live Chat</h2>
        <div className="chat-messages">
          {Array.isArray(chatHistory) && chatHistory.length > 0 ? (
            chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${msg.user_id === userId ? 'own' : 'other'}`}
              >
                <div className="chat-info">
                  <span className="chat-user">{msg.username}</span>
                  <span className="chat-timestamp">{formatTimestamp(msg.created_at)}</span>
                </div>
                <p className="chat-bubble">{msg.message}</p>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-box">
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
