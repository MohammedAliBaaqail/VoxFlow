const postTranscribeUrl = async (url) => {
  try {
    const response = await fetch('http://localhost:3000/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error while transcribing URL:', err);
    throw err;
  }
};

export { postTranscribeUrl };