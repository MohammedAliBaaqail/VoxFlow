"use client";
import React, { useState } from "react";
import { UploadButton ,UploadDropzone } from "../utils/uploadthing";
import { postTranscribeUrl } from "../api/transcribeUrl";

const SpeechToText = () => {
    const [data, setData] = useState();
    const [transcriptionResult, setTranscriptionResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
  
  
  
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
    <div className="container  h-3/4">

        <div className="flex flex-row justify-between border-gray-200 p-8 bg-[#fcfcfc]">
            <div><h3>Source</h3></div>
    <div className="w-10/12">
      
 
      <UploadDropzone
      endpoint="audioUploader"
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
  )
}

export default SpeechToText