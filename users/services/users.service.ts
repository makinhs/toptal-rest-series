import UsersDao from '../daos/users.dao';
import {CRUD} from "../../common/interfaces/crud.interface";
import {UserDto} from "../dto/user.model";

class UsersService implements CRUD {

    async create(resource: UserDto) {
        return await UsersDao.addUser(resource);
    }

    async deleteById(resourceId: string) {
        return await UsersDao.removeUserById(resourceId);
    };

    async list(limit: number, page: number) {
        return await UsersDao.getUsers();
    };

    async patchById(resource: UserDto) {
        return await UsersDao.patchUserById(resource)
    };

    async readById(resourceId: string) {
        return await UsersDao.getUserById(resourceId);
    };

    async updateById(resource: UserDto) {
        return await UsersDao.putUserById(resource);
    };

    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email);
    }
}

export default new UsersService();