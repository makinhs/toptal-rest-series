import genericInMemoryDao from '../daos/in.memory.dao';
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
        return await genericInMemoryDao.addUser(resource);
    }

    async deleteById(resourceId: string) {
        return await genericInMemoryDao.removeUserById(resourceId);
    };

    async list(limit: number, page: number) {
        return await genericInMemoryDao.getUsers();
    };

    async patchById(resource: UsersDto) {
        return await genericInMemoryDao.patchUserById(resource)
    };

    async readById(resourceId: string) {
        return await genericInMemoryDao.getUserById(resourceId);
    };

    async updateById(resource: UsersDto) {
        return await genericInMemoryDao.putUserById(resource);
    };

    async getUserByEmail(email: string): Promise<UsersDto | null> {
        const user = await genericInMemoryDao.getUserByEmail(email);
        if (user) {
            return <UsersDto>user;
        } else {
            return null;
        }
    }
}

export default UsersService.getInstance();