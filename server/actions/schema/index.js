const { DataTypes } = require('sequelize');
const  sequelize = require('../../../config/sequalize');
const { reportActions } = require('../helpers/constants');
const ReportActions = require('../../report_actions/schema');

const Action = sequelize.define('Action', {
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
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { 
      isIn: [reportActions]
    }
  },
}, { 
  timestamps: true
});

Action.hasMany(ReportActions, { foreignKey: 'actionId' }); 
ReportActions.belongsTo(Action); 


 
module.exports = Action; 
  