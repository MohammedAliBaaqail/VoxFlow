"use client";
import { useState } from "react";
import TextToSpeech from "./components/TextToSpeech";
import SpeechToText from "./components/SpeechToText";

const Home = () => {
  const [activeTab, setActiveTab] = useState("textToSpeech");

  return (
    <main className="p-4 h-screen flex flex-col justify-center items-center min-h-screen ">
      <div className="flex justify-between w-full space-x-4  border rounded-t-xl   border-gray-200 p-8 bg-[#fcfcfc]">
        <div><h3>Task</h3></div>
        <div className="flex  justify-around w-10/12">
        <button
          className={`py-2 px-4 rounded ${
            activeTab === "textToSpeech"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("textToSpeech")}
        >
          Text To Speech
        </button>
        <button
          className={`py-2 px-4 rounded ${
            activeTab === "speechToText"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("speechToText")}
        >
          Speech To Text
        </button>
        </div>
      </div>
      {activeTab === "textToSpeech" && <TextToSpeech />}
      {activeTab === "speechToText" && <SpeechToText />}
    </main>
  );
};

export default Home;
