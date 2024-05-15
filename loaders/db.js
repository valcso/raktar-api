const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path   = require('path');

dotenv.config();

/**
 * Sets the mongoDB connection url and the connection options
 * @returns 
 */
exports.setEnvironment = async() => {

  var data = {};

  if (process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development') {
    data.mongoUrl = process.env.MONGODB;
  } else {
    data.mongoUrl = process.env.MONGODB_PROD;
  }

  if (process.env.NODE_ENV == 'production') {

    data.connectionSetup = {


      tlsAllowInvalidHostnames: true,
      tls: true,
      tlsCAFile: path.join(__dirname, "../certificates/rds-combined-ca-bundle.pem"),
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auth: {
        user: process.env.DOCUMENT_DB_USER,
        password: process.env.DOCUMENT_DB_PASSWORD
      }
    };
  } else {

    data.connectionSetup = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }

  return data;
}

/**
 * Connects to the database
 * @returns 
 */
exports.connectToDB = async (mongoUrl, connectionSetup) => {

  mongoose.connect(mongoUrl, connectionSetup);

  mongoose.connection.on('connected', () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(
          'Connection Opened.',
          process.env.NODE_ENV === 'test' ? process.env.MONGODB_TEST : process.env.MONGODB,
      );
    }
  });

  mongoose.connection.on('error', (err) => {
    console.log('Error with db connection.', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Disconnected..');
    }
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Terminated');
      process.exit(0);
    });
  });
}


  this.setEnvironment().then(async (response) => {
  await this.connectToDB(response.mongoUrl, response.connectionSetup);
});



