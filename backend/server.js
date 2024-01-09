const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const collectionRoutes = require('./routes/collection'); 
const dataRoutes = require('./routes/data');
const path = require('path');
const http = require('http');
const session = require('express-session');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3001;
const secretKey = crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const server = http.createServer(app);

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/data', dataRoutes);  
app.use('/collection', collectionRoutes);


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
