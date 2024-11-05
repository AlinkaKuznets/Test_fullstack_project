import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import mongoose from "mongoose";
import { validationResult } from "express-validator"

import { registerValidator } from "./validations/auth.js"

import UserModel from './models/user.js'
import checkAuth from './utils/checkAuth.js'

mongoose.connect('mongodb+srv://admin:180801Ak@cluster0.wrfph.mongodb.net/blog')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB err', err));

const app = express();
app.use(express.json());

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return req.status(400).json({
                massege: 'Ползователь не найден',
            });
        };

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                massege: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign({
            _id: user._id,

        }, 'secret123', {
            expiresIn: '30d'
        });

        const { passwordHash, ...userData } = user._doc;

        res.json(
            {
                ...userData,
                token,
            }
        );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: ' Не удалось выполнить подключение'
        });
    }
});

app.post('/auth/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avtarUrl: req.body.avtarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,

        }, 'secret123', {
            expiresIn: '30d'
        });

        const { passwordHash, ...userData } = user._doc;

        res.json(
            {
                ...userData,
                token,
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: ' Не удалось выполнить подключение'
        });
    }
});

app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Полбзователь не найден',
            });
        }
        const { passwordHash, ...userData } = user._doc;

        res.json(userData);

    } catch (err) {

    }
});

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Server OK')
});
