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

// CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// INITIALIZING EXPRESS APP
const app = express()

// MIDDLEWARE
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))
app.use(cors());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))


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
app.post('auth/register', upload.single("picture"), register)

// ROUTES 
app.use('/auth', authRoutes)
// ENVIRONMENT VARIABLES
const PORT = process.env.PORT || 5000;

// DATABASE CONNECTION CONFIGURATION
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.log(`Connection failed: ${error.message}`)
  })