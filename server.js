const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;
var allData = [];
//require('./src/config/database')
//const user_routes = require('./src/user/users.routes');


app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
var allClients=[];
//app.use('/User', user_routes)
io.on('connection', (socket) => {
  //socket.emit('create', 'room1');

  console.log('a user connected');
      socket.on('create', function(data) {
        allClients.push(data.user);
        io.sockets.emit('online_users',allClients);

        console.log("room",data.room);
         socket.join(data.room);
      });


      
  socket.on('online_users',(clients)=>{
    console.log("clients",clients);

  })


  socket.on('disconnect',(socket_id)=>{
  //    console.log("clients",clients);
    if(allClients.length>0){
      var index = allClients.findIndex(o => o.socket_id == socket_id);
      allClients.splice(index, 1);
    }
    io.sockets.emit('online_users',allClients);
  })


  socket.on('clear_clients',()=>{
    //    console.log("clients",clients);
      allClients =[];
      io.sockets.emit('clear_clients',allClients);
  })

      //allClients.push(socket.id);
      //setOnline(allClients.length);
      // socket.once('disconnect', function() {
      //     console.log('Got disconnect!');

      //     var i = allClients.indexOf(socket.id);
      //     allClients.splice(i, 1);
      //     setOnline(allClients.length);
      // });


    //  io.emit("online", allClients);

    //  io.sockets.in(room).emit('event', data);

  socket.on('send_message',(data)=>{
    console.log("received message in server side",data);
    //allData.push(data);
    //io.emit('received_message',data[0])
    io.sockets.in(data.room).emit('received_message',data);

  })


  // socket.on('update_message',(data)=>{
  //   //console.log("received message in server side",data);
  //   //allData.push(data);
  //   allData = data;
  //   io.emit('received_message',allData)
  // })

  socket.on('disconnect_room', (socket) => {    
    // var i = allClients.indexOf(socket.id);
    // allClients.splice(i, 1);
    // io.emit("online", allClients);
    if(allClients.length>0){
      var index = allClients.findIndex(o => o.socket_id == socket.id);
      allClients.splice(index, 1);

    }
    io.sockets.emit('online_users',allClients);

    console.log('user disconnected');
  });
  
});

server.listen(port, () => {
  //console.log( `Server running at http://localhost:${port}/`);
});