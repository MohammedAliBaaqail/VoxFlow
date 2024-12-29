"use client";
import { useState } from "react";
import TextToSpeech from "./components/TextToSpeech";
import SpeechToText from "./components/SpeechToText";
import TextToVideo from "./components/TextToVideo"; 

const Home = () => {
  const [activeTab, setActiveTab] = useState("textToSpeech");

  return (
    <main className="container my-8  flex flex-col justify-start items-center min-h-screen">
      <div className="flex justify-between w-full border rounded-t-xl border-gray-200  bg-[#fcfcfc] max-md:flex-col ">
        {/* <div><h3>Task</h3></div> */}
        <div className="flex justify-around w-full  max-md:flex-col max-md:w-full max-md:items-center">
          <div
            className={`flex  justify-center items-center cursor-pointer py-2 px-4 w-full h-14 rounded-tl  ${
              activeTab === "textToSpeech"
                ? "bg-gray-900 "
                : "bg-gray-200 "
            }`}
            onClick={() => setActiveTab("textToSpeech")}
          >

                  <h3 className={`text-center ${activeTab === "textToSpeech"
                ? " text-white"
                : " text-gray-700" }`}>Text To Speech</h3>
            
          </div>
          <div
            className={`flex justify-center items-center cursor-pointer py-2 px-4 w-full h-14  ${
              activeTab === "speechToText"
                ? "bg-gray-900 "
                : "bg-gray-200 "
            }`}
            onClick={() => setActiveTab("speechToText")}
          >
            <h3 className={`text-center ${activeTab === "speechToText"
                ? " text-white"
                : " text-gray-700" }`}>Speech To Text</h3>
            
          </div>
          {/* <div
            className={` flex justify-center items-center cursor-pointer py-2 px-4 w-full h-14 rounded-tr m ${
              activeTab === "TextToVideo"
                ? "bg-gray-900 "
                : "bg-gray-200 "
            }`}
            onClick={() => setActiveTab("TextToVideo")}
          >

                       <h3 className={`text-center ${activeTab === "TextToVideo"
                ? " text-white"
                : " text-gray-700" }`}>Text To Video</h3>
            
          </div>  */}
        </div>
      </div>

      <div className={activeTab !== "textToSpeech" ? "hidden" : "container h-3/4"}>
        <TextToSpeech />
      </div>
      <div className={activeTab !== "speechToText" ? "hidden" : "container h-3/4"}>
        <SpeechToText />
      </div>
      {/* <div className={activeTab !== "TextToVideo" ? "hidden" : "container h-3/4"}>
        <TextToVideo />
      </div> */}
    </main>
  );
};

export default Home;
