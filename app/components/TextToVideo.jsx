import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";

// const avatarIds = [
//   "Daisy-inskirt-20220818",
//   "Other-avatar-id-1",
//   "Other-avatar-id-2",
// ];
const avatarStyles = ["normal", "circle"];
const ratios = ["16:9", "9:16"];
const maxCharacterLimit = 500;
const VideoGeneratorForm = () => {
  const [formData, setFormData] = useState({
    background: "#ffffff",
    clips: [
      {
        avatar_id: "",
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
  const [isOpenRatio, setIsOpenRatio] = useState(false);
  
  const [isOpenLanguage, setIsOpenLanguage] = useState(false);
  const [isOpenAvatarStyle, setIsOpenAvatarStyle] = useState(false);

  const [isOpenAvatar, setIsOpenAvatar] = useState(false);

  const [videoId, setVideoId] = useState(null);
  const [videoStatus, setVideoStatus] = useState();
  const [videoUrl, setVideoUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [availableVoices, setAvailableVoices] = useState([]);
  const [allVoices, setAllVoices] = useState([]);
  const [avatarIds, setAvatarIds] = useState([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [avatarGenders, setAvatarGenders] = useState([]);
  useEffect(() => {
    const fetchAvatarIds = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "X-Api-Key": process.env.NEXT_PUBLIC_HEYGEN_API_KEY,
        },
      };
  
      try {
        const response = await fetch('https://api.heygen.com/v1/avatar.list', requestOptions);
        const { data } = await response.json();
        const avatarStates = data.avatars.map((avatar) => avatar.avatar_states);
        const avatarIds = avatarStates.map((states) => states.map((state) => state.id));
        const avatarGenders = avatarStates.map((states) => states.map((state) => state.gender));
        // Flatten the arrays
        const flattenedAvatarIds = avatarIds.flat();
        const flattenedAvatarGenders = avatarGenders.flat();
        setAvatarIds(flattenedAvatarIds);
        setAvatarGenders(flattenedAvatarGenders);
         // Set selectedAvatarId to the first avatar ID
      } catch (error) {
        console.error('Error fetching avatar data:', error);
      }
    };
  
    fetchAvatarIds();
  }, []);
  
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
        handleLanguageChange({ target: { value: "English" } });
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
  const handleAvatarChange = (selectedAvatarId) => {
    setSelectedAvatarId(selectedAvatarId);
    setFormData((prevState) => ({
      ...prevState,
      clips: prevState.clips.map((clip) => ({
        ...clip,
        avatar_id: selectedAvatarId,
      })),
    }));
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
  
      if (response.ok) {
        const { data } = await response.json();
        setVideoId(data.video_id);
      } else {
        const errorResponse = await response.json();
        setErrorMessage(errorResponse.message);

      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while generating the video.");
    }
  };
  
  useEffect(() => {
    let interval; // Declare interval variable outside of the checkVideoStatus function
  
    const checkVideoStatus = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "X-Api-Key": process.env.NEXT_PUBLIC_HEYGEN_API_KEY,
        },
      };
  
      try {
        const response = await fetch(
          `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
          requestOptions
        );
        const { data  ,  message} = await response.json();
  
        if (data.status === "completed"   || ( video_url&&   message   ===  'Success') ) {
          setVideoUrl(data.video_url);
          setVideoStatus();
          clearInterval(interval); // Clear interval when video processing is completed
        } else if (data.status === "failed") {
          setVideoStatus(data.error.detail); // Set videoStatus to the detail value in the response error
          clearInterval(interval); // Clear interval when video processing fails
        }
  
        if (data.status === "pending") {
          setVideoStatus("Processing, This could take up to 2 Mins.");
        }
      } catch (error) {
        console.error("Error checking video status:", error);
        setErrorMessage("An error occurred while checking the video status.");
      }
    };
  
    if (videoId && (videoStatus === undefined || videoStatus === "pending")) {
      checkVideoStatus(); // Call checkVideoStatus when videoId changes or videoStatus is pending
      interval = setInterval(checkVideoStatus, 2000); // Assign interval to the declared variable
    }
  
    return () => clearInterval(interval); // Clear interval on component unmount or when dependencies change
  }, [videoId, videoStatus]);




const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;

    setSelectedLanguage(selectedLanguage);
    const languageVoices = allVoices.filter(
      (voice) => voice.language === selectedLanguage
    );
    console.log(allVoices);
    setAvailableVoices(languageVoices); // Update available voices for the selected language
    const defaultVoiceId =
      languageVoices.length > 0 ? languageVoices[0].voice_id : "";
    setFormData((prevState) => ({
      ...prevState,
      clips: prevState.clips.map((clip) => ({
        ...clip,
        voice_id: defaultVoiceId,
      })),
    }));
  };
  useEffect(() => {
    const defaultLanguage = "English"; // Set the default language
    const defaultLanguageVoices = allVoices.filter(
      (voice) => voice.language === defaultLanguage
    );
    setAvailableVoices(defaultLanguageVoices);

    const defaultVoiceId =
      defaultLanguageVoices.length > 0 ? defaultLanguageVoices[0].voice_id : "";
    setFormData((prevState) => ({
      ...prevState,
      clips: prevState.clips.map((clip) => ({
        ...clip,
        voice_id: defaultVoiceId,
      })),
    }));
  }, [allVoices]);

  return (
    <div className="container  h-full">
      <div className="flex flex-row justify-between border  border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3">
        <div>
          <h3 className="max-md:mb-3">Settings</h3>
        </div>

        <div className="w-10/12 max-md:w-full">
          <label
            htmlFor="dropdown"
            className="block text-sm font-medium text-gray-700 "
          >
            Ratio
          </label>
          <div className="relative mt-3 mb-8 z-50">
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
              <div className="absolute mt-1  w-full max-max-h-60 overflow-auto rounded-md bg-white shadow-lg">
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
                        handleChange(
                          { target: { value: ratio } },
                          null,
                          "ratio"
                        ); // Update ratio
                        setIsOpenRatio(false);
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

          <div className="relative mt-3 mb-8 z-30">
          <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700 mb-2 ">
          Language
      </label>
            <button
              type="button"
              className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-x-slate-500 sm:text-sm"
              onClick={() => setIsOpenLanguage(!isOpenLanguage)} // Update isOpenLanguage state
            >
              <span className="block truncate">
                {selectedLanguage} {/* Display selected language */}
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
              show={isOpenLanguage}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="absolute mt-1  w-full max-h-60 overflow-auto rounded-md bg-white shadow-lg">
                <ul
                  tabIndex="-1"
                  role="listbox"
                  aria-labelledby="dropdown"
                  aria-activedescendant=""
                  className="py-1 text-base ring-1 ring-black ring-opacity-5 rounded-md shadow-xs"
                >
                  {languages.map((language, index) => (
                    <li
                      key={index}
                      role="option"
                      onClick={() => {
                        handleLanguageChange({ target: { value: language } }); // Update selected language
                        setIsOpenLanguage(false);
                      }}
                      className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100"
                    >
                      <div className="flex items-center">
                        <span className="text-gray-700">{language}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Transition>
          </div>

          {formData.clips.map((clip, index) => (
            <div key={index}>
              <div className="relative mt-3 mb-8 z-20">
              <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700 mb-2 ">
              Avatar
      </label>
      <button
  type="button"
  className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-x-slate-500 sm:text-sm"
  onClick={() => setIsOpenAvatar(!isOpenAvatar)} // Update isOpenAvatar state
>
  <span className="block truncate">
    {selectedAvatarId || "Select Avatar"} {/* Display selected Avatar ID or placeholder text */}
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
                  show={isOpenAvatar}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="absolute mt-1  w-full max-h-60 overflow-auto rounded-md bg-white shadow-lg">
                    <ul
                      tabIndex="-1"
                      role="listbox"
                      aria-labelledby="dropdown"
                      aria-activedescendant=""
                      className="py-1 text-base ring-1 ring-black ring-opacity-5 rounded-md shadow-xs"
                    >
{avatarIds.map((id, idx) => (
  <li
    key={idx}
    role="option"
    onClick={() => {
      handleAvatarChange(id);
      setIsOpenAvatar(false);
    }}
    className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100"
  >
    <div className="flex items-center">
      <span className="text-gray-700">{id}</span>
    </div>
  </li>
))}

                    </ul>
                  </div>
                </Transition>
              </div>
              <div className="relative mt-3 mb-8 z-10">
              <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700 mb-2 ">
              AvatarStyle
      </label>
                <button
                  type="button"
                  className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-x-slate-500 sm:text-sm"
                  onClick={() => setIsOpenAvatarStyle(!isOpenAvatarStyle)} // Update isOpenAvatarStyle state
                >
                  <span className="block truncate">
                    {clip.avatar_style} {/* Display selected Avatar Style */}
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
                  show={isOpenAvatarStyle}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="absolute mt-1  w-full max-h-60 overflow-auto rounded-md bg-white shadow-lg">
                    <ul
                      tabIndex="-1"
                      role="listbox"
                      aria-labelledby="dropdown"
                      aria-activedescendant=""
                      className="py-1 text-base ring-1 ring-black ring-opacity-5 rounded-md shadow-xs"
                    >
                      {avatarStyles.map((style, idx) => (
                        <li
                          key={idx}
                          role="option"
                          onClick={() => {
                            handleChange(
                              { target: { value: style } },
                              index,
                              "avatar_style"
                            );
                            setIsOpenAvatarStyle(false);
                          }}
                          className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100"
                        >
                          <div className="flex items-center">
                            <span className="text-gray-700">{style}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Transition>
              </div>
              <label
                htmlFor="dropdown"
                className="block text-sm font-medium text-gray-700 "
              >
                Select A Speaker
              </label>
              <div className="relative mt-3 mb-8 ">
                <button
                  type="button"
                  className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-x-slate-500 sm:text-sm"
                  onClick={() => setIsOpenSpeaker(!isOpenSpeaker)}
                >
                  <span className="block truncate">
                    {
                      availableVoices.find(
                        (option) =>
                          option.voice_id === formData.clips[index].voice_id
                      )?.display_name
                    }
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
                  <div className="absolute mt-1 z-10 w-full max-h-60 overflow-auto rounded-md bg-white shadow-lg">
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
                            handleChange(
                              { target: { value: option.voice_id } },
                              index,
                              "voice_id"
                            );
                            setIsOpenSpeaker(false);
                          }}
                          className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100"
                        >
                          <div className="flex items-center">
                            <span className="text-gray-700">
                              {`${option.display_name} - ${
                                option.gender
                              }, ${option.labels.join(", ")}`}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Transition>
              </div>
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
              <div className="w-full mb-2">
              <div className="relative mt-3 mb-8  mr-1 w-full">
                Background Color
                <input
                  type="color"
                  value={formData.background}
                  onChange={(e) => handleChange(e, null, "background")} // Update background color
                  className="relative mx-1 top-1 "
                />
              </div>
              <label>
                Scale: {Math.round(clip.scale * 100)}%
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.01}
                  value={clip.scale}
                  onChange={(e) => handleChange(e, index, "scale")}
                  className="w-full m-auto appearance-none h-1 bg-gray-200 rounded-full focus:outline-none"
                />
              </label>
              </div>
  
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

      <div className="flex flex-row justify-between  border rounded-bl-xl  rounded-br-xl border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3">
        <div>
          <h3 className="max-md:mb-3">Result</h3>
        </div>
        <div className="w-10/12 max-md:w-full">
          {videoUrl &&  (
            <video controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {errorMessage && (
            <div>
              <p>Error: {errorMessage}</p>
              <p>Please try again later.</p>
            </div>
          )}
          {videoStatus &&  !errorMessage && (
            <p>Video status: {videoStatus}</p>
          )}
          <button
            onClick={handleSubmit}
            className="bg-slate-800 w-full text-white px-4 py-2 rounded-md cursor-pointer mt-4"
          >
            Generate Video (Water Marked)
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoGeneratorForm;
