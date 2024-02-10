const Sequelize = require('sequelize');
const { mysql } = require('./envVariables');

const retry = {
  match: [
    /ETIMEDOUT/,
    /EHOSTUNREACH/,
    /ECONNRESET/,
    /ECONNREFUSED/,
    /ETIMEDOUT/,
    /ESOCKETTIMEDOUT/,
    /EHOSTUNREACH/,
    /EPIPE/,
    /EAI_AGAIN/,
    /SequelizeConnectionError/,
    /SequelizeConnectionRefusedError/,
    /SequelizeHostNotFoundError/,
    /SequelizeHostNotReachableError/,
    /SequelizeInvalidConnectionError/,
    /SequelizeConnectionTimedOutError/,
  ],
  max: 5,
}


const sequelize = new Sequelize(mysql.database, mysql.username, mysql.password,{
    host: mysql.host,
    dialect: 'mysql',
    logging: false,
    define:{
      freezeTableName: true,
    },
    retry,
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000, 
    },
    dialectOptions: {
    ssl: {
    rejectUnauthorized: (mysql.rejectUnauthorizedSllConnection === 'true' ),
    }
    }
    });

sequelize
  .authenticate()
  .then(() => {
    console.log('[sequelize.js] Sequelize connection has been established successfully.');
  })
  .catch((err) => {
    console.log('[sequelize.js] Sequelize is unable to connect to the database:', err);
  });
 
module.exports = sequelize;



