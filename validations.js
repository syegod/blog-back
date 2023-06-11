import { body } from 'express-validator';

export const registerValidator = [
    body('email', 'Invalid email format.').isEmail(),
    body('password', 'Password length should be more than 5 characters.').isLength({ min: 5 }),
    body('username', 'Username length should be more than 5 characters.').isLength({ min: 3 }),
    body('avatarUrl', 'AvatarURL is not a string.').optional().isURL(),
];

export const loginValidator = [
    body('email', 'Invalid email format.').isEmail(),
    body('password', 'Password length should be more than 5 characters.').isLength({ min: 5 }),
];

export const postCreateValidation = [
    body('title', 'Enter post title.').isLength({min:3}).isString(),
    body('text', 'Enter post text.').isLength({min:10}).isString(),
    body('tags', 'Invalid tags format.').optional().isArray(),
    body('imageUrl', 'Invalid image link.').optional().isURL()
];
