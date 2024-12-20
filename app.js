const express = require("express");
const http = require("http");
// const path = require("path");

const mongoose = require("mongoose");
const configDb = require("./database/Database.json");
const eventRouter = require('./routes/events');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', eventRouter);

mongoose.connect('mongodb://localhost:27017/testnodejs', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error('MongoDB connection error:', err));

io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
      console.log('A client disconnected');
  });
});

//const io = socketIO(server);
server.listen(3000,()=> console.log("server started"))