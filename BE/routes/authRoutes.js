const express = require('express');
const router = express.Router();
const db = require('../dbConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

function generateToken(payload) {
  return jwt.sign(payload, process.env.SECRET || 'secret', {
    expiresIn: '24h'
  });
}

router.get('/users', function (req, res) {
  console.log('/registered endpoint hit');
  // res.status(200).send('you have a lot of users');
  db('users')
    .then((users) => { console.log(users); res.status(200).send(users) })
})

router.post('/register', function (req, res, next) {
  console.log('req.body', req.body);
  let { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({
      error: true,
      message: 'Please provide a Username, Password'
    });

  password = bcrypt.hashSync(password, SALT_ROUNDS);

  db('users')
    .insert({ username, password })
    .then(([id]) => {
      let token = generateToken({ id });
      res.json({
        error: false,
        message: 'User created succesfully',
        token
      });
    })
    .catch(err => res.status(400).json({ error: true, message: 'Username is already taken' }));
});

router.post('/login', function (req, res, next) {
  let { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({
      error: true,
      message: 'Please provide a Username and Password'
    });

  db('users')
    .where({ username: username })
    .first()
    .then(user => {
      console.log(user);
      if (user && bcrypt.compareSync(password, user.password)) {
        let token = generateToken(user);

        res.json({
          error: false,
          message: `Welcome ${username}`,
          token
        });
      } else {
        return res.status(404).json({
          error: true,
          message: 'Invalid Login Info'
        });
      }
    })
    .catch(next);
});

module.exports = router;
