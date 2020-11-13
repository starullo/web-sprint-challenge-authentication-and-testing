const db = require('../database/dbConfig');

module.exports = {
    getUsers() {
        return db('users')
    },
    getUserById(id) {
        return db('users').where({id}).first();
    },
    async addUser(user) {
        const [id] = await db('users').insert(user);
        return db('users').where({id}).first();
    }
}