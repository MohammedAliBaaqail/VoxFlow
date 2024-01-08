"use client";
import React, { useState } from "react";
import { UploadButton } from "./utils/uploadthing";
import { postTranscribeUrl } from "./api/transcribeUrl";
import TextToSpeech from "./components/TextToSpeech";

const Home = () => {
  const [data, setData] = useState();
  const [transcriptionResult, setTranscriptionResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState("");

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

  const handleTextToSpeech = () => {
    // Call handleTextToSpeech with the current textToSpeech value
    // Pass the textToSpeech value as a prop to the TextToSpeech component
    setTextToSpeech("");
  };

  return (
    <main className="p-4 flex flex-col justify-center items-center bg-green-100 min-h-screen">
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
        <textarea
          value={textToSpeech}
          onChange={(e) => setTextToSpeech(e.target.value)}
          placeholder="Enter text..."
          className="border p-2 w-full mb-4"
        />
        <TextToSpeech textToAudio={textToSpeech} />
      </div>
    </main>
  );
};

export default Home;
