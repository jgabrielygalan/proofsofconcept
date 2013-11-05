var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

server.listen(9000);


function getRandNum() {
    return Math.floor(Math.random() * 369064) + 1;
}

function getRandIdFromDeck() {
  var deck = [289327,233242,366302,191371,253680,368473,177560,368482,253681,243455,193400,83771,290529,290543,136142,214050,253561,230082,213799,193428,235597,368485,180613,266017,145969,136204,233055,217825,141976,193660,180613,205075,130816,247425,145969,233069];
  return deck[Math.floor(Math.random()*deck.length)];
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
    fn(getRandNumFromDeck());
  });
});
