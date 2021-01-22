import UsersDao from '../daos/users.dao';
import {CRUD} from "../../common/interfaces/crud.interface";
import {UsersDto} from "../dto/users.model";

class UsersService implements CRUD {
    private static instance: UsersService;

    static getInstance(): UsersService {
        if (!UsersService.instance) {
            UsersService.instance = new UsersService();
        }
        return UsersService.instance;
    }

    async create(resource: UsersDto) {
        console.log(resource);
        console.log(UsersDao);
        return await UsersDao.addUser(resource);
    }

    async deleteById(resourceId: string) {
        return UsersDao.removeUserById(resourceId);
    };

    async list(limit: number, page: number) {
        return await UsersDao.getUsers(limit, page);
    };

    async patchById(userId: string, resource: UsersDto): Promise<any> {
        return UsersDao.patchUserById(userId, resource)
    };

    async readById(resourceId: string) {
        return await UsersDao.getUserById(resourceId);
    };

    async updateById(userId: string, resource: UsersDto): Promise<any> {
        return UsersDao.patchUserById(userId, resource);
    };

    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email);
    }
    async getUserByEmailWithPassword(email: string) {
        return UsersDao.getUserByEmailWithPassword(email);
    }
}

export default UsersService.getInstance();