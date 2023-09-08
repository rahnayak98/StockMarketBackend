const express = require('express');
const router = express.Router();
const { Stocks, UserStocks } = require('../models');

router.get('/all', async (req, res) => {
  const Stock = await Stocks.findAll();
  // console.log(Stock);
  return res.status(200).json(Stock);
});
router.get('/:id', async (req, res) => {
  const userid = req.params.id;
  const userstocks = await UserStocks.findByPk(userid);
  res.json(userstocks);
});

module.exports = router;
