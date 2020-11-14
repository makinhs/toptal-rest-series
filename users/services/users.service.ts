import genericInMemoryDao from '../daos/in.memory.dao';
import {CRUD} from "../../common/interfaces/crud.interface";
import {UsersDto} from "../dto/users.model";

class UsersService implements CRUD{
    private static instance: UsersService;

    static getInstance(): UsersService {
        if (!UsersService.instance) {
            UsersService.instance = new UsersService();
        }
        return UsersService.instance;
    }

    create(resource: UsersDto) {
        return genericInMemoryDao.addUser(resource);
    }

    deleteById(resourceId: string) {
        return genericInMemoryDao.removeUserById(resourceId);
    };

    list(limit: number, page: number) {
        return genericInMemoryDao.getUsers();
    };

    patchById(resource: UsersDto) {
        return genericInMemoryDao.patchUserById(resource)
    };

    readById(resourceId: string) {
        return genericInMemoryDao.getUserById(resourceId);
    };

    updateById(resource: UsersDto) {
        return genericInMemoryDao.putUserById(resource);
    };

    async getByEmail(email: string) {
        return genericInMemoryDao.getByEmail(email);
    }
}

export default UsersService.getInstance();