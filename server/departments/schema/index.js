
const { DataTypes } = require('sequelize');
const  sequelize = require('../../../config/sequalize');

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameAr: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true
});



module.exports = Department;
