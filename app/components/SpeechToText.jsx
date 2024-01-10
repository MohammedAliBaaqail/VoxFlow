"use client";
import React, { useState,useEffect } from "react";
import {  createClient } from "@deepgram/sdk";
import { UploadButton, UploadDropzone } from "../utils/uploadthing";
import useDeepgram from '../api/useDeepgram'; 
import { postTranscribeUrl } from "../api/transcribeUrl";
const deepgram = createClient('8cc9ccf3f80180c38daa46a82dabb942237689a6');
const SpeechToText = () => {
  const [data, setData] = useState();
  const [transcriptionResult, setTranscriptionResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranscriptionClick = async () => {
    if (data && data[0]?.serverData?.file?.url) {
       
        const audioUrl = data[0]?.serverData?.file?.url; // Replace with the actual audio URL
        const result = await useDeepgram(audioUrl);
  
        if (result !== null) {
          // Do something with the transcribed data
          console.log("Transcription result:", result);
          setTranscriptionResult(result?.results.channels[0].alternatives[0].paragraphs.transcript);
        } else {
          // Handle the error case
          console.error("Error occurred during transcription");
        }
            
        
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const audioUrl = 'YOUR_AUDIO_URL_HERE'; // Replace with the actual audio URL
      const result = await useDeepgram(audioUrl);

      if (result !== null) {
        // Do something with the transcribed data
        console.log("Transcription result:", result);
      } else {
        // Handle the error case
        console.error("Error occurred during transcription");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container  h-full ">
      <div className="flex flex-row justify-between  border border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3">
        <div>
          <h3 className="max-md:mb-3">Source</h3>
        </div>
        <div className="w-10/12 max-md:w-full">
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

      <div className="flex flex-row justify-between  border border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3">
        <div>
          <h3     className="max-md:mb-3">Audio</h3>
        </div>
     
        {data? (
          <div className="w-10/12 max-md:w-full">
            <audio controls className="w-full">
              <source src={data[0]?.serverData?.file?.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="w-full flex justify-between px-4 mt-2 ">
              <span> {data && data[0].serverData?.file?.name}</span>

              <span>
                {" "}
                {data &&
                  (data[0].serverData?.file?.size * 0.00000095367).toFixed(
                    2
                  )}{" "}
                MB
              </span>
            </div>
            <button
              onClick={handleTranscriptionClick}
              disabled={!data || isLoading}
              className="bg-gray-900 w-full my-8 text-white px-4 py-2 rounded-md cursor-pointer"
            >
              {isLoading ? "Loading..." : "Transcribe"}
            </button>

          </div>
        ): <p className="w-10/12 text-center my-auto max-md:w-full">Not Uploaded</p>}
        
      </div>
      
      <div className="flex flex-row justify-between  border border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3">
              <div>
                <h3    className="max-md:mb-3">Result</h3>
              </div>

             
                {transcriptionResult ? (
                     <div className="w-10/12 max-md:w-full">
                  <p className="border p-2  w-full min-h-24 overflow-auto">
                    {transcriptionResult}
                  </p>
                  </div>
                ): <p className="w-10/12 text-center my-auto max-md:w-full">Not Available</p>}
              
            </div>
    </div>
  );
};

export default SpeechToText;
