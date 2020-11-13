const router = require('express').Router();
const bcrypt = require('bcryptjs');
require('dotenv').config();
const db = require('../database/dbConfig')
const jwt = require('jsonwebtoken')

const {verifyNewUser} = require('./authenticate-middleware');
const {addUser} = require('./authActions');
const dbConfig = require('../database/dbConfig');



router.post('/register', verifyNewUser, async (req, res) => {
  const {username, password} = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const newUser = {username, password: hash};
  const user = await addUser(newUser);
  if (!user) {
    res.status(500).json({message: 'something went wrong'})
  } else {
    res.status(201).json(user);
  }
});

router.post('/login', async (req, res) => {
  // implement login
  try {
    const {username, password} = req.body;
    const user = await db('users').where({username}).first();
    if (!user) {
      res.status(401).json({message: 'invalid username'});
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      res.status(401).json({message: 'incorrect password'})
    }
    const token = jwt.sign({
      userId: user.id,
    }, process.env.SECRET_STRING)

    res.json({message: 'welcome back, ' + user.username, token})
  } catch (err) {
    res.status(500).json({message: err.message + 'something went wrong...haha wow...sorry...gotta go...*jumps out of window*...*explodes*'})
  }
});

router.use((err, req, res, next)=>{
  res.status(err.code).json({message: err.message});
})

module.exports = router;
