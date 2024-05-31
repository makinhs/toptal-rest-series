
import { CreateUserDto } from '../dto/create.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import { PutUserDto } from '../dto/put.user.dto';

import prismaService from '../../common/services/prisma.service';

import { PermissionFlag } from '../../common/middleware/common.permissionflag.enum';

import shortid from 'shortid';
import debug from 'debug';

const log: debug.IDebugger = debug('app:prisma-dao');

class UsersDao {
    constructor() {
        log('Created new instance of UsersDao');
    }

removeHidden(user: any) {
    if (user) {
        const hiddenFields = ['password']
        for (const field of hiddenFields) {
            if (field in user) {
                delete user[field];
            }
        }
    }
    return user;
}

async addUser(user: CreateUserDto) {
    let data = user as any;
    data.id = shortid.generate();
    const usersCount = await this.getUsersCount();
    if (usersCount > 0) {
        data.permissionFlags = PermissionFlag.FREE_PERMISSION;
    }
    const added = await prismaService.users.create({data});
    return added.id;
}

async getUsers(limit=25, page=0) {
    const users = await prismaService.users.findMany({
        take: limit,
        skip: limit * page,
        /*omit: {
            password: true,
        },*/
    });
    return users.map(this.removeHidden);
}

async getUserById(userId: string) {
    const user = await prismaService.users.findUnique({
        /*omit: {
            password: true,
        },*/
        where: {id: userId},
    });
    if (user) {
        //@ts-ignore
        user._id = user.id;
    }
    return this.removeHidden(user);
}

async putUserById(userId: string, user: PutUserDto) {
    await prismaService.users.update({where: {id: userId}, data: user});
    return `${userId} updated via put`;
}

async getUserByEmail(email: string) {
    const user = await prismaService.users.findUnique({
        /*omit: {
            password: true,
        },*/
        where: {email},
    });
    return this.removeHidden(user);
}

async getUserByEmailWithPassword(email: string) {
    const user = await prismaService.users.findUnique({
        where: {email},
        select: {
            id: true,
            email: true,
            password: true,
            permissionFlags: true,
        },
    });
    if (user) {
        //@ts-ignore
        user._id = user.id;
    }
    return user;
}

async patchUserById(userId: string, user: PatchUserDto) {
    let data: any = {};
    const allowedPatchFields = [
        'password',
        'firstName',
        'lastName',
        'permissionFlags',
    ];
    for (let field of allowedPatchFields) {
        if (field in user) {
            // @ts-ignore
            data[field] = user[field];
        }
    }
    await prismaService.users.update({where: {id: userId}, data});
    return `${userId} patched`;
}

async removeUserById(userId: string) {
    await prismaService.users.delete({where: {id: userId}});
    return `${userId} removed`;
}

async getUsersCount() {
    const userCount = await prismaService.users.count()
    return userCount;
}
}

export default new UsersDao();

