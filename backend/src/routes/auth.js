import express from 'express';
import { login } from '../controller/auth.js';

const router = express.router();

router.post('/login', login);

export default router;