// Packages used are defined here
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import authRoutes from './routes/auth.js'
import { register } from './controller/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { verifyToken } from './middleware/auth.js'
import { createPost } from './controller/posts.js'

// CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// INITIALIZING EXPRESS APP
const app = express()

// MIDDLEWARE
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common')); // Ensure Morgan is used


// Load environment variables from .env file
dotenv.config()


// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
}
);

const upload = multer({ storage})


// ROUTES WITH UPLOAD MIDDLEWARE
app.post('/auth/register', upload.single("picture"), register);
app.post('/posts', verifyToken, upload.single("picture"), createPost);

// ROUTES 
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/posts', postRoutes)
app.get('/test', (req, res) => {
  res.send('Test route is working');
});

// ENVIRONMENT VARIABLES
const port = process.env.PORT || 4000;

// DATABASE CONNECTION CONFIGURATION
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((error) => {
    console.log(`Connection failed: ${error.message}`)
  })