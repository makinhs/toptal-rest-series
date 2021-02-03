import UsersDao from '../daos/users.dao';
import {CRUD} from "../../common/interfaces/crud.interface";
import {UserDto} from "../dto/user.model";

class UsersService implements CRUD {
    private static instance: UsersService;

    static getInstance(): UsersService {
        if (!UsersService.instance) {
            UsersService.instance = new UsersService();
        }
        return UsersService.instance;
    }

    async create(resource: UserDto) {
        resource.permissionLevel = 1;
        return UsersDao.addUser(resource);
    }

    async deleteById(resourceId: string) {
        return UsersDao.removeUserById(resourceId);
    };

    async list(limit: number, page: number) {
        return UsersDao.getUsers(limit, page);
    };

    async patchById(userId: string, resource: UserDto): Promise<any> {
        return UsersDao.patchUserById(userId, resource)
    };

    async readById(resourceId: string) {
        return UsersDao.getUserById(resourceId);
    };

    async updateById(userId: string, resource: UserDto): Promise<any> {
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