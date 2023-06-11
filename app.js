import express from 'express';
import mongoose from 'mongoose';
import { registerValidator, loginValidator, postCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js'
import multer from 'multer';
import { UserController, PostController } from './controllers/index.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    }, filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('DB ready...'))
    .catch((err) => console.log('DB error ' + err));

app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.use('/uploads', express.static('uploads'));
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({ url: `/uploads/${req.file.originalname}` });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, postCreateValidation, PostController.remove);
app.post('/comment/:id', checkAuth, PostController.comment);
app.delete('/comment/:id', checkAuth, PostController.removecomment);

console.log(process.env.PORT);
app.listen(process.env.PORT || 8000, (err) => {
    if (err) return console.log(err)
    console.log('Server ready...')
});