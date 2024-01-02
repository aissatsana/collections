const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); 
const path = require('path');
const http = require('http');

const app = express();
const port = process.env.PORT || 3001;
app.use(express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const server = http.createServer(app);

app.use(bodyParser.json());

app.use('/auth', authRoutes);


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
