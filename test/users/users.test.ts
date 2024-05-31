import app from '../../app';
import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import prismaService from '../../common/services/prisma.service';

import { PermissionFlag } from '../../common/middleware/common.permissionflag.enum';
import usersService from '../../users/services/users.service';

let firstUserIdTest = '';
const firstUserBody = {
    email: `marcos.henrique+${shortid.generate()}@toptal.com`,
    password: 'Sup3rSecret!23',
};
let otherUserId = '';

let accessToken = '';
let refreshToken = '';
const newFirstName = 'Jose';
const newFirstName2 = 'Paulo';
const newLastName2 = 'Faraco';

const permissionFlags = PermissionFlag.PAID_PERMISSION;

describe('users and auth endpoints', function () {
    let request: supertest.SuperAgentTest;
    before(function () {
        request = supertest.agent(app);
    });
    after(function (done) {
        // shut down the Express.js server, close our MongoDB connection, then tell Mocha we're done:
        app.close(async () => {
            await prismaService.users.deleteMany({
                where: {email: firstUserBody.email},
            })
            await prismaService.users.deleteMany({
                where: {id: otherUserId},
            })
            prismaService.$disconnect();
            done()
        });
    });

    it('the first user may set his/her permissionFlags', async function () {
        const secondUserBody = {
            email: `marcos.henrique+${shortid.generate()}@toptal.com`,
            password: 'Sup3rSecret!23',
        };
        const res = await request.post('/users').send(
            Object.assign({}, secondUserBody, {permissionFlags})
        );
        otherUserId = res.body.id;

        const user = await usersService.readById(otherUserId);
        const savedFlags = user?.permissionFlags;

        expect(savedFlags).to.equal(permissionFlags);
    });

    it('should allow a POST to /users', async function () {
        const res = await request.post('/users').send(
            Object.assign({}, firstUserBody, {permissionFlags})
        );

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.be.a('string');
        firstUserIdTest = res.body.id;
    });

    it('subsequent users may not set their permissionFlags', async function () {
        const user = await usersService.readById(firstUserIdTest);
        const savedFlags = user?.permissionFlags;

        expect(savedFlags).to.equal(PermissionFlag.FREE_PERMISSION);
    });

    it('should allow a POST to /auth', async function () {
        const res = await request.post('/auth').send(firstUserBody);
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.accessToken).to.be.a('string');
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
    });

    it('should allow a GET from /users/:userId with an access token', async function () {
        const res = await request
            .get(`/users/${firstUserIdTest}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body._id).to.equal(firstUserIdTest);
        expect(res.body.email).to.equal(firstUserBody.email);
    });

    describe('with a valid access token', function () {
        it('should disallow a GET to /users', async function () {
            const res = await request
                .get(`/users`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send();
            expect(res.status).to.equal(403);
        });

        it('should disallow a PATCH to /users/:userId', async function () {
            const res = await request
                .patch(`/users/${firstUserIdTest}`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send({
                    firstName: newFirstName,
                });
            expect(res.status).to.equal(403);
        });

        it('should disallow a PUT to /users/:userId with an nonexistent ID', async function () {
            const res = await request
                .put(`/users/i-do-not-exist`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send({
                    email: firstUserBody.email,
                    password: firstUserBody.password,
                    firstName: 'Marcos',
                    lastName: 'Silva',
                    permissionFlags: 256,
                });
            expect(res.status).to.equal(404);
        });

        it('should disallow a PUT to /users/:userId trying to change the permission flags', async function () {
            const res = await request
                .put(`/users/${firstUserIdTest}`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send({
                    email: firstUserBody.email,
                    password: firstUserBody.password,
                    firstName: 'Marcos',
                    lastName: 'Silva',
                    permissionFlags: 256,
                });
            expect(res.status).to.equal(400);
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors).to.have.length(1);
            expect(res.body.errors[0]).to.equal(
                'User cannot change permission flags'
            );
        });

        it('should allow a PUT to /users/:userId/permissionFlags/2 for testing', async function () {
            const res = await request
                .put(`/users/${firstUserIdTest}/permissionFlags/2`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send({});
            expect(res.status).to.equal(204);
        });

        describe('with a new set of permission flags', function () {
            it('should allow a POST to /auth/refresh-token', async function () {
                const res = await request
                    .post('/auth/refresh-token')
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send({ refreshToken });
                expect(res.status).to.equal(201);
                expect(res.body).not.to.be.empty;
                expect(res.body).to.be.an('object');
                expect(res.body.accessToken).to.be.a('string');
                accessToken = res.body.accessToken;
                refreshToken = res.body.refreshToken;
            });

            it('should allow a PUT to /users/:userId to change first and last names', async function () {
                const res = await request
                    .put(`/users/${firstUserIdTest}`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send({
                        email: firstUserBody.email,
                        password: firstUserBody.password,
                        firstName: newFirstName2,
                        lastName: newLastName2,
                        permissionFlags: 2,
                    });
                expect(res.status).to.equal(204);
            });

            it('should allow a GET from /users/:userId and should have a new full name', async function () {
                const res = await request
                    .get(`/users/${firstUserIdTest}`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send();
                expect(res.status).to.equal(200);
                expect(res.body).not.to.be.empty;
                expect(res.body).to.be.an('object');
                expect(res.body._id).to.be.a('string');
                expect(res.body.firstName).to.equal(newFirstName2);
                expect(res.body.lastName).to.equal(newLastName2);
                expect(res.body.email).to.equal(firstUserBody.email);
                expect(res.body._id).to.equal(firstUserIdTest);
            });

            it('should allow a DELETE from /users/:userId', async function () {
                const res = await request
                    .delete(`/users/${firstUserIdTest}`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send();
                expect(res.status).to.equal(204);
            });
        });
    });
});
