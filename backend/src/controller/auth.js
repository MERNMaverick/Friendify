import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// LOGGING IN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with email:', email);

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user);

        // Check if the password is correct
        if (!password || !user.password) {
            console.log('Password or user password is undefined');
            return res.status(400).json({ message: 'Invalid password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', user.email);
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Remove the password field from the user object
        const { password: pwd, ...userWithoutPassword } = user.toObject();

        // Send response
        res.json({ token, user: userWithoutPassword });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



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