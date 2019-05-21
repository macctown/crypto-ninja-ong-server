var express = require('express');
var app = express();

// view engine setup
var path = require('path');
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

var dataService = require('./services/dataService');
dataService.init();

var indexRouter = require('./routes/index');
var restRouter = require('./routes/rest');

app.use(express.static('./static'));

app.use('/', indexRouter);

app.use('/api', restRouter);

var port = process.env.PORT || 8080;
var server = app.listen(port);
console.log('Server listening on port ' + port);

var gracefulShutdown = function() {
    console.log("Received kill signal, shutting down gracefully.");
    dataService.close();
    server.close(function() {
        console.log("Closed out remaining connections.");
        process.exit();
    });

    // if after 
    setTimeout(function() {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit();
    }, 10 * 1000);
};

// listen for TERM signal .e.g. kill 
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);