import React, { useState, useEffect } from 'react';
import axios from 'axios';

 const SubscriptionInfo = () => {
  const [quotaInfo, setQuotaInfo] = useState(null);
  const elevenlabsApiKey = process.env.NEXT_PUBLIC_ELEVENLABS_KEY
  useEffect(() => {
    const fetchQuotaInfo = async () => {
      try {
        const response = await axios.get('https://api.elevenlabs.io/v1/user/subscription', {
          headers: {
            'xi-api-key': elevenlabsApiKey
          }
        });
        
        setQuotaInfo(response.data);
      } catch (error) {
        console.error('Error fetching subscription info:', error);
      }
    };

    fetchQuotaInfo();
  }, []);

  return {quotaInfo}
};


export default SubscriptionInfo