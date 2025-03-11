"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const openai_1 = __importDefault(require("openai")); // Updated import
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
// Middleware to parse JSON and URL-encoded data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files from the "public" folder
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Configure OpenAI with your API key (ensure OPENAI_API_KEY is set in your environment)
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// Endpoint to generate a song
app.post('/generate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { words } = req.body;
    try {
        const prompt = `Create a rhythmic song based on these words: ${words}`;
        const response = yield openai.chat.completions.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating song' });
    }
}));
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
