const { DataTypes } = require('sequelize');
const  sequelize = require('../../../config/sequalize');

const ReportImages = sequelize.define('ReportImages', {
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
  imageName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true
});   

module.exports = ReportImages;
  