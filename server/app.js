// Using statements.
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');

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

// Pull in the router.
const router = require('./router.js');

// Set up the express application.
const app = express();

// Set up server routes.
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Set up view engine and views.
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

// Set up additional routes.
router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}:`);
});
