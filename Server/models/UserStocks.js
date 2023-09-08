module.exports = (sequelize, DataTypes) => {
  const UserStocks = sequelize.define('UserStocks', {
    StockId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allownull: false,
    },
    StockCount: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    StockName: {
      type: DataTypes.STRING,
      allownull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    StockOrderId: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
  });

  UserStocks.associate = (models) => {
    UserStocks.belongsTo(models.Users, {
      foreignKey: 'UserId',
      onDelete: 'CASCADE',
    });
  };

  UserStocks.associate = (models) => {
    UserStocks.belongsTo(models.Stocks, {
      foreignKey: 'StockId',
      onDelete: 'CASCADE',
    });
  };

  return UserStocks;
};
