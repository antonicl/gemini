import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apikey: process.env.API_KEY });
const gemini_model = 'gemini-2.5-flash';

app.use(express.json());

app.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: gemini_model,
      contents: prompt,
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

app.post('/generate-from-image', upload.single('image'), async (req, res) => {
  const { prompt } = req.body;
  const base64Image = req.file.buffer.toString('base64');

  try {
    const response = await ai.models.generateContent({
      model: gemini_model,
      contents: [
        { text: prompt, type: 'text' },
        {
          inlineData: {
            data: base64Image,
            mimeType: req.file.mimetype
          }
        }
      ]
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
  const { prompt } = req.body;
  const base64Document = req.file.buffer.toString('base64');

  try {
    const response = await ai.models.generateContent({
      model: gemini_model,
      contents: [
        {
          text: prompt ?? 'Tolong buat ringkasan dari dokumen berikut.',
          type: 'text'
        },
        {
          inlineData: {
            data: base64Document,
            mimeType: req.file.mimetype
          }
        }
      ]
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
  const { prompt } = req.body;
  const base64Audio = req.file.buffer.toString('base64');

  try {
    const response = await ai.models.generateContent({
      model: gemini_model,
      contents: [
        {
          text: prompt ?? 'Tolong buatkan transkrip dari rekaman berikut.',
          type: 'text'
        },
        {
          inlineData: {
            data: base64Audio,
            mimeType: req.file.mimetype
          }
        }
      ]
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});