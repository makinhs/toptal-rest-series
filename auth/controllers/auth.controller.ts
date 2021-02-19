import express from 'express';

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// @ts-expect-error
const jwtSecret:string = process.env.JWT_SECRET;
const tokenExpirationInSeconds = 36000;

class AuthController {
    private static instance: AuthController;

    static getInstance() {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    async createJWT(req: express.Request, res: express.Response) {
        try {
            const refreshId = req.body.userId + jwtSecret;
            const salt = crypto.randomBytes(16).toString('base64');
            const hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
            req.body.refreshKey = salt;
            const token = jwt.sign(req.body, jwtSecret, {expiresIn: tokenExpirationInSeconds});
            const b = Buffer.from(hash);
            return res.status(201).send({accessToken: token, refreshToken: hash});
        } catch (err) {
            return res.status(500).send(err);
        }
    }
}

export default AuthController.getInstance();
