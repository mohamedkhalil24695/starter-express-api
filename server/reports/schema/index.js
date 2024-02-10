const { DataTypes } = require('sequelize');
const  sequelize = require('../../../config/sequalize');
const ReportActions = require('../../report_actions/schema');
const Department = require('../../departments/schema');
const Area = require('../../areas/schema');
const ReportFollowUpActions = require('../../report_followup_actions/schema');
const ReportImages = require('../../reportImages/schema');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  assistorName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  areaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  NumberOfObservers: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },

}, {
  timestamps: true
});

Report.hasMany(ReportActions, { foreignKey: 'reportId' }); 
Report.hasMany(ReportImages, { foreignKey: 'reportId' }); 
Report.hasMany(ReportFollowUpActions, { foreignKey: 'reportId' }); 
ReportFollowUpActions.belongsTo(Report); 
Report.hasOne(Department, { sourceKey: 'departmentId' , foreignKey: 'id' }); 
Report.hasOne(Area, { sourceKey: 'areaId' , foreignKey: 'id' }); 

module.exports = Report; 
