import express from 'express';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const jwtSecret = process.env.JWT_SECRET;
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
            let refreshId = req.body.userId + jwtSecret;
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
            req.body.refreshKey = salt;
            let token = jwt.sign(req.body, jwtSecret, {expiresIn: tokenExpirationInSeconds});
            let b = Buffer.from(hash);
            let refreshToken = b.toString('base64');
            return res.status(201).send({accessToken: token, refreshToken: refreshToken});
        } catch (err) {
            return res.status(500).send(err);
        }
    }
}

export default AuthController.getInstance();
