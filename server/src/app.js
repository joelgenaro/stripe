const express = require('express');
const compression = require('compression');
const path = require("path");
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const secureEnv = require('secure-env');
global.env = secureEnv({ secret: '9cW7@0LY%0F0R@KOj5cL90yv' });

const middlewares = require('./middlewares');
const apiRoutes = require('./routes/api');
const { dbConnect, seedUser, seedMembership } = require('./services/db');
const app = express();

const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
        // Will not compress responses, if this header is present
        return false;
    }
    // Resort to standard compression
    return compression.filter(req, res);
};
// Compress all HTTP responses
app.use(compression({
    // filter: Decide if the answer should be compressed or not,
    // depending on the 'shouldCompress' function above
    filter: shouldCompress,
    // threshold: It is the byte threshold for the response 
    // body size before considering compression, the default is 1 kB
    threshold: 512
}));
app.disable('x-powered-by')

// app.use(compression())

app.use(express.static(path.join(__dirname, "/../public")));
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dbConnect(global.env.DB_URL);
seedUser();
seedMembership();
app.use('/api/v1', apiRoutes);

app.all('*', function (req, res) {
    res.sendFile(path.join(__dirname, "/../public/index.html"));
});
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;