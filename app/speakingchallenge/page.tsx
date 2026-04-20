"use client";

import { useState, useRef } from "react";

export default function SpeakingChallenge() {
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(30);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);

  const recognitionRef = useRef(null);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.start();
    setRecording(true);

    // Timer
    let time = 30;
    const interval = setInterval(() => {
      time--;
      setTimer(time);

      if (time === 0) {
        clearInterval(interval);
        stopRecording();
      }
    }, 1000);
  };

  const stopRecording = () => {
    recognitionRef.current.stop();
    setRecording(false);
    sendText();
  };

  const sendText = async () => {
    const res = await fetch("http://localhost:8000/analyze-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: transcript }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">
        🎤 Daily Speaking Challenge
      </h1>

      <p>Describe your day in 30 seconds</p>

      <div className="text-4xl my-4">{timer}s</div>

      {!recording ? (
        <button
          onClick={startRecording}
          className="bg-green-500 px-6 py-2 text-white rounded"
        >
          Start
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-red-500 px-6 py-2 text-white rounded"
        >
          Stop
        </button>
      )}

      {/* Live Transcript */}
      <div className="mt-6 text-left">
        <h2 className="font-bold">Your Speech:</h2>
        <p>{transcript}</p>
      </div>

      {/* Feedback */}
      {result && (
        <div className="mt-6 text-left">
          <h2 className="font-bold">Feedback:</h2>

          <ul>
            {result.tips.map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>

          <p>Words: {result.word_count}</p>
          <p>Filler Words: {result.filler_count}</p>
          <p>Score: {result.score}/10</p>
        </div>
      )}
    </div>
  );
}