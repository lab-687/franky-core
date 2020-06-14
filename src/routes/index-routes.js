const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5000"); 
  res.status(200).send({message: 'Franky Core'});
});

module.exports = router;
