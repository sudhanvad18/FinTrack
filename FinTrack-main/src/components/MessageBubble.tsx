import '../styles/MessageBubble.css'

function MessageBubble({ role, text }: { role: 'user' | 'bot'; text: string }) {
  const isCode = text.includes('\n') && role === 'bot'

  return (
    <div className={`message-bubble ${role}`}>
      {isCode ? (
        <pre className="code-block">
          <code>{text}</code>
        </pre>
      ) : (
        <p>{text}</p>
      )}
    </div>
  )
}

export default MessageBubble
