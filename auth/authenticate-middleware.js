/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const db = require('../database/dbConfig');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  async verifyNewUser(req, res, next) {
    if (!req.body.username || !req.body.password) {
      next({code: 500, message: 'username and password are required'})
    }
   db('users').where({username: req.body.username})
   .then(([data])=>{
     if (data) {
      next({code: 500, message: 'username is taken'})
     } else {
       next();
     }
   })

  },

  async secure(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({message: 'must be logged in! SECURITY ALERTTTTTTT WOW'})
    }
    jwt.verify(token, process.env.SECRET_STRING, (err, decoded)=>{
      if (err) {
        next({code: 500, message: err.message})
      } else {
        next();
      }
    })
  }


};
