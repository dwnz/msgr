
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');

var http = require('http'),
    path = require('path'),
    connect = require('connect');

var app = express();

var cookieParser = express.cookieParser('your secret sauce')
  , sessionStore = new connect.middleware.session.MemoryStore();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});

var server = http.createServer(app)
, io = require('socket.io').listen(server);

var SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);


var sockets = [];

io.sockets.on('connection', function (socket) {
    // Return data straight back
    socket.on('chat', function(data) {
        for (var i = 0; i < sockets.length; i++) {
            sockets[i].emit('chat', data);
        }
    });

    sockets.push(socket);
});

//sessionSockets.on('connection', function (err, socket, session) {
//  socket.emit('session', session);

//  socket.on('foo', function(value) {
//    session.foo = value;
//    session.save();
//    socket.emit('session', session);
//  });
//});

server.listen(app.get('port'));
