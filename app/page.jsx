"use client";
import { useState } from "react";
import TextToSpeech from "./components/TextToSpeech";
import SpeechToText from "./components/SpeechToText";



const Home = () => {
  const [activeTab, setActiveTab] = useState("textToSpeech");

  return (
    <main className=" container p-4  flex flex-col justify-start items-center min-h-screen ">
      <div className="flex  justify-between w-full   border rounded-t-xl   border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3">
        <div><h3>Task</h3></div>
        <div className="flex  justify-around w-10/12 max-md:flex-col max-md:w-full max-md:items-center">
        <button
          className={`py-2 px-4 rounded max-md:w-2/3 max-md:my-2 my-auto ${
            activeTab === "textToSpeech"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("textToSpeech")}
        >
          Text To Speech
        </button>
        <button
          className={`py-2 px-4 rounded max-md:w-2/3 max-md:my-2 my-auto ${
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

      <div className={activeTab !== "textToSpeech" ? "hidden" : "container  h-3/4"}>
        <TextToSpeech />
      </div>
      <div className={activeTab !== "speechToText" ? "hidden" : "container  h-3/4"}>
        <SpeechToText />
      </div>


      {/* <div className="relative flex w-screen max-w-screen-lg place-items-center before:pointer-events-none after:pointer-events-none before:absolute before:right-0 after:right-1/4 before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Microphone />
      </div> */}

    </main>
  );
};

export default Home;
