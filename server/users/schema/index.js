const { DataTypes } = require('sequelize');
const  sequelize = require('../../../config/sequalize');
const { systemRoles } = require('../../../common/roles');
const Report = require('../../reports/schema');
const ReportFollowUpActions = require('../../report_followup_actions/schema');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reportsTarget: {
    type: DataTypes.INTEGER,  
    allowNull: true,
    defaultValue: 0
  },
  email: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
  hashedPassword: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [systemRoles]
    }
  }
}, {
  timestamps: true
});

User.hasMany(Report, { foreignKey: 'creatorId' , as: 'creator'}); 
Report.belongsTo(User, { foreignKey: 'creatorId',  as: 'creator'}); 

User.hasMany(ReportFollowUpActions, { foreignKey: 'userId' }); 
ReportFollowUpActions.belongsTo(User); 

module.exports = User;
