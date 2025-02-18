import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      // Add simulated AI response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { text: "This is a simulated response", sender: "bot" }
        ]);
      }, 1000);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend();
      e.preventDefault();
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div className="header">
          <h1>ChatPHS</h1>
        </div>
      </div>
      
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-content">
                {msg.sender === 'bot' && <div className="avatar">AI</div>}
                <div className="text">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter Message..."
            />
            <button onClick={handleSend} className="send-button">
              ➢
            </button>
          </div>
          <div className="disclaimer">
          ChatPHS is a simulated chat application. Do not enter any personal information.
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;