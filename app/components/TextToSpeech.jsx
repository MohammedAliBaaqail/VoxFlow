import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';



import { Transition } from '@headlessui/react';

const TextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [textToSpeech, setTextToSpeech] = useState('');
  const [customStability, setCustomStability] = useState(0.5);
  const [customSimilarity, setCustomSimilarity] = useState(0.5);
  const [customStyle, setCustomStyle] = useState(0.0);
  const [quota, setQuota] = useState(0);
  const maxCharacterLimit = 500;

  const elevenlabsApiKey = process.env.NEXT_PUBLIC_TTS_KEY;
  const dropdownValues = [
    { label: 'Markus - Mature and Chill', value: 'hWLbKGi1RrAMq01srEWl' },
    { label: 'Noah - Calm', value: 'o21mOUZDeycKuvhWMALT' },
    { label: 'Brian - British', value: 'tWY0WHMWfyHymOO3STD2' },
  ];
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(dropdownValues[0].value);
  
    const handleDropdownChange = (event) => {
      setSelectedValue(event.target.value);
    };

  const fetchQuotaInfo = async () => {
    try {
      const response = await axios.get('https://api.elevenlabs.io/v1/user/subscription', {
        headers: {
          'xi-api-key': elevenlabsApiKey
        }
      });

      const quotaInfo = response.data;
      const remainingQuota = quotaInfo.character_limit - quotaInfo.character_count;
      setQuota(remainingQuota);
    } catch (error) {
      console.error('Error fetching subscription info:', error);
    }
  };

  useEffect(() => {
    fetchQuotaInfo();
  }, []);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  const handleTextToSpeech = async () => {
    try {
      setIsLoading(true);

      const url = `https://api.elevenlabs.io/v1/text-to-speech/${selectedValue}`; // Replace <voice-id> with the desired voice ID
      const xiApiKey = elevenlabsApiKey; // Replace <xi-api-key> with your Xi API key

      const headers = {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': xiApiKey,
      };

      const data = {
        text: textToSpeech,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability:customStability,
          similarity_boost: customSimilarity,
          style :customStyle

        },
      };

      const response = await axios.post(url, data, { headers, responseType: 'arraybuffer' });

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const newAudioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(newAudioUrl);

      // Fetch quota information again after a successful text-to-speech conversion
      fetchQuotaInfo();
    } catch (err) {
      console.error('Error while performing text-to-speech:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextareaChange = (e) => {
    const input = e.target.value.substr(0, maxCharacterLimit);
    setTextToSpeech(input);
  };

  return (
    <div className='container  h-full '>

      <div className='flex flex-row  justify-between border  border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3'>
        <div><h3    className="max-md:mb-3">Settings</h3></div>
        <div className='w-10/12 max-md:w-full'>
      <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700 ">
        Select A Speaker
      </label>
      <div className="relative mt-3 mb-8">
        <button
          type="button"
          className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-x-slate-500 sm:text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block truncate">
            {dropdownValues.find((option) => option.value === selectedValue).label}
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
          show={isOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg">
            <ul
              tabIndex="-1"
              role="listbox"
              aria-labelledby="dropdown"
              aria-activedescendant=""
              className="py-1 text-base ring-1 ring-black ring-opacity-5 rounded-md shadow-xs"
            >
              {dropdownValues.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  onClick={() => {
                    setSelectedValue(option.value);
                    setIsOpen(false);
                  }}
                  className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100"
                >
                  <div className="flex items-center">
                    <span className="text-gray-700">{option.label}</span>
                    {option.value === selectedValue ? (
                      <svg
                        className="w-5 h-5 ml-2 text-blue-500"
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
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Transition>
      </div>
   
     <div className="flex flex-col w-full/4 mb-4">
      
      <label htmlFor="customStability" className="text-gray-600 mb-2">
        Stability {Math.round(customStability * 100)}%
      </label>
      <input
        type="range"
        min={0.0}
        max={1.0}
        step={0.01}
        value={customStability}
        onChange={(e) => setCustomStability(parseFloat(e.target.value))}
        id="customStability"
        className="w-full appearance-none h-1 bg-gray-200 rounded-full focus:outline-none"
      />
      <label htmlFor="customSimilarity" className="text-gray-600 mb-2 mt-4">
        Similarity {Math.round(customSimilarity * 100)}%
      </label>
      <input
        type="range"
        min={0.0}
        max={1.0}
        step={0.01}
        value={customSimilarity}
        onChange={(e) => setCustomSimilarity(parseFloat(e.target.value))}
        id="customSimilarity"
        className="w-full appearance-none h-1 bg-gray-200 rounded-full focus:outline-none"
      />
      <label htmlFor="customStyle" className="text-gray-600 mb-2 mt-4">
        Style Exaggeration {Math.round(customStyle * 100)}%
      </label>
      <input
        type="range"
        min={0.0}
        max={1.0}
        step={0.01}
        value={customStyle}
        onChange={(e) => setCustomStyle(parseFloat(e.target.value))}
        id="customStyle"
        className="w-full appearance-none h-1 bg-gray-200 rounded-full focus:outline-none"
      />
    </div>
    </div>
    </div>
    <div className='flex flex-row justify-between border  border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3'>
      <div><h3    className="max-md:mb-3">Text</h3></div>
      <div className='w-10/12 max-md:w-full'>
      <textarea
        value={textToSpeech}
        onChange={handleTextareaChange}
        placeholder="Enter text..."
        className="border overflow-auto resize-none p-2 w-full h-[125px] mb-4 block  text-base bg-white rounded-md border-gray-300 shadow-sm focus:border-gray-200 focus:ring-gray-200"
        maxLength={maxCharacterLimit}
      />

      <div className="flex flex-row justify-between">
        <p className="text-gray-500">
          Total quota remaining: {quota}
        </p>
        <p className="text-gray-500">
          {textToSpeech.length}/{maxCharacterLimit}
        </p>
      </div>

      <button
        className="bg-slate-800 w-full text-white px-4 py-2 rounded-md cursor-pointer mt-4"
        onClick={handleTextToSpeech}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Generate'}
      </button>

    
      </div>
      </div>
      <div className='flex flex-row justify-between  border rounded-bl-xl  rounded-br-xl border-gray-200 p-8 bg-[#fcfcfc] max-md:flex-col max-md:p-3'>
        <div><h3    className="max-md:mb-3">Result</h3></div>
        <div className='w-10/12   max-md:w-full'>
        {audioUrl ? (<audio controls ref={audioRef} className='w-full' />)
        :<p className="w-10/12 text-center my-auto max-md:w-full">Not Available</p>}
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
