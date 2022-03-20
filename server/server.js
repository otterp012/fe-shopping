const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const searchRouter = require('./routers/search.js');
const staticPath = path.join(__dirname, '../static/views');

app.use(express.static(staticPath));

app.get('/', (request, response) => {
  response.sendFile('index.html', { root: staticPath });
});

app.use('/search', searchRouter);

app.listen(PORT, err => {
  if (err) console.log(` ⚠️${err}`);
  console.log('🌐 Server is working : PORT - ', PORT);
});
