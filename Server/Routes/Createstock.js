const express = require('express');
const router = express.Router();
const { Stocks } = require('../models/');

router.post('/', async (req, res) => {
  const { StockName, Price, Volume, StartPrice } = req.body;
  const retstock = await Stocks.findOne({ where: { StockName: StockName } });

  if (retstock) {
    return res.status(400).json({ error: 'Stock already exsits' });
  } else {
    Stocks.create({
      StockName: StockName,
      Price: (StartPrice + StartPrice) / 6,
      Volume: Volume,
      StartPrice: StartPrice,
      HighPrice: StartPrice,
      LowPrice: StartPrice,
    });

    res.status(201).json('Stock created Successfully');
  }
});

module.exports = router;
