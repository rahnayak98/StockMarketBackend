module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    Balance: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
  });

  Wallet.associate = (models) => {
    Wallet.belongsTo(models.Users, {
      foreignKey: 'UserId',
      onDelete: 'CASCADE',
    });
  };
  return Wallet;
};
