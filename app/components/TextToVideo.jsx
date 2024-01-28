import React, { useState, useEffect } from "react";
import { Transition } from '@headlessui/react';
const presets = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff"];
const avatarIds = [
  "Daisy-inskirt-20220818",
  "Other-avatar-id-1",
  "Other-avatar-id-2",
];
const avatarStyles = ["normal", "style1", "style2"];
const ratios = ["16:9", "9:16"];
const maxCharacterLimit = 500;
const VideoGeneratorForm = () => {
  const [formData, setFormData] = useState({
    background: "#ffffff",
    clips: [
      {
        avatar_id: avatarIds[0],
        avatar_style: avatarStyles[0],
        input_text: "",
        offset: { x: 0, y: 0 },
        scale: 0.5,
        voice_id: "",
      },
    ],
    ratio: ratios[0],
    version: "v1alpha",
  });
  const [isOpenSpeaker, setIsOpenSpeaker] = useState(false);
  const [isOpenRatio , setIsOpenRatio] = useState(false);

  const [isOpenAvatar, setIsOpenAvatar] = useState(false);

  const [videoId, setVideoId] = useState(null);
  const [videoStatus, setVideoStatus] = useState("pending");
  const [videoUrl, setVideoUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [availableVoices, setAvailableVoices] = useState([]);
  const [allVoices, setAllVoices] = useState([]);

 useEffect(() => {
  const fetchVoices = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.NEXT_PUBLIC_HEYGEN_API_KEY,
      },
    };

    try {
      const response = await fetch(
        "https://api.heygen.com/v1/voice.list",
        requestOptions
      );
      const { data } = await response.json();
      setAllVoices(data.list); // Update allVoices state with fetched voices
      const languagesList = data.list.reduce((acc, curr) => {
        if (!acc.includes(curr.language)) {
          acc.push(curr.language);
        }
        return acc;
      }, []);
      const sortedLanguagesList = languagesList.sort();
      setLanguages(sortedLanguagesList);
      handleLanguageChange({ target: { value: 'English' } });
    } catch (error) {
      console.error("Error fetching voices:", error);
    }
  };

  fetchVoices();
}, []);


  useEffect(() => {
    const languageVoices = availableVoices.filter(
      (voice) => voice.language === selectedLanguage
    );
    setFormData((prevState) => ({
      ...prevState,
      clips: prevState.clips.map((clip) => ({
        ...clip,
        voice_id: languageVoices.length > 0 ? languageVoices[0].voice_id : "",
      })),
    }));
  }, [selectedLanguage, availableVoices]);

  const handleChange = (e, index, field) => {
    const { name, value } = e.target;
    
    // Check if name is defined before accessing its properties
    if (name && name.startsWith("offset")) {
      const axis = name.split("_")[1];
      const updatedClips = [...formData.clips];
      updatedClips[index].offset[axis] = parseFloat(value);
      setFormData((prevState) => ({
        ...prevState,
        clips: updatedClips,
      }));
    } else if (
      field === "input_text" ||
      field.includes("avatar") ||
      field === "voice_id" ||
      field === "scale"
    ) {
      const updatedClips = [...formData.clips];
      updatedClips[index][field] = value;
      setFormData((prevState) => ({
        ...prevState,
        clips: updatedClips,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.NEXT_PUBLIC_HEYGEN_API_KEY,
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch(
        "https://api.heygen.com/v1/video.generate",
        requestOptions
      );
      const { data } = await response.json();
      setVideoId(data.video_id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    console.log(selectedLanguage)
    setSelectedLanguage(selectedLanguage);
    const languageVoices = allVoices.filter(
      (voice) => voice.language === selectedLanguage
    );
    console.log(allVoices)
    setAvailableVoices(languageVoices); // Update available voices for the selected language
    const defaultVoiceId = languageVoices.length > 0 ? languageVoices[0].voice_id : "";
    setFormData((prevState) => ({
      ...prevState,
      clips: prevState.clips.map((clip) => ({
        ...clip,
        voice_id: defaultVoiceId,
      })),
    }));
  };
  useEffect(() => {
    const defaultLanguage = 'English'; // Set the default language
    const defaultLanguageVoices = allVoices.filter(
      (voice) => voice.language === defaultLanguage
    );
    setAvailableVoices(defaultLanguageVoices);
    
    const defaultVoiceId = defaultLanguageVoices.length > 0 ? defaultLanguageVoices[0].voice_id : "";
    setFormData((prevState) => ({
      ...prevState,
      clips: prevState.clips.map((clip) => ({
        ...clip,
        voice_id: defaultVoiceId,
      })),
    }));
  }, [allVoices]);
console.log(formData)
return (
    <div className="container  h-full">
      <div className="flex flex-row justify-between border  border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3">
        <div>
          <h3 className="max-md:mb-3">Settings</h3>
        </div>

        <div className="w-10/12 max-md:w-full">
        <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700 ">
        Ratio
      </label>
        <div className="relative mt-3 mb-8">
  <button
    type="button"
    className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-x-slate-500 sm:text-sm"
    onClick={() => setIsOpenRatio(!isOpenRatio)} // Update isOpenRatio state
  >
    <span className="block truncate">
      {formData.ratio} {/* Display selected ratio */}
    </span>
    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
      <svg
        className="w-5 h-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M6 8l4 4 4-4"
          clipRule="evenodd"
        />
      </svg>
    </span>
  </button>
  <Transition
    show={isOpenRatio}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <div className="absolute mt-1 w-full max-h-60 overflow-auto rounded-md bg-white shadow-lg">
      <ul
        tabIndex="-1"
        role="listbox"
        aria-labelledby="dropdown"
        aria-activedescendant=""
        className="py-1 text-base ring-1 ring-black ring-opacity-5 rounded-md shadow-xs"
      >
        {ratios.map((ratio, index) => (
          <li
            key={index}
            role="option"
            onClick={() => {
              handleChange({ target: { value: ratio } }, null, "ratio"); // Update ratio
              setIsOpenRatio(false); // Close the dropdown menu
            }}
            className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100"
          >
            <div className="flex items-center">
              <span className="text-gray-700">{ratio}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </Transition>
</div>
          <br />
          <label key="background">
            Background:
            <select
              name="background"
              value={formData.background}
              onChange={(e) => handleChange(e, null, "background")}
            >
              {presets.map((color, index) => (
                <option key={index} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Language:
            <select
              name="language"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {languages.map((language, index) => (
                <option key={index} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
          <br />
          {formData.clips.map((clip, index) => (
            <div key={index}>
              <label>
                Avatar ID:
                <select
                  name={`avatar_id_${index}`}
                  value={clip.avatar_id}
                  onChange={(e) => handleChange(e, index, "avatar_id")}
                >
                  {avatarIds.map((id, idx) => (
                    <option key={idx} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <label>
                Avatar Style:
                <select
                  name={`avatar_style_${index}`}
                  value={clip.avatar_style}
                  onChange={(e) => handleChange(e, index, "avatar_style")}
                >
                  {avatarStyles.map((style, idx) => (
                    <option key={idx} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <label>
                Offset:
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min={-0.5}
                    max={0.5}
                    step={0.01}
                    value={clip.offset.x}
                    onChange={(e) => handleChange(e, index, "offset_x")}
                    name={`offset_x_${index}`}
                    className="w-3/4 appearance-none h-1 bg-gray-200 rounded-full focus:outline-none"
                  />
                  <span>X: {clip.offset.x}</span>
                  <input
                    type="range"
                    min={-0.5}
                    max={0.5}
                    step={0.01}
                    value={clip.offset.y}
                    onChange={(e) => handleChange(e, index, "offset_y")}
                    name={`offset_y_${index}`}
                    className="w-3/4 appearance-none h-1 bg-gray-200 rounded-full focus:outline-none"
                  />
                  <span>Y: {clip.offset.y}</span>
                </div>
              </label>
              <br />
              <label>
                Scale: {Math.round(clip.scale * 100)}%
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.01}
                  value={clip.scale}
                  onChange={(e) => handleChange(e, index, "scale")}
                  className="w-3/4 appearance-none h-1 bg-gray-200 rounded-full focus:outline-none"
                />
              </label>
              <br />
              <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700 ">
        Select A Speaker
      </label>
              <div className="relative mt-3 mb-8">
                <button
                  type="button"
                  className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-x-slate-500 sm:text-sm"
                  onClick={() => setIsOpenSpeaker(!isOpenSpeaker)}
                >
                  <span className="block truncate">
                    {availableVoices.find((option) => option.voice_id === formData.clips[index].voice_id)?.display_name}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 8l4 4 4-4"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>
                <Transition
                  show={isOpenSpeaker}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="absolute mt-1 w-full max-h-60 overflow-auto rounded-md bg-white shadow-lg">
                    <ul
                      tabIndex="-1"
                      role="listbox"
                      aria-labelledby="dropdown"
                      aria-activedescendant=""
                      className="py-1 text-base ring-1 ring-black ring-opacity-5 rounded-md shadow-xs"
                    >
                      {availableVoices.map((option, idx) => (
                        <li
                          key={option.voice_id}
                          role="option"
                          onClick={() => {
                            handleChange({ target: { value: option.voice_id } }, index, "voice_id");
                            setIsOpenSpeaker(false);
                          }}
                          className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100"
                        >
                          <div className="flex items-center">
                            <span className="text-gray-700">
                              {`${option.display_name} - ${option.gender}, ${option.labels.join(", ")}`}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Transition>
              </div>
              <br />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-between border  border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3">
        <div>
          <h3 className="max-md:mb-3">Text</h3>
        </div>
        <div className="w-10/12 max-md:w-full">
          <textarea
            required={true}
            name="input_text"
            value={formData.clips[0].input_text}
            onChange={(e) => handleChange(e, 0, "input_text")}
            maxLength={maxCharacterLimit}
            className="border overflow-auto resize-none p-2 w-full h-[125px] mb-4 block  text-base bg-white rounded-md border-gray-300 shadow-sm focus:border-gray-200 focus:ring-gray-200"
          />
        </div>
      </div>

      <div className="flex flex-row justify-between border  border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3">
        <div>
          <h3 className="max-md:mb-3">Result</h3>
        </div>
        <div className="w-10/12 max-md:w-full">
          {videoUrl && videoStatus === "completed" && (
            <video controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {errorMessage && (
            <div>
              <p>Error: {errorMessage}</p>
              <p>Please try again.</p>
            </div>
          )}
          {videoStatus !== "completed" && !errorMessage && (
            <p>Video status: {videoStatus}</p>
          )}
          <button
            onClick={handleSubmit}
            className="bg-slate-800 w-full text-white px-4 py-2 rounded-md cursor-pointer mt-4"
          >
            Generate Video
          </button>
        </div>
      </div>
    </div>
  );

};

export default VideoGeneratorForm;