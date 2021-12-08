var express = require('express');
var router = express.Router();
const fs = require('fs');
const { Server } = require('http');
const logger = require('../config/winston');

router.post('/register-new', function(req, res) {
  logger.log({
    // Message to be logged
        message: 'New registration: '+ req.body.email + ', ' + req.body.affilliation,
    
    // Level of the message logging
        level: 'info'
    });
    res.send('complete');
  });


module.exports = router;
