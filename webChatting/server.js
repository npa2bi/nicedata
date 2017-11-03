var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get("/",function(req, res){
  res.sendfile("client.html");
});

app.get("/sound/",function(req, res){
  res.sendfile("Track_68.mp3");
});

var count=1;
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  var name = "user" + count++;
  io.to(socket.id).emit('change name',name);
  //io.to(socket.id).emit('comein name', '누군가 입장하였습니다.');

  socket.on('disconnect', function(){
    console.log('user disconnected: ', socket.id);
    io.to(socket.id).emit('disconnect chattingRoom','누군가 퇴장하였습니다.');
  });

  socket.on('send message', function(name,text){
    //var msg = name + ' : ' + text;
    var msg = text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen('3100', function(){
  console.log("server on!");
});
