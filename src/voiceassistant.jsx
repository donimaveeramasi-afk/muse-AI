
import { useState } from "react";
import "./VoiceAssistant.css";

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "Muse",
      text: "Hi! I'm Muse, your voice assistant. How can I help you?",
    },
  ]);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const sendMessage = (message) => {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;

    setMessages((previous) => [
      ...previous,
      { sender: "You", text: cleanMessage },
    ]);

    const response =
      "I heard you say: " +
      cleanMessage +
      ". I'm here to help you!";

    setMessages((previous) => [
      ...previous,
      { sender: "Muse", text: response },
    ]);

    speak(response);
    setUserText("");
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessages((previous) => [
        ...previous,
        {
          sender: "Muse",
          text: "Voice recognition is unavailable. Please try Google Chrome.",
        },
      ]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const spokenMessage = event.results[0][0].transcript;
      sendMessage(spokenMessage);
    };

    recognition.onerror = () => {
      setListening(false);
      setMessages((previous) => [
        ...previous,
        {
          sender: "Muse",
          text: "I couldn't hear you clearly. Please try again.",
        },
      ]);
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
    }
  };

  return (
    <section className="voice-assistant">
      <div className="voice-header">
        <div className="muse-avatar">M</div>
        <div>
          <h2>Muse AI</h2>
          <p>Your Voice Assistant</p>
        </div>
      </div>

      <div className="voice-chat">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`voice-message ${
              message.sender === "You" ? "user-message" : "muse-message"
            }`}
          >
            <strong>{message.sender}</strong>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="voice-controls">
        <input
          type="text"
          value={userText}
          onChange={(event) => setUserText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage(userText);
          }}
          placeholder="Type your message..."
        />

        <button onClick={() => sendMessage(userText)}>
          Send
        </button>

        <button onClick={startListening} disabled={listening}>
          {listening ? "Listening..." : "🎙️ Speak"}
        </button>
      </div>
    </section>
  );
}
