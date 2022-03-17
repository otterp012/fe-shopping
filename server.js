const express = require('express');
const path = require('path');

const categoryData = require('./data/data.json');

const app = express();
const port = 3000;

app.get('/', (request, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(__dirname));

app.get('/categoryData', (req, res) => {
  res.json(categoryData.filterOptions);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
