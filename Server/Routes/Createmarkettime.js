const express = require('express');
const router = express.Router();
const { StockMarketTiming } = require('../models');
router.post('/createtiming', async (req, res) => {
  try {
    const { fromTime, toTime } = req.body;

    // Create a new market timing record

    const fromtime = await StockMarketTiming.findOne({
      attributes: ['fromTime'],
    });

    const totime = await StockMarketTiming.findOne({
      attributes: ['toTime'],
    });
    console.log(fromtime);
    if (fromtime == null) {
      console.log('test');
      await StockMarketTiming.create({ fromTime: fromTime, toTime: toTime });
    } else {
      await StockMarketTiming.update(
        { fromTime: fromTime, toTime: toTime },
        {
          where: { id: 1 },
        }
      );
    }

    return res
      .status(201)
      .json({ message: 'Initial stock market timing created successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
