"use client";
import React, { useState } from "react";
import { UploadButton, UploadDropzone } from "../utils/uploadthing";
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
    <div className="container  h-full ">
      <div className="flex flex-row justify-between  border border-gray-200 p-8 bg-[#fcfcfc]">
        <div>
          <h3>Source</h3>
        </div>
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

      <div className="flex flex-row justify-between  border border-gray-200 p-8 bg-[#fcfcfc] ">
        <div>
          <h3>Audio</h3>
        </div>

        {data? (
          <div className="w-10/12">
            <audio controls className="w-full">
              <source src={data[0]?.serverData?.file?.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="w-full flex justify-between px-4 mt-2 ">
              <spen> {data && data[0].serverData?.file?.name}</spen>

              <spen>
                {" "}
                {data &&
                  (data[0].serverData?.file?.size * 0.00000095367).toFixed(
                    2
                  )}{" "}
                MB
              </spen>
            </div>
            <button
              onClick={handleTranscriptionClick}
              disabled={!data || isLoading}
              className="bg-gray-900 w-full my-8 text-white px-4 py-2 rounded-md cursor-pointer"
            >
              {isLoading ? "Loading..." : "Transcribe"}
            </button>

          </div>
        ): <p className="w-10/12 text-center my-auto">Not Uploaded</p>}
        
      </div>
      
      <div className="flex flex-row justify-between  border border-gray-200 p-8 bg-[#fcfcfc] ">
              <div>
                <h3>Result</h3>
              </div>

             
                {transcriptionResult ? (
                     <div className="w-10/12">
                  <p className="border p-2  w-full min-h-24 overflow-auto">
                    {transcriptionResult}
                  </p>
                  </div>
                ): <p className="w-10/12 text-center my-auto">Not Available</p>}
              
            </div>
    </div>
  );
};

export default SpeechToText;
