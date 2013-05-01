var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

server.listen(9000);


function getRandNum() {
    return Math.floor(Math.random() * 369064) + 1;
}


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('intro', { msg: 'Welcome to the chat' });

  socket.on('msg', function (data) {
    console.log("received msg event:",data);
    socket.broadcast.emit('msg', data);
  });

  socket.on('cardMoved', function(data) {
    console.log("received cardMoved: ", data);
    socket.broadcast.emit('cardMoved', data);
  });

  socket.on("drawCard", function(name, fn){
    fn(getRandNum());
  });
});
