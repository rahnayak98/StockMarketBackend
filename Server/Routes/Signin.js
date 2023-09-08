const express = require('express');
const router = express.Router();
const { Users } = require('../models/');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email: email } });
  if (!user) {
    return res.json({ error: 'User does not exist' });
  } else {
    localStorage.setItem('UserId', user.id);
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        return res.json({ error: 'Invalid creds' });
      }
      const accesstoken = sign(
        { username: user.username, id: user.id },
        'importantsecret'
      );
      res.json(accesstoken);
    });
  }
});

module.exports = router;
