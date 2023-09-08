const express = require('express');
const router = express.Router();
const { Wallet, Users } = require('../models');

router.post('/deposit', async (req, res) => {
  const { userId, balance } = req.body;

  const selectedperson = await Users.findOne({
    attributes: ['id'],
    where: { id: userId },
  });

  if (!selectedperson) {
    return res.status(404).json({ message: 'No User present' });
  } else {
    let userwalletEntry = await Wallet.findOne({
      attributes: ['Balance'],
      where: { UserId: userId },
    });
    if (!userwalletEntry) {
      await Wallet.create({
        UserId: userId,
        Balance: balance,
      });
    } else {
      await Wallet.update(
        { Balance: userwalletEntry.Balance + balance },
        { where: { id: userId } }
      );
    }

    return res.status(200).json({
      message: 'Wallet deposited successfully',
      balance: balance,
    });
  }
});

router.post('/withdraw', async (req, res) => {
  const { userId, balance } = req.body;

  const selectedperson = await Users.findOne({
    attributes: ['id'],
    where: { id: userId },
  });

  if (!selectedperson) {
    return res.status(404).json({ message: 'No User present' });
  } else {
    let userwalletEntry = await Wallet.findOne({
      attributes: ['Balance'],
      where: { UserId: userId },
    });
    if (
      !userwalletEntry ||
      userwalletEntry.Balance == 0 ||
      balance > userwalletEntry.Balance
    ) {
      return res.status(404).json({ message: 'No Amount in wallet' });
    } else {
      await Wallet.update(
        { Balance: userwalletEntry.Balance - balance },
        { where: { id: userId } }
      );
    }

    return res.status(200).json({
      message: 'Amount Withdrawn successfully',
      balance: balance,
    });
  }
});

module.exports = router;
