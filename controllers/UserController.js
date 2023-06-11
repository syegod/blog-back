import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            username: req.body.username,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hashedPassword
        });
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        const { passwordHash, ...userData } = user._doc;
        return res.json({
            userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Registration failed!' });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Invalid email or password.'
            });
        }

        const { passwordHash, ...userData } = user._doc;
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        res.json({
            userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Registration failed!' });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'No access.' });
    }
};