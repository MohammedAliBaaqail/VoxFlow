"use client";
import React, { useState } from "react";
import { UploadButton } from "./utils/uploadthing";
import { postTranscribeUrl } from "./api/transcribeUrl";
import TextToSpeech from "./components/TextToSpeech";

import SubscriptionInfo from "./api/subscriptionInfo ";

const Home = () => {
  const [data, setData] = useState();
  const [transcriptionResult, setTranscriptionResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const elevenlabsApiKey = process.env.ELEVENLABS_KEY;

  const { quotaInfo } = SubscriptionInfo();
  const handleTranscriptionClick = async () => {
    if (data && data[0]?.serverData?.file?.url) {
      try {
        setIsLoading(true);
        const result = await postTranscribeUrl(data[0]?.serverData?.file?.url);

        setTranscriptionResult(
          result?.results.channels[0].alternatives[0].paragraphs.transcript ||
            ""
        );
      } catch (err) {
        console.error("Error while fetching transcription:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };




  return (
    <main className="p-4 flex flex-col justify-center items-center  min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <h1>Transcribe An Audio File </h1>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setData(res);
              console.log("Files:", res);
              alert("Upload Completed");
            }}
            onUploadError={(error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>

        <div className="mb-4">
          {data && (
            <div>
              <audio controls className="mb-2">
                <source
                  src={data[0]?.serverData?.file?.url}
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
              <div className="mb-1">
                {data && data[0]?.serverData?.file?.name}
              </div>
              <div>{data && data[0]?.serverData?.file?.size}</div>
              <button
                onClick={handleTranscriptionClick}
                disabled={!data || isLoading}
                className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                {isLoading ? "Loading..." : "Transcribe"}
              </button>

              <div className="mt-4">Transcription Result:</div>
              <p className="border p-2">{transcriptionResult}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h1>Text To Speech</h1>
  
 
      </div>
      <div className="container mx-auto">
     
        <TextToSpeech

        />
      </div>
    </main>
  );
};

export default Home;