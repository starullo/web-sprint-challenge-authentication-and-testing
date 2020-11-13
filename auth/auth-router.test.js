const request = require('supertest');
const server = require('../api/server.js');
const db = require('../database/dbConfig');

beforeEach(async () => {
    await db('users').truncate()
})


describe('server.js', () => {
    describe('auth endpoint', () => {
        describe('/login', () => {
            it('its working', async () => {
                const res = await request(server).post('/api/auth/login').send({username: '', password: ''});
                expect(res.status).toBe(500)
            })
            it('you can log in', async () => {
                const res = await request(server).post('/api/auth/login').send({username: 'wow', password: 'wow'})
                expect(res.status).toBe(200)
            })
        })
        describe('/register', () => {
            it('it is working', async () => {
                const res = await request(server).post('/api/auth/register').send({username: 'wow', password: 'wow'});
                expect(res.status).toBe(201);
            })
            it('you can register', async () => {
                const res = await request(server).post('/api/auth/register').send({username: 'wow', password: 'wow'})

                const users = await db('users');
                expect(users.length).toEqual(1)
            })
        })
        describe('/jokes', () => {
            it('the endpoint is up', async () => {
                return request(server).get('/api/jokes')
                .expect('Content-Type', /json/)
            })
            it('you cant get jokes without token', async () => {
                const res = await request(server)/*.header({authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTYwNTI4Njg5NH0.cWBr0ZyCCeh4_TFmisIVneQeGgEkrRFWkTIOzKC9q2g"})*/.get('/api/jokes')
                expect(res.status).toBe(401)
            })
        })
    })
})