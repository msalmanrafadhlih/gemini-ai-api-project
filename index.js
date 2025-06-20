const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const upload = multer({ dest: 'uploads/' });

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: fs.readFileSync(filePath).toString("base64"),
            mimeType
        },
    };
}

// ENDPOINT/GENERATE-TEXT - PART 1
app.post('/generate-text', async (req, res) => { 
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({
            output: response.text()
        });
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while generating content.',
            details: error.message
        });
    }
});


// ENDPOINT/GENERATE-FROM-IMAGE - PART 2

app.post('/generate-from-file', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'File is required.' });
    }
    const prompt = req.body.prompt || 'Describe the image';
    const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);

    try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        res.json({
            output: response.text()
        });
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while generating content from file.',
            details: error.message
        });
    } finally {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Error deleting temp file:', err);
                }
            });
        }
    }
});

// ENDPOINT/GENERATE-FROM-DOCUMENT - PART 3

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Document file is required.' });
    }
    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const base64Data = buffer.toString('base64');
    const mimeType = req.file.mimetype;

    try {
        const documentPart = {
            inlineData: { data: base64Data, mimeType } 
        };

        const result = await model.generateContent(['Analyse the document', documentPart]);
        const response = await result.response;
        res.json({
            output: response.text()
        });
    }   catch (error) {
        res.status(500).json({
            error: 'An error occurred while generating content from document.',
            details: error.message
        });
    }   
    finally {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Error deleting temp file:', err);
                }
            });
        }
    }
});

// ENDPOINT/GENERATE-FROM-AUDIO - PART 4

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Audio file is required.' });
    }
    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const base64Data = buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const prompt = req.body.prompt || 'Transcribe or analyze this audio';

    try {
        const audioPart = {
            inlineData: { data: base64Data, mimeType }
        };

        const result = await model.generateContent([prompt, audioPart]);
        const response = await result.response;
        res.json({
            output: response.text()
        });
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while generating content from audio.',
            details: error.message
        });
    } finally {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Error deleting temp file:', err);
                }
            });
        }
    }
});
