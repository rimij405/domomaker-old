// Using statements.
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csurf = require('csurf');

// Set port.
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Database URL.
const db = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

// Connect to the database.
mongoose.connect(db, (err) => {
  if (err) {
    console.log(`Could not connect to the database at ${db}.`);
    throw err;
  }
});

let redisURL = {
  hostname: 'localhost',
  port: 6379
};

let redisPASS;

if(process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}

// Pull in the router.
const router = require('./router.js');

// Set up the express application.
const app = express();

// Set up server routes.
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS
  }),
  secret: 'iae2784 - Domo Arigato',
  resave: 'true',
  saveUninitialized: true,
  cookie: {
    httpOnly: true
  }
}));

// Set up view engine and views.
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

// has to come after app.use(cookieParser());
app.use(csurf());
app.use((err, req, res, next) => {
  if(err.code !== 'EBADCSRFTOKEN') return next(err);
  console.log('Missing CSRF token');
  return false;
});

// Set up additional routes.
router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}:`);
});
