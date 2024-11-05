import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import mongoose from "mongoose";
import { validationResult } from "express-validator"

import { registerValidator } from "./validations/auth.js"
import UserModel from './models/user.js'

mongoose.connect('mongodb+srv://admin:180801Ak@cluster0.wrfph.mongodb.net/')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB err', err));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello world")
});

app.post('/auth/register', registerValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avtarUrl: req.body.avtarUrl,
        passwordHash,
    });

    const user = await doc.save();

    res.json(user);
});

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Server OK')
});
