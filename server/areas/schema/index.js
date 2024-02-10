
const { DataTypes } = require('sequelize');
const  sequelize = require('../../../config/sequalize');

const Area = sequelize.define('Area', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true
});



module.exports = Area;
