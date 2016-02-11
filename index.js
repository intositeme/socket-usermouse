var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connectedUsers = 0;
var clients = [];

var PORT = 13000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/src/index.html');
});

io.on('connection', function(socket){
	connectedUsers++;
	socket.emit('connected', {id:socket.id, msg:"connected", others: clients } );

	clients.push(socket.id);
	io.emit('new-user', socket.id );

	socket.on('disconnect', function(){
		removeClient(socket.id);
		io.emit('user-quit', socket.id );
	});

	socket.on('event', function(msg){
		io.emit('event', msg );
	});

	socket.on('mouse-event', function(msg){
		io.emit('mouse-event', msg );
	});

});

http.listen(PORT, function(){
  	console.log('listening on *:' + PORT);
});

function removeClient (id) {
	var tIndex = clients.indexOf(id);
	clients.splice(tIndex, 1);
}