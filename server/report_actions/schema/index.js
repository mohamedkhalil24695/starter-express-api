const { DataTypes } = require('sequelize');
const  sequelize = require('../../../config/sequalize');

const ReportActions = sequelize.define('ReportActions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
reportId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Report',
      key: 'id',
    },
  },
  actionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Action',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,  
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  }, 
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null
  },
}, {
  timestamps: true
});   

module.exports = ReportActions;
  