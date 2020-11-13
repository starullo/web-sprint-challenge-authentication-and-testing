
exports.seed = function(knex) {
      return knex('users').insert([
        {username: 'wow', password: 'wow'}
      ]);
};
