// server.ts
import express, { Request, Response } from 'express';
import OpenAI from 'openai'; // Updated import
import path from 'path';

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Configure OpenAI with your API key (ensure OPENAI_API_KEY is set in your environment)
const openai = new OpenAI({ // Updated initialization
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint to generate a song
app.post('/generate', async (req: Request, res: Response) => {
  const { words } = req.body;
  try {
    const prompt = `Create a rhythmic song based on these words: ${words}`;
    const response = await openai.chat.completions.create({ // Updated method
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a creative songwriter who writes rhythmic and catchy songs." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
    });
    
    // Updated response structure
    const song = response.choices[0].message.content;
    res.json({ song });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Error generating song' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});