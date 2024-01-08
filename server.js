const express = require("express");
const { createClient } = require("@deepgram/sdk");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const deepgramApiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

// Create a route to transcribe the audio file from a URL
app.post("/transcribe", async (req, res) => {
  try {
    const deepgram = createClient(deepgramApiKey);

    const { url } = req.body;
    console.log(url);
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      {
        url,
      },
      {
        smart_format: true,
        model: "nova-2",
      }
    );

    if (error) throw error;

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Express server is running on http://localhost:3000");
});
