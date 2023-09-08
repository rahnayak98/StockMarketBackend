module.exports = (sequelize, DataTypes) => {
  const Stocks = sequelize.define('Stocks', {
    StockName: {
      type: DataTypes.STRING,
      allownull: false,
    },
    HighPrice: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    LowPrice: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    Price: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    Volume: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    StartPrice: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
  });

  return Stocks;
};
