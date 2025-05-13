import { useState } from 'react'
import '../styles/chatinput.css' // Make sure file is named exactly like this

function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [input, setInput] = useState('')

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      onSend(input)
      setInput('')
    }
  }

  return (
    <div className="chat-input-wrapper">
      <input
        className="chat-input"
        type="text"
        placeholder="Ask something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
      />
      <button className="send-button" onClick={handleSend}>
        Send
      </button>
    </div>
  )

  function handleSend() {
    if (input.trim()) {
      onSend(input)
      setInput('')
    }
  }
}

export default ChatInput