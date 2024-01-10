import { createClient } from "@deepgram/sdk";

const useDeepgram = async (url) => {
  try {
    const deepgramClient = createClient('8cc9ccf3f80180c38daa46a82dabb942237689a6');
    
    console.log(url);
    const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrl(
      {
        url,
      },
      {
        smart_format: true,
        model: "nova-2",
      }
    );

    if (error) throw error;

    const data = JSON.parse(result);
    return data;
  } catch (err) {
    console.error("Error while transcribing:", err.message);
    return null;
  }
};

export default useDeepgram;
