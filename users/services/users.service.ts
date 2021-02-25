import UsersDao from '../daos/users.dao';
import {CRUD} from "../../common/interfaces/crud.interface";
import {UsersDto} from "../dto/users.model";

class UsersService implements CRUD {

    async create(resource: UsersDto) {
        return await UsersDao.addUser(resource);
    }

    async deleteById(resourceId: string) {
        return await UsersDao.removeUserById(resourceId);
    };

    async list(limit: number, page: number) {
        return await UsersDao.getUsers();
    };

    async patchById(resource: UsersDto) {
        return await UsersDao.patchUserById(resource)
    };

    async readById(resourceId: string) {
        return await UsersDao.getUserById(resourceId);
    };

    async updateById(resource: UsersDto) {
        return await UsersDao.putUserById(resource);
    };

    async getUserByEmail(email: string) {
        return await UsersDao.getUserByEmail(email);
    }
}

export default new UsersService();