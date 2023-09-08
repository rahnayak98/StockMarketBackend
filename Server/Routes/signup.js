const express = require('express');
const router = express.Router();
const { Users } = require('../models/');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  //   const post = req.body;
  const { username, email, userType, password } = req.body;
  const retuser = await Users.findOne({ where: { username: username } });
  const retemail = await Users.findOne({ where: { email: email } });

  if (retuser || retemail) {
    return res.status(400).json({ error: 'Username or email already taken' });
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 5 || password.length > 15) {
      return res
        .status(400)
        .json({ error: 'Password must be between 5 and 15 characters' });
    }
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        email: email,
        userType: userType,
        password: hash,
      });
    });

    res.status(201).json({ msg: 'User Created Successfully' });
  }
});

router.post('/admin', async (req, res) => {
  //   const post = req.body;
  const { username, email, userType, password } = req.body;
  const retuser = await Users.findOne({ where: { username: username } });
  const retemail = await Users.findOne({ where: { email: email } });
  console.log('retuserType:', retemail);
  if (retuser || retemail) {
    return res.status(400).json({ error: 'Username or email already taken' });
  } else if (userType !== 'Admin') {
    return res.status(400).json({ error: 'You dont have Admin Privilages!!' });
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 5 || password.length > 15) {
      return res
        .status(400)
        .json({ error: 'Password must be between 5 and 15 characters' });
    }
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        email: email,
        userType: userType,
        password: hash,
      });
    });

    res.status(201).json({ msg: 'Admin Created Successfully' });
  }
});

module.exports = router;
