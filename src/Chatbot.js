import React from 'react';
import AudioRecorder from './AudioRecorder';

const Chatbot = () => {
  return (
    <div className="chatbot-container">
      <div className="logo-container">
        <img
          src="https://www.pngitem.com/pimgs/m/500-5006722_voice-recorder-icon-png-png-download-voice-recorder.png"
          alt="App Logo"
          className="app-logo"
        />
      </div>
      <h1>Chatbot</h1>
      <AudioRecorder />
    </div>
  );
};

export default Chatbot;
