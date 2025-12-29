import React, { useState, useRef, useEffect } from "react";
import { MODELS } from "../constants/config.js";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "ar-SA";
}

const InputArea = ({ onSend, disabled }) => {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS.AUTO.id);
  const textareaRef = useRef(null);
  
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef(""); 

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      resetSilenceTimer();
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript + " ";
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInputText(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onend = () => {
      setIsRecording(false);
      clearTimeout(silenceTimerRef.current);
    };

    recognition.onerror = () => setIsRecording(false);
  }, []);

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      if (recognition && isRecording) recognition.stop();
    }, 3000); 
  };

  const handleSend = () => {
    if (inputText.trim() && !disabled) {
      onSend(inputText, selectedModel);
      setInputText("");
      finalTranscriptRef.current = ""; 
      if (isRecording) {
        recognition.stop();
        setIsRecording(false);
      }
    }
  };

  const toggleMic = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
    } else {
      finalTranscriptRef.current = inputText ? inputText.trim() + " " : "";
      recognition.start();
      setIsRecording(true);
      resetSilenceTimer();
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] p-5 sm:pt-2 sm:p-10 z-[1000] bg-light-200 dark:bg-dark-100 shadow-[0_-15px_20px_0px_var(--color-light-200)] dark:shadow-[0_-15px_20px_0px_var(--color-dark-100)]">
      <div className="flex flex-col p-3 bg-light-50 dark:bg-light-800 rounded-3xl">
        <textarea
          ref={textareaRef}
          dir="rtl"
          placeholder={isRecording ? "جاري الاستماع..." : "اكتب هنا..."}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            finalTranscriptRef.current = e.target.value;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows="1"
          className="w-full min-h-[38px] py-2 px-[10px] border-none outline-none resize-none bg-transparent text-light-900 dark:text-dark-900 text-base overflow-y-auto"
        ></textarea>

        <div className="flex justify-between items-center w-full pt-[5px]">
          {!inputText.trim() && !isRecording ? (
            <button
              onClick={toggleMic}
              className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-full hover:bg-light-200 dark:hover:bg-light-700 text-dark-400 dark:text-light-400"
            >
              <i className="fa-solid fa-microphone text-base"></i>
            </button>
          ) : (
            <button
              onClick={isRecording ? toggleMic : handleSend}
              className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full transition-all ${
                isRecording ? "bg-red-500/20 text-red-500 animate-pulse" : "text-dark-400 dark:text-light-400 hover:bg-light-200 dark:hover:bg-light-700"
              }`}
            >
              <i className={`fa-solid ${isRecording ? "fa-stop" : "fa-paper-plane"} text-base`}></i>
            </button>
          )}

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="appearance-none h-10 px-2 rounded-3xl text-md text-center outline-none cursor-pointer text-dark-400 dark:text-light-400 bg-transparent hover:bg-light-200 dark:hover:bg-light-700"
          >
            {Object.values(MODELS).map((model) => (
              <option key={model.id} value={model.id} className="dark:bg-dark-100">
                {model.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default InputArea;