import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ParticipantLayout from "../layouts/ParticipantLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

const ParticipantChat = () => {

  // const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Load history
  useEffect(() => {
    fetch("http://localhost:8001/api/chat/history/", {
      credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
      const formatted = data.map(msg => ({
        role: msg.message_role,
        text: msg.message_text,
        timestamp: msg.timestamp
      }));
      setChat(formatted);
    });
  }, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {

    if (!message.trim() || loading) return;

    const userMsg = {
      role: "user",
      text: message,
      timestamp: new Date()
    };

    setChat(prev => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8001/api/chat/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify({ message })
        }
      );

      const data = await res.json();

      const aiMsg = {
        role: "assistant",
        text: data.reply,
        timestamp: new Date()
      };

      setChat(prev => [...prev, aiMsg]);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // Enter to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ParticipantLayout>

      <div className="card p-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Reflection Chat</h4>

          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Back
          </button>
        </div>

        {/* Chat Box */}
        <div
          className="border rounded p-3 mb-3 bg-light"
          style={{ height: "500px", overflowY: "auto" }}
        >
          {chat.map((c, i) => (
            <div
              key={i}
              className={`d-flex mb-2 ${
                c.role === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-3 rounded shadow-sm ${
                  c.role === "user"
                    ? "bg-success text-white"
                    : "bg-white"
                }`}
                style={{ maxWidth: "70%" }}
              >
                <div>{c.text}</div>
                <div
                  className={`small mt-1 ${
                    c.role === "user"
                      ? "text-white-50 text-end"
                      : "text-muted text-end"
                  }`}
                >
                  {formatTime(c.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* AI Typing Indicator */}
          {loading && (
            <div className="d-flex justify-content-start mb-2">
              <div className="p-3 bg-white rounded shadow-sm">
                <Spinner animation="border" size="sm" />
                <span className="ms-2 text-muted">AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input */}
        <div className="d-flex gap-2">
          <input
            className="form-control"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your reflection..."
            disabled={loading}
          />

          <button
            className="btn btn-success"
            onClick={sendMessage}
            disabled={loading}
          >
            Send
          </button>
        </div>

      </div>

    </ParticipantLayout>
  );
};

export default ParticipantChat;