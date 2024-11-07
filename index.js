import express from "express"
import mongoose from "mongoose";
import multer from "multer"

import { registerValidator, loginValidator, postCreateValidator } from "./validations.js"

import checkAuth from './utils/checkAuth.js'

import * as userController from './controllers/userController.js';
import * as postController from './controllers/postController.js';
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose.connect('mongodb+srv://admin:180801Ak@cluster0.wrfph.mongodb.net/blog')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB err', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidator, handleValidationErrors, userController.login);
app.post('/auth/register', registerValidator, handleValidationErrors, userController.register);
app.get('/auth/me', checkAuth, userController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', postController.update);

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Server OK')
});
