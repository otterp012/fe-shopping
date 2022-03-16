const express = require('express');

const app = express();
const port = 3000;

app.get('/', (request, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
