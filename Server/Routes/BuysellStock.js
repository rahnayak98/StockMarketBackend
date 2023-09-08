const express = require('express');
const router = express.Router();
const {
  Users,
  UserStocks,
  Stocks,
  Wallet,
  StockMarketTiming,
} = require('../models');

function getCurrentTime() {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

router.post('/buystock', async (req, res) => {
  const { userId, stockName, stockCount } = req.body;

  const currentTime = getCurrentTime();
  console.log(currentTime);

  const fromtime = await StockMarketTiming.findOne({
    attributes: ['fromTime'],
  });

  const totime = await StockMarketTiming.findOne({
    attributes: ['toTime'],
  });
  const fromTimeStr = fromtime.fromTime;
  const toTimeStr = totime.toTime;

  const [fromHours, fromMinutes, fromSeconds] = fromTimeStr.split(':');
  const [toHours, toMinutes, toSeconds] = toTimeStr.split(':');

  const fromDate = new Date(1970, 0, 1, fromHours, fromMinutes, fromSeconds);
  const toDate = new Date(1970, 0, 1, toHours, toMinutes, toSeconds);
  const fromTimeFormatted = fromDate.toLocaleTimeString([], { hour12: false });
  const toTimeFormatted = toDate.toLocaleTimeString([], { hour12: false });

  console.log(`From Time: ${fromTimeFormatted}`);
  console.log(`To Time: ${toTimeFormatted}`);

  if (currentTime >= fromTimeFormatted && currentTime <= toTimeFormatted) {
    const selectedStock = await Stocks.findOne({
      attributes: ['id', 'Price', 'Volume'],
      where: { StockName: stockName },
    });

    if (!selectedStock) {
      return res.status(404).json({ message: 'Stock not found' });
    } else {
      const { id, Price, Volume } = selectedStock;
      if (stockCount > Volume) {
        return res.status(404).json({ message: 'So many stocks not present' });
      }

      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const selectedwallet = await Wallet.findOne({
        attributes: ['Balance'],
        where: { id: userId },
      });

      if (!selectedwallet || selectedwallet.Balance == 0) {
        return res.status(404).json({ message: 'No Money in Wallet' });
      } else {
        let cost = stockCount * Price;
        if (cost > selectedwallet.Balance) {
          return res.status(404).json({ message: 'Add Money in the wallet!!' });
        } else {
          await Wallet.update(
            { Balance: selectedwallet.Balance - cost },
            { where: { id: userId } }
          );
          let userStockEntry = await UserStocks.findOne({
            where: { UserId: userId, StockId: id },
          });
          if (!userStockEntry) {
            await UserStocks.create({
              UserId: userId,
              StockId: id,
              StockCount: stockCount,
              StockName: stockName,
              //   StockOrderId: stockOrderId,
            });

            await Stocks.update(
              { Volume: Volume - stockCount },
              { where: { id: id } }
            );
            const updatedStock = await Stocks.findByPk(id, {
              attributes: ['Volume'],
            });

            UserStocks.findAll({
              include: [{ model: Stocks, attributes: ['StockName'] }],
            })
              .then((userStocks) => {
                // userStocks will contain StockName from the associated Stocks table
                console.log(userStocks);
              })
              .catch((error) => {
                console.error(error);
              });
            return res.status(200).json({
              message: 'Stocks bought successfully',
              volume: updatedStock.Volume,
            });
          }

          await Stocks.update(
            { Volume: Volume - stockCount },
            { where: { id: id } }
          );

          await userStockEntry.update({
            StockCount: userStockEntry.StockCount + stockCount,
          });
          const updatedStock = await Stocks.findByPk(id, {
            attributes: ['Volume'],
          });
          return res.status(200).json({
            message: 'Stocks bought successfully',
            volume: updatedStock.Volume,
          });
        }
      }
    }
  } else {
    return res.status(404).json({ message: 'Market Not Open!!' });
  }
});

router.post('/sellstock', async (req, res) => {
  const { userId, stockId, stockCount } = req.body;

  const Price = await Stocks.findOne({
    attributes: ['Price'],
    where: { id: stockId },
  });
  const currentTime = getCurrentTime();
  console.log(currentTime);

  const fromtime = await StockMarketTiming.findOne({
    attributes: ['fromTime'],
  });

  const totime = await StockMarketTiming.findOne({
    attributes: ['toTime'],
  });
  const fromTimeStr = fromtime.fromTime;
  const toTimeStr = totime.toTime;

  const [fromHours, fromMinutes, fromSeconds] = fromTimeStr.split(':');
  const [toHours, toMinutes, toSeconds] = toTimeStr.split(':');

  const fromDate = new Date(1970, 0, 1, fromHours, fromMinutes, fromSeconds);
  const toDate = new Date(1970, 0, 1, toHours, toMinutes, toSeconds);
  const fromTimeFormatted = fromDate.toLocaleTimeString([], { hour12: false });
  const toTimeFormatted = toDate.toLocaleTimeString([], { hour12: false });

  if (currentTime >= fromTimeFormatted && currentTime <= toTimeFormatted) {
    try {
      const selectedStock = await UserStocks.findOne({
        where: { UserId: userId, StockId: stockId },
      });

      if (!selectedStock) {
        return res.status(404).json({ message: 'Stock not found' });
      }
      const selectedwallet = await Wallet.findOne({
        attributes: ['Balance'],
        where: { id: userId },
      });
      if (!selectedwallet) {
        return res.status(404).json({ message: 'No Wallet found' });
      } else {
        let cost = stockCount * Price.Price;
        console.log(Price);

        const { StockCount } = selectedStock;
        if (stockCount > StockCount) {
          return res
            .status(400)
            .json({ message: 'Not enough stocks available' });
        }
        await Wallet.update(
          { Balance: selectedwallet.Balance + cost },
          { where: { id: userId } }
        );
        await selectedStock.decrement('StockCount', { by: stockCount });

        const stock = await Stocks.findByPk(stockId);
        if (!stock) {
          return res.status(404).json({ message: 'Stock not found' });
        }

        await stock.increment('Volume', { by: stockCount });

        return res.status(200).json({
          message: 'Stocks sold successfully',
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(404).json({ message: 'Market Not Open!!' });
  }
});
module.exports = router;
