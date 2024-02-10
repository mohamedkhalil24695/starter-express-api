const { DataTypes } = require('sequelize');
const  sequelize = require('../../../config/sequalize');

const ReportFollowUpActions = sequelize.define('ReportFollowUpActions', {
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
  actionName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,  
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  }, 
  state:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'inProgress'
  },
  deadLine:{
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true
});   

module.exports = ReportFollowUpActions;
  