import UsersDao from '../daos/users.dao';
import {CRUD} from "../../common/interfaces/crud.interface";
import { CreateUserDto } from '../dto/create.user.dto';
import { PutUserDto } from '../dto/put.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';

class UsersService implements CRUD {

    async create(resource: CreateUserDto) {
        return UsersDao.addUser(resource);
    }

    async deleteById(resourceId: string) {
        return UsersDao.removeUserById(resourceId);
    };

    async list(limit: number, page: number) {
        return UsersDao.getUsers();
    };

    async patchById(resource: PatchUserDto) {
        return UsersDao.patchUserById(resource)
    };

    async readById(resourceId: string) {
        return UsersDao.getUserById(resourceId);
    };

    async putById(resource: PutUserDto) {
        return UsersDao.putUserById(resource);
    };

    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email);
    }
}

export default new UsersService();