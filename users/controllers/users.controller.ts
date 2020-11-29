import express from 'express';
import usersService from '../services/users.service';

class UsersController {
    private static instance: UsersController;

    static getInstance(): UsersController {
        if (!UsersController.instance) {
            UsersController.instance = new UsersController();
        }
        return UsersController.instance;
    }

    listUsers(req: express.Request, res: express.Response) {
        const users = usersService.list(100, 0);
        res.status(200).send(users);
    }

    getUserById(req: express.Request, res: express.Response) {
        const user = usersService.readById(req.params.userId);
        res.status(200).send(user);
    }

    createUser(req: express.Request, res: express.Response) {
        const userId = usersService.create(req.body);
        res.status(201).send({id: userId});
    }

    patch(req: express.Request, res: express.Response) {
        usersService.patchById(req.body);
        res.status(204).send(``);
    }

    put(req: express.Request, res: express.Response) {
        usersService.updateById({id: req.params.userId, ...req.body});
        res.status(204).send(``);
    }

    removeUser(req: express.Request, res: express.Response) {
        usersService.deleteById(req.params.userId);
        res.status(204).send(``);
    }
}

export default UsersController.getInstance();