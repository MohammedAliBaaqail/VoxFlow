"use client";

import TextToSpeech from "./components/TextToSpeech";
import SpeechToText from "./components/SpeechToText";

const Home = () => {
  return (
    <main className="p-4 flex flex-col justify-center items-center  min-h-screen">
      <SpeechToText />

      <TextToSpeech />
    </main>
  );
};

export default Home;
