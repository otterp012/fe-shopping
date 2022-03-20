const server = require('express');
const router = server.Router();
const searchKeywords = require('../data/searchKeywords.json');

const searchRouter = (request, response) => {
  try {
    response.json(searchKeywords);
  } catch (err) {
    response.status(500).send(err);
  }
};

router.get('/', searchRouter);

module.exports = router;
