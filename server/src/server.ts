import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initDB, getDB } from './database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve Frontend Static Files
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Ensure upload dir exists
if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
  fs.mkdirSync(path.join(__dirname, '../uploads'));
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function analyzeImage(imagePath: string, mimeType: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const filePart = {
    inlineData: {
      data: fs.readFileSync(imagePath).toString("base64"),
      mimeType
    },
  };

  const prompt = `
    Analyze this food image. Identify the food item(s).
    Estimate calories, protein, carbs, and fats.
    Provide a health analysis and any warnings (allergens, high sugar, etc.).
    
    Return ONLY valid JSON in this format:
    {
      "food_name": "Dish Name",
      "calories": 500,
      "macros": {
        "protein": "20g",
        "carbs": "50g",
        "fats": "10g"
      },
      "analysis": "Detailed health analysis text..."
    }
  `;

  const result = await model.generateContent([prompt, filePart]);
  const response = await result.response;
  const text = response.text();
  
  // Clean markdown if present
  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
}

app.post('/api/scan', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const aiResult = await analyzeImage(req.file.path, req.file.mimetype);
    
    // Save to DB
    const db = getDB();
    const result = await db.run(
      `INSERT INTO scans (image_path, food_name, calories, protein, carbs, fats, analysis) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        `/uploads/${req.file.filename}`,
        aiResult.food_name,
        aiResult.calories,
        aiResult.macros.protein,
        aiResult.macros.carbs,
        aiResult.macros.fats,
        aiResult.analysis
      ]
    );

    res.json({ ...aiResult, id: result.lastID, image_url: `/uploads/${req.file.filename}` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

app.get('/api/history', async (req, res) => {
  const db = getDB();
  const scans = await db.all('SELECT * FROM scans ORDER BY created_at DESC');
  res.json(scans);
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
