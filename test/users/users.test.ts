import app from '../../app';
import supertest from 'supertest';
import {expect} from 'chai';
import shortid from "shortid";
import mongoose from 'mongoose';

let firstUserIdTest = '';
const firstUserBody = {
  "email": `marcos.henrique+${shortid.generate()}@toptal.com`,
  "password": "Sup3rSecret!23",
};

let accessToken = '';
let refreshToken = '';
const name = 'Jose';

describe('Should test basic users endpoints', function () {
  let request: supertest.SuperAgentTest;
  before(function () {
    request = supertest.agent(app);
  })
  after(function (done) {
    // shut down the Express.js server, close our MongoDB connection, then tell Mocha we're done:
    app.close(() => {
      mongoose.connection.close(done);
    });
  });

  it('should POST /users', async function () {
    const res = await request
      .post('/users')
      .send(firstUserBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body.id).to.be.an('string');
    firstUserIdTest = res.body.id;
  });

  it('should post /auth', async function () {
    const res = await request
      .post('/auth')
      .send(firstUserBody);
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body.accessToken).to.be.an('string');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it(`should GET /users/:userId`, async function () {
    const res = await request
      .get(`/users/${firstUserIdTest}`)
      .set({'Authorization': `Bearer ${accessToken}`})
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body._id).to.be.an('string');
    expect(res.body._id).to.be.equals(firstUserIdTest);
    expect(res.body.email).to.be.equals(firstUserBody.email);
  });


  it(`should GET /users`, async function () {
    const res = await request
      .get(`/users`)
      .set({'Authorization': `Bearer ${accessToken}`})
      .send();
    expect(res.status).to.equal(403);
  });

  it('should Patch /users/:userId', async function () {

    const res = await request
      .patch(`/users/${firstUserIdTest}`)
      .set({'Authorization': `Bearer ${accessToken}`})
      .send({
        firstName: name,
      });
    expect(res.status).to.equal(204);
  });

  it('should PUT /users/:userId and not be able to change permissionLevel', async function () {
    const res = await request
      .put(`/users/${firstUserIdTest}`)
      .set({'Authorization': `Bearer ${accessToken}`})
      .send({
        email: firstUserBody.email,
        password: firstUserBody.password,
        firstName: 'Marcos',
        lastName: 'Silva',
        permissionLevel: 256,
      });
    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal('User cannot change permission level');
  });

  it('should PUT /users/:userId/permissionLevel/2 and change user permission level for testing', async function () {
    const res = await request
      .put(`/users/${firstUserIdTest}/permissionLevel/2`)
      .set({'Authorization': `Bearer ${accessToken}`})
      .send({});
    expect(res.status).to.equal(204);
  });

  it('should post refresh the token with new permissionLevel /auth', async function () {
    const res = await request
      .post('/auth/refresh-token')
      .set({'Authorization': `Bearer ${accessToken}`})
      .send({refreshToken});
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body.accessToken).to.be.an('string');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should PUT /users/:userId and change firstName and lastName', async function () {
    const res = await request
      .put(`/users/${firstUserIdTest}`)
      .set({'Authorization': `Bearer ${accessToken}`})
      .send({
        email: firstUserBody.email,
        password: firstUserBody.password,
        firstName: 'Paulo',
        lastName: 'Faraco',
        permissionLevel: 2,
      });
    expect(res.status).to.equal(204);
  });

  it(`should GET /users/:userId to have a new name`, async function () {
    const res = await request
      .get(`/users/${firstUserIdTest}`)
      .set({'Authorization': `Bearer ${accessToken}`})
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body._id).to.be.an('string');
    expect(res.body.firstName).to.be.equals('Paulo');
    expect(res.body.email).to.be.equals(firstUserBody.email);
    expect(res.body._id).to.be.equals(firstUserIdTest);
  });

  it('should DELETE /users/:userId', async function () {
    const res = await request
      .delete(`/users/${firstUserIdTest}`)
      .set({'Authorization': `Bearer ${accessToken}`})
      .send();
    expect(res.status).to.equal(204);
  });
})
