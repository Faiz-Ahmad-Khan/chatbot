import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [reset, setReset] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    let timer;

    if (recording && !reset) {
      timer = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [recording, reset]);

  const startRecording = async () => {
    try {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        await document.body.addEventListener('click', async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) {
                chunksRef.current.push(e.data);
              }
            };

            mediaRecorder.onstop = () => {
              const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
              const audioUrl = URL.createObjectURL(audioBlob);
              audioRef.current.src = audioUrl;
              setReset(true);
            };

            mediaRecorder.start();
            setRecording(true);
          } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Error accessing microphone. Please make sure you have granted the necessary permissions.');
          }
        }, { once: true });
      } else {
        console.error('getUserMedia is not supported in this browser.');
        alert('Audio recording is not supported in this browser.');
      }
    } catch (error) {
      console.error('Error checking microphone support:', error);
      alert('An error occurred while checking microphone support. Please try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setDuration(0);
    }
  };

  const resetRecording = () => {
    setReset(false);
    chunksRef.current = [];
    setRecording(false);
    setDuration(0);
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      <button onClick={startRecording} disabled={recording || reset}>
        {recording ? `Recording... ${duration}s` : 'Start Recording'}
      </button>
      <button onClick={stopRecording} disabled={!recording || reset}>
        Stop Recording
      </button>
      {reset && (
        <div>
          <button onClick={resetRecording}>
            Reset
          </button>
        </div>
      )}
      <audio ref={audioRef} controls />
    </div>
  );
};

export default AudioRecorder;
