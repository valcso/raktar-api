const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const compression = require('compression');
const net = require('net');

dotenv.config();

require('./loaders/db');
// End loaders

const app = express();

// **** Middleware ****
app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static('public'));
app.use(compression());
app.use(useragent.express());

// ---- End Middleware ----

// **** Routes ****
const routes = {
  clients: require('./routes/Clients/route.js'),
  auth: require('./routes/Auth/route.js'), 
  users: require('./routes/Users/route.js'), 
  categories: require('./routes/Categories/route.js'), 
  customers: require('./routes/Customers/route.js'),
  products: require('./routes/Products/route.js'), 
  orders: require('./routes/Orders/route.js'), 
  statistics : require('./routes/Statistics/route.js'),
};

routes.clients(app);
routes.auth(app);
routes.users(app);
routes.categories(app);
routes.customers(app);
routes.products(app);
routes.orders(app);
routes.statistics(app);

// ----End routes----

// ----End check dependencies----
app.set('trust proxy', true);

app.get('/', (req, res) => {
  res.send('Hello World');
});


var portInUse = function (port, callback) {
  var server = net.createServer(function (socket) {
    socket.write('Echo server\r\n');
    socket.pipe(socket);
  });
  server.on('error', function (e) {
    callback(true);
  });
  server.on('listening', function (e) {
    server.close();
    callback(false);
  });
  server.listen(port, '127.0.0.1');
};
portInUse(process.env.PORT, function (returnValue) {
  if (!returnValue) {
    app.listen(process.env.PORT || 8081, () => {
      console.log('Node app is running on port', process.env.PORT || 8081);
    });
  } else {
    console.log('Node app is running on port', process.env.PORT || 8081);
  }
});

module.exports = app;
