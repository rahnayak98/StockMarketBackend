module.exports = (sequelize, DataTypes) => {
  const StockMarketTiming = sequelize.define('StockMarketTiming', {
    fromTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    toTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  });

  return StockMarketTiming;
};
