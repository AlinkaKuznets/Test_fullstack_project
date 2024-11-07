import {body} from 'express-validator';

export const loginValidator = [
    body('email','Неверрный формат почты').isEmail(),
    body('password','Пароль должен содержать минимум 5 символов').isLength({min: 5}),
];

export const registerValidator = [
    body('email','Неверрный формат почты').isEmail(),
    body('password','Пароль должен содержать минимум 5 символов').isLength({min: 5}),
    body('fullName','Укажите имя').isLength({min: 3}),
    body('avtarUrl','Неверная ссылка').optional().isURL(),
];

export const postCreateValidator = [
    body('title','введите заголовок статьи').isLength({min: 3}).isString(),
    body('text','Введите текст статьи').isLength({min: 10}).isString(),
    body('tags','Неверный формат тэгов').optional().isArray(),
    body('imageUrl','Неверная ссылка').optional().isString(),
];