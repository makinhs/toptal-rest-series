import UsersDao from '../daos/users.dao';
import {CRUD} from "../../common/interfaces/crud.interface";
import {UserDto} from "../dto/user.dto";

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

    async deleteById(id: string) {
        return UsersDao.removeUserById(id);
    };

    async list(limit: number, page: number) {
        return UsersDao.getUsers(limit, page);
    };

    async patchById(id: string, resource: UserDto): Promise<any> {
        return UsersDao.patchUserById(id, resource)
    };

    async readById(id: string) {
        return UsersDao.getUserById(id);
    };

    async updateById(id: string, resource: UserDto): Promise<any> {
        return UsersDao.patchUserById(id, resource);
    };

    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email);
    }
    async getUserByEmailWithPassword(email: string) {
        return UsersDao.getUserByEmailWithPassword(email);
    }
}

export default UsersService.getInstance();