
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

module.exports = {
     jwtTokenSecretKey : process.env.JWT_TOKEN_SECRET_KEY,
     bcryptSalt: process.env.BCRYPT_SALT,
     port: process.env.PORT,
     mysql:{ 
          username: process.env.SQL_DB_USER_NAME,
          password: process.env.SQL_DB_PASSWORD,
          database: process.env.SQL_DB_DATA_BASE_NAME,
          host: process.env.SQL_DB_HOST,
          dialect: process.env.SQL_DB_DIALECT,
          rejectUnauthorizedSllConnection: process.env.REJECT_UNAUTHORIZED_SLL_CONNECTION
   }, 
     tokenExpirationDurationInHours: process.env.TOKEN_EXPIRATION_DURATION_IN_HOURS,
   awsBucket:{
     awsRegion: process.env.AWS_REGION,
     awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID, 
     awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
     awsSessionToken: process.env.AWS_SESSION_TOKEN,
     awsBucketName:  process.env.AWS_BUCKET_NAME,
   },
   emailService : {
    emailServiceSenderEmail: process.env.EMAIL_SERVICE_SENDER_EMAIL_ADDRESS,
    emailServiceSenderPassword: process.env.EMAIL_SERVICE_SENDER_EMAIL_PASSWORD
   } ,
   minReportsOnMonthToSendEmail : process.env.MIN_NUM_OF_REPORTS_PER_MONTH
}



