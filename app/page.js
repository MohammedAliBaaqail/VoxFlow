"use client";
import React, { useState } from "react";
import { UploadButton } from "./utils/uploadthing";
import { postTranscribeUrl } from "./api/transcribeUrl";
import TextToSpeech from "./components/TextToSpeech";
import SpeechToText from "./components/SpeechToText";

import SubscriptionInfo from "./api/subscriptionInfo ";

const Home = () => {


  return (
    <main className="p-4 flex flex-col justify-center items-center  min-h-screen">
      

      <SpeechToText />

      <TextToSpeech />
    </main>
  );
};

export default Home;
