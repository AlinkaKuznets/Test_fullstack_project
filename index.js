import express from "express"
import mongoose from "mongoose";

import { registerValidator } from "./validations/auth.js"

import checkAuth from './utils/checkAuth.js'

import * as userController from './controllers/userController.js';

mongoose.connect('mongodb+srv://admin:180801Ak@cluster0.wrfph.mongodb.net/blog')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB err', err));

const app = express();
app.use(express.json());

app.post('/auth/login', userController.login);
app.post('/auth/register', registerValidator, userController.register);
app.get('/auth/me', checkAuth, userController.getMe);

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Server OK')
});
