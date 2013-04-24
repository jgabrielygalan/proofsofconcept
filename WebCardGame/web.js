var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(9000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('intro', { msg: 'Welcome to the chat' });
  
  socket.on('msg', function (data) {
  	console.log("received msg event:" + data);
    socket.broadcast.emit('msg', data);
  });

  socket.on('cardMoved', function(data) {
  	console.log("received cardMoved: " + data);
  	socket.broadcast.emit('cardMoved', data);
  });
});