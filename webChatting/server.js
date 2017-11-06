var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var count=1;
var userlist = new Array();

app.use('/static', express.static(__dirname + '/public'));

app.get("/",function(req, res){
    res.sendfile("chatRoomList.html");
});

app.get("/chattingRoom/",function(req, res){
    var roomnum = decodeURIComponent(req.query.roomnum);
    var roompw = decodeURIComponent(req.query.roompw);
    var nicknm = decodeURIComponent(req.query.nicknm);
    console.log('[ '+ nicknm + ' ] 님이 --' + roomnum +'-- 방을 선택하였습니다.');
    res.sendfile("client.html");
});

io.on('connection', function(socket){

    console.log('user connected: ', socket.id);
    var name = "user" + count++;
    userlist.push(socket.id);
    io.to(socket.id).emit('change name',name);
    console.log('user list: ', userlist);

    socket.on('disconnect', function(){
        console.log('user disconnected: ', socket.id);
        io.emit().emit('receive message','누군가 퇴장하였습니다.');
        var idx = userlist.indexOf(socket.id);
        if (idx > -1){
            userlist.splice(idx, 1);
        }
        console.log('user list: ', userlist);

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
