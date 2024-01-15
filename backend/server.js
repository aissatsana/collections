const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const collectionRoutes = require('./routes/collection'); 
const dataRoutes = require('./routes/data');
const itemsRouter = require('./routes/item');
const path = require('path');
const http = require('http');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '../build')));

const server = http.createServer(app);

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/data', dataRoutes);  
app.use('/api/collection', collectionRoutes);
app.use('/api/collection', itemsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
