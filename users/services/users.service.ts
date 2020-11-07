import GenericInMemoryDao from '../daos/in.memory.dao';
import {CRUD} from "../../common/interfaces/crud.interface";
import {UsersDto} from "../dto/users.model";

class UsersService implements CRUD{
    private static instance: UsersService;

    constructor() {
       
    }

    static getInstance(): UsersService {
        if (!UsersService.instance) {
            UsersService.instance = new UsersService();
        }
        return UsersService.instance;
    }

    create(resource: UsersDto) {
        return GenericInMemoryDao.addUser(resource);
    }

    deleteById(resourceId: string) {
        return GenericInMemoryDao.removeUserById(resourceId);
    };

    list(limit: number, page: number) {
        return GenericInMemoryDao.getUsers();
    };

    patchById(resource: UsersDto) {
        return GenericInMemoryDao.patchUserById(resource)
    };

    readById(resourceId: string) {
        return GenericInMemoryDao.getUserById(resourceId);
    };

    updateById(resource: UsersDto) {
        return GenericInMemoryDao.putUserById(resource);
    };

    async getByEmail(email: string) {
        return GenericInMemoryDao.getByEmail(email);
    }
}

export default UsersService.getInstance();