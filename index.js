import express from "express"
import mongoose from "mongoose";

import { registerValidator, loginValidator, postCreateValidator } from "./validations.js"

import checkAuth from './utils/checkAuth.js'

import * as userController from './controllers/userController.js';
import * as postController from './controllers/postController.js';

mongoose.connect('mongodb+srv://admin:180801Ak@cluster0.wrfph.mongodb.net/blog')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB err', err));

const app = express();
app.use(express.json());

app.post('/auth/login', loginValidator, userController.login);
app.post('/auth/register', registerValidator, userController.register);
app.get('/auth/me', checkAuth, userController.getMe);

app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreateValidator, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id',  postController.update);

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Server OK')
});
