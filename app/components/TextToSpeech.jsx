import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TextToSpeech = ({ textToAudio }) => {
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState('');

  const handleTextToSpeech = async () => {
    try {
      setIsLoading(true);
      const url = 'https://api.elevenlabs.io/v1/text-to-speech/tWY0WHMWfyHymOO3STD2'; // Replace <voice-id> with the desired voice ID
      const xiApiKey = '551611176ee83c1f4a43887c5c90fea0'; // Replace <xi-api-key> with your Xi API key

      const headers = {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': xiApiKey,
      };

      const data = {
        text: textToAudio,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      };

      const response = await axios.post(url, data, { headers, responseType: 'arraybuffer' });

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (err) {
      console.error('Error while performing text-to-speech:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  return (
    <div>
      <button
      className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-4
      ' onClick={handleTextToSpeech} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Generate'}
      </button>
      {audioUrl && <audio controls ref={audioRef} />}
    </div>
  );
};

export default TextToSpeech;