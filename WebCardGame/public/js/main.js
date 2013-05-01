function addToChatContent(msg) {
	$('#chatContent').append("<br/>").append(document.createTextNode(msg));
}

function newChatMessage(socket, msg) {
	addToChatContent("> " + msg);
	socket.emit('msg', {msg: msg});
}

function setupSocket() {
	return io.connect();
}

function setupSocketEvents(socket) {
	socket.on('intro', function (data) {
		addToChatContent(data.msg);
	});

	socket.on('msg', function(data) {
		addToChatContent("< " + data.msg);
	});

	socket.on('cardMoved', function(data) {
		console.log("cardMoved", data);
		$("#card1").css({top: data.top, left: data.left, position:'relative'});
	});
}

function drawCard(socket) {
	socket.emit("drawCard", {}, function(data) {
		var element = $("<div class='card handCard'>");
		element.css("background-image", "url(http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=" + data + ")");
		$("#hand").append(element);
	});
}

function setAsDraggable(element, socket) {
	element.draggable({
		containment: "parent",
		stop: function( event, ui ) {
			socket.emit('cardMoved', {top: ui.position.top, left: ui.position.left});
		}
	});
}


$(function() {
	var socket = setupSocket();
	setupSocketEvents(socket);

	setAsDraggable($(".draggable"), socket);

	$("#mats").on("mouseover", ".card", function(){
		var url = $(this).css("background-image").replace('url(', '').replace(')', '');
		$("#cardBig").css("background-image", "url(" + url + ")");
	});

	$("#hand").on("click", ".card", function(){
		var element = $(this).appendTo($("#myBattlefield"));
		setAsDraggable(element, socket);
	});

	$("#sendButton").click(function(){
		var msg = $('#message').val();
		newChatMessage(socket, msg);
	});

	$("#library").click(function() {
		drawCard(socket);
	});

});
