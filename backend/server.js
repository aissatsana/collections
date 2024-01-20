const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const collectionRoutes = require('./routes/collection'); 
const dataRoutes = require('./routes/data');
const itemsRouter = require('./routes/item');
const likesRouter = require('./routes/likes')
const commentsRouter = require('./routes/comments');
const adminRouter = require('./routes/admin');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '../build')));

const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/data', dataRoutes);  
app.use('/api/collection', collectionRoutes);
app.use('/api/items', itemsRouter);
app.use('/api/likes', likesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/admin', adminRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('joinItemRoom', (itemId) => {
    socket.join(`item_${itemId}`);
  });
  
  socket.on('newComment', (comment) => {
    console.log('updating comment');
    io.to(`item_${comment.item_id}`).emit('updateComments', comment);
  });
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
