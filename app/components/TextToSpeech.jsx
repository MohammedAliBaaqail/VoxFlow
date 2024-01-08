import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [textToSpeech, setTextToSpeech] = useState('');
  const [customStability, setCustomStability] = useState(0.5);
  const [customSimilarity, setCustomSimilarity] = useState(0.5);
  const [quota, setQuota] = useState(0);
  const maxCharacterLimit = 500;
  const elevenlabsApiKey = process.env.NEXT_PUBLIC_ELEVENLABS_KEY;

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

      const url = 'https://api.elevenlabs.io/v1/text-to-speech/tWY0WHMWfyHymOO3STD2'; // Replace <voice-id> with the desired voice ID
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
    <div>
      <h1 className="text-3xl font-bold mb-5">Text to Speech</h1>
      <div className="flex flex-col w-3/4 mb-4">
          <label htmlFor="customStability" className="text-gray-600 mb-2">
            Custom Stability: {Math.round(customStability * 100)}%
          </label>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.01}
            value={customStability}
            onChange={(e) => setCustomStability(parseFloat(e.target.value))}
            id="customStability"
            className="w-full"
          />
          <label htmlFor="customSimilarity" className="text-gray-600 mb-2 mt-4">
            Custom Similarity: {Math.round(customSimilarity * 100)}%
          </label>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.01}
            value={customSimilarity}
            onChange={(e) => setCustomSimilarity(parseFloat(e.target.value))}
            id="customSimilarity"
            className="w-full"
          />
        </div>
      <textarea
        value={textToSpeech}
        onChange={handleTextareaChange}
        placeholder="Enter text..."
        className="border p-2 w-full mb-4"
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
        className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-4"
        onClick={handleTextToSpeech}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Text-to-Speech'}
      </button>

      {audioUrl && <audio controls ref={audioRef} />}
    </div>
  );
};

export default TextToSpeech;
