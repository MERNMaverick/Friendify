import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

// REGISTER USER

export const register = async (req,res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            location,
            friends,
            occupation,
            viewedProfile,
            impressions
        } = req.body;

        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);

        const newUser = new User ({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picturePath,
            location,
            friends,
            occupation,
            viewedProfile,
            impressions
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
